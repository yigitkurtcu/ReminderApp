import jwt from 'jsonwebtoken'
import secrets from '../../config'

export const getUserId = request => {
  const header = request.request.headers.authorization

  if (!header) throw new Error('Authentication required!')

  const token = header.replace('Bearer ', '')
  const decoded = jwt.verify(token, secrets.SECRET_KEY)
  return decoded.userId
}

export const generateToken = userId => {
  return jwt.sign({ userId }, secrets.SECRET_KEY, { expiresIn: '7 days' })
}
