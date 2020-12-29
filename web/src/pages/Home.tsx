import React from 'react'
import { useUsersQuery } from '../generated/graphql'

interface Props {}

const Home: React.FC<Props> = () => {
  const { data } = useUsersQuery({ fetchPolicy: 'network-only' })

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>
          {user.id} - {user.email}
        </li>
      ))}
    </ul>
  )
}

export default Home
