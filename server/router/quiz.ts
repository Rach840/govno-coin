import express from 'express'
import { generateQuestions, validateAnswers } from '../controllers/quizController'
//1
const router = express.Router()

router.post('/generate-questions', generateQuestions)
router.post('/validate-answers', validateAnswers)

export default router
