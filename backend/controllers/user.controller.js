import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { generateJWT } from "../utils/generateJWT.js";
import crypto from 'crypto'
import { sendEmail } from "../utils/sendEmail.js";

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        // search for the user's email input
        const user = await User.findOne({ email })

        // if the user is not found, give an invalid error
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credientals" })
        }

        // if the user exists then check if the password is correct.
        const isMatch = await bcrypt.compare(password, user.password)

        // if the password is false, then return invalid
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credientials" })
        }

        // if the user is not verfied, send them an id
        if (user.isVerified == false) {

            // create a verify id for params on the link
            const verifyId = crypto.randomBytes(64).toString('hex')

            // set the verifed link timer to now + 5 minutes
            const verificationTimeLimit = Date.now() + 1000 * 60 * 5

            // create a link
            const verificationLink = `${process.env.URI_LINK}/verify/${verifyId}`

            // send email to user with verify link
            sendEmail(email, verificationLink)

            await user.updateOne({ verificationCode: verifyId, verificationExpires: verificationTimeLimit })

            return res.status(400).json({ success: false, message: "User is not verified"})
        }

        // generate a token for the user
        generateJWT(res, { id: user.id, fullName: user.fullName })

        // update when the user lasted logged in
        await user.updateOne({ lastLoggedIn: Date.now() })

        // return the status of successfully logging in
        return res.status(201).json({ success: true, message: "Successfully logged in " })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error: " + error })
    }
}

export const register = async (req, res) => {
    const { fullName, email, password } = req.body

    try {
        const user = await User.findOne({ email })

        // check if the user already exists via the email
        if (user) {
            return res.status(400).json({ success: false, message: "Email already registered" })
        }

        // check if all the fields are field in, if not return an error
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "All required field not filled" })
        }

        // create a verify id for params on the link
        const verifyId = crypto.randomBytes(64).toString('hex')


        // set the verifed link timer to now + 5 minutes
        const verificationTimeLimit = Date.now() + 1000 * 60 * 5

        // create a user using the new information
        const newUser = new User({ fullName: fullName, email: email, password: password, verificationCode: verifyId, verificationExpires: verificationTimeLimit })

        const salt = await bcrypt.genSalt(10)
        newUser.password = await bcrypt.hash(password, salt)

        // add new user to the database
        await newUser.save()

        // create a link
        const verificationLink = `${process.env.URI_LINK}/verify/${verifyId}`

        // send email to user with verify link
        sendEmail(email, verificationLink)

        return res.status(200).json({ success: true, message: "Successfully registed, waiting for verification" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error: " + error })
    }
}

export const verify = async (req, res) => {
    const { token } = req.params

    // searches for the user
    const userAccount = await User.findOne({ verificationCode: token })

    // if the user does not exist
    if (!userAccount) {
        return res.status(400).json({ success: false, message: "Invalid verification code, it was not found " + token })
    }

    // if the user does exist but the code expired
    if (userAccount.verificationExpires < Date.now()) {
        return res.status(400).json({ success: false, message: "Invalid verification code, it expired" })
    }

    // if all is well, verify the account.
    userAccount.isVerified = true

    userAccount.verificationCode = undefined
    userAccount.verificationExpires = Date.now()

    const fullName = userAccount.fullName

    // save account
    await userAccount.save()

    return res.status(200).json({ success: true, message: "User successfully verified", userData: fullName })
}


export const logout = async (req, res) => {
    res.clearCookie('jwt')
    res.status(200).send('Logged out successfully')
}

export const profile = async (req, res) => {
    const { id, fullName } = req.user

    return res.status(200).json({ success: true, profile: { id: id, fullName: fullName }, message: `Welcome ${fullName}` })
}