import { Field, Int, ObjectType } from 'type-graphql'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  email: string

  @Column()
  password: string

  @Field() //! Test pruposes, this should not be a field
  @Column('int', {
    default: 0,
  })
  tokenVersion: number
}
