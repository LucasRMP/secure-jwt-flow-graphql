import React from 'react'
import { Link } from 'react-router-dom'
import { useMeQuery } from '../generated/graphql'

const Header: React.FC = () => {
  const { data, loading } = useMeQuery()

  return (
    <div>
      <div style={{ display: 'flex', gap: 5 }}>
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/profile">Profile</Link>
        </div>
        <div>
          <Link to="/register">Register</Link>
        </div>
        <div>
          <Link to="/login">Login</Link>
        </div>
      </div>

      <span>
        You are logged in as:{' '}
        {loading ? '...' : data?.me ? data.me.email : 'not logged in'}
      </span>
    </div>
  )
}

export default Header
