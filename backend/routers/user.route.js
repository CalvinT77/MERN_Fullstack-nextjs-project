import { login, logout, profile, register, verify } from "../controllers/user.controller.js";
import express from 'express'
import { authenticate } from "../middleware/authentication.js";

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.get('/profile', authenticate, profile)
authRouter.post('/logout', authenticate, logout)
authRouter.get('/verify/:token', verify)

export default authRouter