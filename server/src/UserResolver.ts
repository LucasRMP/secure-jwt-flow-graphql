import {
  Arg,
  Ctx,
  Field,
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

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
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
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async testAuthentication(@Ctx() ctx: ApolloContext): Promise<String> {
    return ctx.payload!.userId
  }
}
