import jwt from 'jsonwebtoken'
import secrets from '../../config'

export const getUserId = (request): string => {
  const header: string = request.request.headers.authorization
  if (!header) throw new Error('Authentication required!')

  const token: string = header.replace('Bearer ', '')
  const decoded: { userId: string } = jwt.verify(token, secrets.SECRET_KEY)
  return decoded.userId
}

export const generateToken = userId => {
  return jwt.sign({ userId }, secrets.SECRET_KEY, { expiresIn: '7 days' })
}
