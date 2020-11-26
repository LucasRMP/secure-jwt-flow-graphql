import jwt from 'jsonwebtoken'
import { User } from '../entity/User'

export function createAccessToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: '10s',
    },
  )
}
