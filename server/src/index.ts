import { config } from 'dotenv'
config()

import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { UserResolver } from './UserResolver'
import { verify } from 'jsonwebtoken'
import { User } from './entity/User'
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from './utils/auth'

async function init() {
  await createConnection()

  const app = express()
  app.use(
    cors({
      origin: process.env.WEB_APP_URL,
      credentials: true,
    }),
  )
  app.use(cookieParser())

  app.post('/refresh_token', async (req, res) => {
    console.log('refreshing token')
    const token = req.cookies.rmp

    if (!token) {
      return res.json({ ok: false, accessToken: '' })
    }

    let payload: any
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
    } catch (err) {
      console.log(err)
      return res.json({ ok: false, accessToken: '' })
    }

    const user = await User.findOne({ where: { id: payload.userId } })

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res.json({ ok: false, accessToken: '' })
    }

    sendRefreshToken(res, createRefreshToken(user))

    return res.json({ ok: true, accessToken: createAccessToken(user) })
  })

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),

    context: ({ req, res }) => ({
      req,
      res,
    }),
  })

  server.applyMiddleware({ app, cors: false })

  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`✨ Your server is running on port ${port}`)
  })
}
init()
