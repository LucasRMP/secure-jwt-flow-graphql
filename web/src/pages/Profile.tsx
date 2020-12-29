import React from 'react'
import { useMeQuery } from '../generated/graphql'

interface Props {}

const Profile: React.FC<Props> = () => {
  const { data, error } = useMeQuery()

  if (error) {
    console.log({ error })
    return <div>{error.message}</div>
  }

  if (!data?.me) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <strong>{data.me.id}</strong> - <span>{data.me.email}</span>
    </div>
  )
}

export default Profile
