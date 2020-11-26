import { JsonWebTokenError, verify } from 'jsonwebtoken'
import { MiddlewareFn } from 'type-graphql'
import { ApolloContext } from './Context'

const isAuth: MiddlewareFn<ApolloContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization']

  if (!authorization) {
    throw new JsonWebTokenError('No credentials provided')
  }

  const [bearer, token] = authorization.split(' ')

  if (bearer.toLowerCase() !== 'bearer') {
    throw new JsonWebTokenError('Invalid credentials')
  }

  try {
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!)

    context.payload = payload as any
    context.isAuth = true

    return next()
  } catch (err) {
    console.log(err)
    throw new JsonWebTokenError(err.message || 'Invalid credentials')
  }
}

export default isAuth
