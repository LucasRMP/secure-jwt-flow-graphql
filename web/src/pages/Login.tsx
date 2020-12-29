import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { setAccessToken } from '../accessToken'
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql'

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [formState, setFormState] = useState({ email: '', password: '' })

  const [login] = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await login({
      variables: formState,
      update: (store, { data }) => {
        if (!data) {
          return null
        }

        store.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: data.login.user,
          },
        })
      },
    })
    if (res?.data) {
      setAccessToken(res.data.login.accessToken)
    }
    history.push('/profile')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          <input
            type="email"
            value={formState.email}
            onChange={e =>
              setFormState({ ...formState, email: e.target.value })
            }
          />
        </div>
        <div>
          <input
            type="password"
            value={formState.password}
            onChange={e =>
              setFormState({ ...formState, password: e.target.value })
            }
          />
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </div>
    </form>
  )
}

export default Login
