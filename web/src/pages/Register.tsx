import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { useRegisterMutation } from '../generated/graphql'

const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const [formState, setFormState] = useState({ email: '', password: '' })

  const [register] = useRegisterMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register({ variables: formState })
    history.push('/login')
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

export default Register
