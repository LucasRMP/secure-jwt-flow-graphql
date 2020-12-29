import React, { useEffect, useState } from 'react'
import { setAccessToken } from './accessToken'

import Routes from './Routes'

const App: React.FC = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const res = await fetch('http://localhost:4000/refresh_token', {
        method: 'POST',
        credentials: 'include',
      })

      const { accessToken } = await res.json()
      setAccessToken(accessToken)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return <Routes />
}

export default App
