import express from 'express'
import "dotenv/config"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRouter from './routers/user.route.js'

const app = express()

// middle ware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}
))
app.use(express.json())
app.use(cookieParser())

app.use('/api/user', authRouter)

const PORT = process.env.PORT

app.listen(PORT, () => {
    connectDB()
    console.log("Server is running on port:", PORT)
})