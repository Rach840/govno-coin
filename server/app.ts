import express from 'express'
import path from 'path'
import quizRouter from '@/server/router/quiz'

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Promise Rejection:', reason)
})

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err)
})

const app = express()
const PORT = 3000

app.use(express.json())

app.use('/css', express.static(path.join(__dirname, '../css')))
app.use(express.static(path.join(__dirname, '../html')))

app.use('/quiz', quizRouter)

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`)
})
