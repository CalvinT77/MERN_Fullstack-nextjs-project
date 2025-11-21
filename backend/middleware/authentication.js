import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
    // grabs the user's token
    const token = req.cookies.jwt

    // if there was no token grabbed, give an error
    if(!token) {
        return res.status(401).json({ success: false, message: 'No token provided'})
    }

    try {
        // decodes the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // sets a req user to the decoded jwt
        req.user = decoded
        // sets to the handler
        next()

    } catch (error) {
        return res.status(403).json({success: false, message: "Token Invalid"})
    }
}