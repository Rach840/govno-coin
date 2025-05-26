import { Request, Response } from "express";
import crypto from "crypto";
import db from "../database/db";
import { DateTime } from "luxon";
import { hashTgId, generateRefCode } from "../controllers/hashController";

const dotenv = require("dotenv");
dotenv.config();

const BOT_TOKEN = process.env.TG_TOKEN || "test";
const MAX_TIME_DIFF = 300; // 5 минут
const secretKey = crypto
   .createHmac("sha256", Buffer.from("WebAppData", "utf-8"))
   .update(BOT_TOKEN)
   .digest();

export const validate_user = async (req: Request, res: Response) => {
   const { initData, initDataUnsafe } = req.body;
   const user_id = initDataUnsafe?.user?.id;

   console.log("🔍 Проверка пользователя:", user_id);

   if (!initData) {
      res.status(403).json({ error: "initData is required" });
      return;
   }

   const validationResult = validateInitData(initData);

   if (validationResult.error) {
      res.status(validationResult.status).json({
         error: validationResult.error,
      });
      return;
   }

   try {
      await db.tx("validate-user-tx", async (t) => {
         const userData = await t.oneOrNone(
            `
        WITH updated_user AS (
          UPDATE govno_db.users 
          SET last_login = NOW() 
          WHERE tg_user_hash = $1 
          RETURNING tg_user_hash, user_banned
        ), updated_reminders AS (
          UPDATE govno_db.reminder_logs 
          SET reminder_type = NULL 
          WHERE tg_user_hash = $1
          RETURNING tg_user_hash
        )
        SELECT 
          COALESCE((SELECT tg_user_hash FROM updated_user), (SELECT tg_user_hash FROM govno_db.users WHERE tg_user_hash = $1)) AS user_id,
          COALESCE((SELECT user_banned FROM updated_user), (SELECT user_banned FROM govno_db.users WHERE tg_user_hash = $1)) AS user_banned;
        `,
            [hashTgId(user_id)],
         );

         if (!userData || !userData.user_id) {
            console.log("⚠️ Пользователь не найден:", user_id);
            res.status(200).json({ message: "User not found" });
            return;
         }

         if (userData.user_banned) {
            console.log("⛔ Пользователь забанен:", user_id);
            res.status(203).json({ message: "User is banned" });
            return;
         }

         // 🔁 Вызов трекинга стрика
         await updateLoginStreak(user_id, t);

         console.log("✅ Пользователь найден и обновлён:", user_id);
         res.status(201).json({ message: "User already exists" });
      });
   } catch (error) {
      console.error("❌ Ошибка при обработке запроса:", error);
      res.status(500).json({ error: "Database error" });
   }
};

export const user_reg = async (req: Request, res: Response) => {
   const {
      user_id,
      username,
      user_age,
      user_height,
      user_weight,
      user_sex,
      user_toilet_visits,
   } = req.body;
   let { referredCode } = req.body;

   if (
      !user_id ||
      !user_age ||
      !user_height ||
      !user_weight ||
      !user_toilet_visits
   ) {
      res.status(403).json({ error: "Missing required fields" });
      return;
   }

   try {
      await db.tx(async (t) => {
         const hashedId = hashTgId(user_id);

         // Проверяем, существует ли уже пользователь
         const existingUser = await t.oneOrNone(
            `SELECT ref_code FROM govno_db.users WHERE tg_user_hash = $1`,
            [hashedId],
         );

         let userRefCode = existingUser
            ? existingUser.ref_code
            : generateRefCode();

         if (!existingUser) {
            // Новый пользователь: создаём запись
            await t.none(
               `INSERT INTO govno_db.users (tg_user_hash, username, ref_code, last_login)
           VALUES ($1, $2, $3, NOW())`,
               [hashedId, username, userRefCode],
            );
            await t.none(
               `INSERT INTO govno_db.user_properties (tg_user_hash, user_age, user_height, user_weight, user_sex, user_toilet_visits)
           VALUES ($1, $2, $3, $4, $5, $6)`,
               [
                  hashedId,
                  user_age,
                  user_height,
                  user_weight,
                  user_sex,
                  user_toilet_visits,
               ],
            );
            console.log("Пользователь успешно зарегистрирован");
         } else {
            console.log("Пользователь уже существует, пропускаем регистрацию");
            return;
         }

         // Обработка реферала
         if (referredCode && referredCode !== userRefCode) {
            const referredUser = await t.oneOrNone(
               `SELECT tg_user_hash, username FROM govno_db.users WHERE ref_code = $1`,
               [referredCode],
            );

            if (referredUser) {
               await t.none(
                  `INSERT INTO govno_db.referrals (referral_hash, friend_hash, friend_username, created_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT DO NOTHING;`,
                  [referredUser.tg_user_hash, hashedId, username],
               );
               console.log(
                  `Реферал засчитан от ${referredUser.username ? "@" + referredUser.username : "неизвестного"}`,
               );
            } else {
               console.log("Реферал-код не найден в базе, пропускаем");
            }
         } else {
            console.log("Нет реферал-кода или попытка пригласить самого себя");
         }

         await updateLoginStreak(user_id, t);
      });

      res.sendStatus(200);
      return;
   } catch (error) {
      console.error("Ошибка при регистрации пользователя:", error);
      res.status(500).json({ error: "Database error" });
      return;
   }
};

// Функция для валидации данных initData
export const validateInitData = (initData: string) => {
   const params = new URLSearchParams(initData);
   const hash = params.get("hash");

   if (!hash) {
      console.error("❌ Ошибка: hash не найден");
      return { error: "No hash provided", status: 400 };
   }

   console.log("✅ Hash найден:", hash);

   params.delete("hash");

   const dataCheckString = Array.from(params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .sort()
      .join("\n");

   const generatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

   console.log("🔍 Сгенерированный hash:", generatedHash);

   if (generatedHash !== hash) {
      console.error("❌ Ошибка: hash не совпадает!");
      return { error: "Invalid hash, data might be forged", status: 403 };
   }

   const authDate = parseInt(params.get("auth_date") || "0", 10);
   const currentTime = Math.floor(Date.now() / 1000);

   if (currentTime - authDate > MAX_TIME_DIFF) {
      console.error("❌ Ошибка: данные слишком старые!");
      return { error: "Data is too old", status: 403 };
   }

   return { success: true };
};

async function updateLoginStreak(user_id: number, t: any) {
   const today = DateTime.now().toISODate(); // YYYY-MM-DD
   const yesterday = DateTime.now().minus({ days: 1 }).toISODate();

   const user = await t.oneOrNone(
      `
    SELECT login_streak, last_login_date, max_login_streak
    FROM govno_db.users
    WHERE tg_user_hash = $1
  `,
      [hashTgId(user_id)],
   );

   if (!user) return;

   const lastLogin = user.last_login_date
      ? DateTime.fromISO(user.last_login_date).toISODate()
      : null;

   let newStreak = 1;

   if (lastLogin === today) {
      // Уже заходил сегодня — ничего не делаем
      return;
   } else if (lastLogin === yesterday) {
      // Продолжаем стрик
      newStreak = user.login_streak + 1;
   } else {
      // Пропустил — сбрасываем
      newStreak = 1;
   }

   const newMax = Math.max(newStreak, user.max_login_streak);

   await t.none(
      `
    UPDATE govno_db.users
    SET login_streak = $1,
        max_login_streak = $2,
        last_login_date = $3,
        last_login = NOW()
    WHERE tg_user_hash = $4
  `,
      [newStreak, newMax, today, hashTgId(user_id)],
   );

   // Добавление задач по достижению стрика
   if (newStreak === 7) {
      await t.none(
         `
      INSERT INTO govno_db.user_tasks (user_id, task_id, done, get)
      VALUES ($1, 20, true, false)
      ON CONFLICT DO NOTHING
    `,
         [hashTgId(user_id)],
      );
   } else if (newStreak === 14) {
      await t.none(
         `
      INSERT INTO govno_db.user_tasks (user_id, task_id, done, get)
      VALUES ($1, 21, true, false)
      ON CONFLICT DO NOTHING
    `,
         [hashTgId(user_id)],
      );
   } else if (newStreak === 30) {
      await t.none(
         `
      INSERT INTO govno_db.user_tasks (user_id, task_id, done, get)
      VALUES ($1, 22, true, false)
      ON CONFLICT DO NOTHING
    `,
         [hashTgId(user_id)],
      );
   }

   console.log(
      `✅ Login streak обновлён для ${user_id}: ${newStreak} дней подряд`,
   );
}
