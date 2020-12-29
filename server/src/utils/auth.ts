import { Response } from 'express'
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
      expiresIn: '10m',
    },
  )
}

export function createRefreshToken(user: User): string {
  return jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '7d',
    },
  )
}

export function sendRefreshToken(res: Response, token: string) {
  res.cookie('rmp', token, {
    httpOnly: true,
  })
}
