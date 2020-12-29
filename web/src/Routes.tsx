import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profile" component={Profile} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
