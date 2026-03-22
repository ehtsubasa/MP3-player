import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userID, userName, res) => {
  const token = jwt.sign({userID, userName}, process.env.JWT_SECRET, {
    expiresIn: '6h'
  })

  res.cookie('Cookie', token, {
    httpOnly: true,
    maxAge: 6 * 60 * 60 * 1000, // 6h
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development'
  })
}

