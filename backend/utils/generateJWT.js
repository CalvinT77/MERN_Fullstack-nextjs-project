import jwt from 'jsonwebtoken';

export const generateJWT = (res, data) => {
    const token = jwt.sign(data, process.env.JWT_SECRET, {expiresIn: '1h'})

    res.cookie('jwt', token, {
        httpOnly: true, // prevents xss
        secure: process.env.NODE_ENV === 'production', // if this is production make cookie secure
        sameSite: 'strict', // prevents CSRF
        maxAge: 1000 * 60 * 60 // 1 second to 1 minute to 1 hour
    })
}