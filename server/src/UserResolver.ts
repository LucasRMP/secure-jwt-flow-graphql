import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { hash, compare } from 'bcrypt'

import { User } from './entity/User'
import { UserInputError, ValidationError } from 'apollo-server-express'
import { ApolloContext } from './Context'
import isAuth from './isAuth'
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from './utils/auth'
import { verify } from 'jsonwebtoken'

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string

  @Field()
  user: User
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users() {
    return User.find()
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
  ) {
    const hashPassword = await hash(password, 12)

    try {
      await User.insert({ email, password: hashPassword })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
    @Ctx() { res }: ApolloContext,
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new UserInputError('User not found')
    }

    const checkPassword = await compare(password, user.password)
    if (!checkPassword) {
      throw new ValidationError('Wrong password')
    }

    sendRefreshToken(res, createRefreshToken(user))

    const accessToken = createAccessToken(user)

    return {
      accessToken,
      user,
    }
  }

  @Mutation(() => Boolean) //! Test pruposes, this should not be public
  async revokeRefreshTokenForUser(@Arg('userId', () => Int) userId: number) {
    await User.getRepository().increment({ id: userId }, 'tokenVersion', 1)
    return true
  }

  @Query(() => String) //! Test pruposes, this should not exist
  @UseMiddleware(isAuth)
  async testAuthentication(@Ctx() ctx: ApolloContext): Promise<String> {
    return ctx.payload!.userId
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: ApolloContext) {
    const authorization = ctx.req.headers['authorization']

    if (!authorization) {
      return null
    }

    const [bearer, token] = authorization.split(' ')

    if (bearer.toLowerCase() !== 'bearer') {
      return null
    }

    try {
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!)
      const user = await User.findOne(payload.userId)
      return user
    } catch (err) {
      console.log(err)
      return null
    }
  }
}
