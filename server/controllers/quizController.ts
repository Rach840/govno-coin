import { Request, Response } from "express";
import db from "@/server/database/db";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { hashTgId } from "@/server/controllers/hashController";

dotenv.config();

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

async function callOpenAIWithRetry(
   payload: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
   maxRetries = 3,
   delayMs = 1000,
): Promise<OpenAI.Chat.ChatCompletion> {
   for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
         const response = await openai.chat.completions.create(payload);

         if ("choices" in response) {
            return response;
         } else {
            throw new Error(
               "Получен потоковый ответ вместо обычного. Ожидался обычный ответ.",
            );
         }
      } catch (error: any) {
         const status = error.status;
         console.error(`Попытка ${attempt} неудачна:`, status, error.message);

         if (
            attempt === maxRetries ||
            (status && status !== 429 && status !== 500)
         ) {
            throw error;
         }

         await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
   }

   throw new Error(
      "Не удалось получить ответ от OpenAI после нескольких попыток",
   );
}

function cleanResponse(responseText: string): string {
   const cleanedText = responseText.replace(/```json|```/g, "").trim();

   return cleanedText;
}

export const generateQuestions = async (req: Request, res: Response) => {
   const { user_id } = req.body;
   if (!user_id) {
      res.sendStatus(403);
      return;
   }

   try {
      const tg_hash = hashTgId(user_id);

      const user = await db.oneOrNone(
         `SELECT last_quiz_generate_time, user_banned FROM govno_db.users WHERE tg_user_hash = $1`,
         [tg_hash],
      );

      if (!user) {
         res.status(404).json({ error: "Пользователь не найден" });
         return;
      }

      if (user.user_banned) {
         res.status(444).json({ error: "Пользователь забанен" });
         return;
      }

      if (user.last_quiz_generate_time) {
         const last = new Date(user.last_quiz_generate_time);
         const now = new Date();

         const diff = (now.getTime() - last.getTime()) / (1000 * 60 * 60); // часы
         if (diff < 24) {
            res.status(403).json({
               error: "Вопросы можно генерировать раз в сутки",
            });
            return;
         }
      }

      const completion = await callOpenAIWithRetry({
         model: "gpt-4o-mini",
         messages: [
            {
               role: "system",
               content:
                  'Сгенерируй 10 различных, необычных, интересных и трешовых вопросов по теме "говно", подразумевая что ответ на эти вопросы будет одно-два слова или какое-то число. Ответ должен быть ТОЛЬКО в формате чистого JSON массива строк на русском языке. Каждый вопрос должен быть уникальным и интересным. Избегай шаблонных фраз и вопросов.',
            },
         ],
         temperature: 0.8,
      });

      const questionsText = completion.choices[0].message.content || "";
      console.log("Ответ от OpenAI:", questionsText);

      const cleanedText = cleanResponse(questionsText);
      let questions: string[];

      try {
         questions = JSON.parse(cleanedText);
      } catch (err: any) {
         console.error("Ошибка JSON:", err.message);
         res.status(400).json({ error: "Некорректный формат от AI" });
         return;
      }

      if (!Array.isArray(questions)) {
         res.status(400).json({ error: "Некорректный формат от AI" });
         return;
      }

      await db.none(
         `UPDATE govno_db.users SET last_quiz_generate_time = NOW() WHERE tg_user_hash = $1 AND user_banned = false`,
         [tg_hash],
      );

      res.json({ questions });
   } catch (err: any) {
      console.error("❌ Ошибка при генерации:", err.message);
      if (!res.headersSent) {
         res.status(500).json({ error: "Внутренняя ошибка сервера" });
      }
   }
};

export const validateAnswers = async (req: Request, res: Response) => {
   const { questions, answers, user_id } = req.body;

   if (!user_id) {
      res.sendStatus(403);
      return;
   }

   if (
      !Array.isArray(questions) ||
      !Array.isArray(answers) ||
      questions.length !== answers.length
   ) {
      res.status(400).json({ error: "Некорректный формат данных" });
      return;
   }

   try {
      await db.tx(async (t) => {
         const user = await t.oneOrNone(
            ` SELECT last_quiz_answer_time, user_banned
          FROM govno_db.users
          WHERE tg_user_hash = $1
          FOR UPDATE`,
            [hashTgId(user_id)],
         );

         if (!user) {
            throw new Error("Пользователь не найден");
         }

         if (user.user_banned) {
            res.status(444).json({ error: "Пользователь забанен" });
            return;
         }

         if (user.last_quiz_answer_time) {
            const lastAnswerDate = new Date(user.last_quiz_answer_time);
            const now = new Date();
            const diffMs = now.getTime() - lastAnswerDate.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours < 24) {
               throw new Error("Пытались отправить ответы раньше времени");
            }
         }

         await t.none(
            `UPDATE govno_db.users SET last_quiz_answer_time = NOW() WHERE tg_user_hash = $1`,
            [hashTgId(user_id)],
         );

         const completion = await callOpenAIWithRetry({
            model: "gpt-4o-mini",
            messages: [
               {
                  role: "system",
                  content:
                     "Ты помощник, который оценивает ответы на вопросы. Ответь массивом из true/false без лишнего текста. true — если ответ правильный, false — если нет.",
               },
               {
                  role: "user",
                  content: `Вопросы: ${JSON.stringify(questions)}\nОтветы пользователя: ${JSON.stringify(answers)}`,
               },
            ],
            temperature: 0,
         });

         const validationText = completion.choices[0].message.content || "";
         console.log("Ответ от OpenAI:", validationText);

         const cleanedText = validationText
            .replace(/[^\[\]{}:,"0-9a-zA-Z\s]/g, "")
            .trim();
         console.log("Очищенный ответ:", cleanedText);

         let validationResults: boolean[];

         try {
            validationResults = JSON.parse(cleanedText);

            if (!Array.isArray(validationResults)) {
               res.status(400).json({
                  error: "Некорректный формат валидации от AI",
               });
               throw new Error("Некорректный формат валидации от AI");
            }
         } catch (error: any) {
            console.error("Ошибка при парсинге JSON:", error.message);
            res.status(400).json({ error: "Ошибка парсинга ответа от AI" });
            throw error;
         }

         const correctAnswersCount = validationResults.filter(
            (v) => v === true,
         ).length;
         const reward = Number((correctAnswersCount * 0.01).toFixed(6));

         console.log(
            `Правильных ответов: ${correctAnswersCount}, награда: ${reward}`,
         );

         if (reward > 0) {
            await t.none(
               `
          UPDATE govno_db.users 
          SET balance = balance + $1 
          WHERE tg_user_hash = $2
        `,
               [reward, hashTgId(user_id)],
            );

            await t.none(
               `
          UPDATE govno_db.our_loss 
          SET opros_payout = opros_payout + $1 
          WHERE id = TRUE
        `,
               [-reward],
            );
         }

         res.json({ results: validationResults, correctAnswersCount, reward });
      });
   } catch (error: any) {
      console.error("Ошибка при валидации ответов:", error.message);
      if (!res.headersSent) {
         res.status(500).json({ error: "Ошибка валидации ответов" });
      }
   }
};
