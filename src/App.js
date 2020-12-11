import React, { Component } from 'react'
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import withAuth from './withAuth'
import Login from './Login'
import Leaderboard from './Leaderboard'
import Drafts from './Drafts'
import ButtonAppBar from './Navbar'

class App extends Component {
  render () {
    return (
      <div>
        <ButtonAppBar />
        <Switch>
          <Route path="/" exact component={Leaderboard} />
          <Route path="/save" component={withAuth(Drafts)} />
          <Route path="/login" component={Login} />
          {
            // <Route path="/l2" exact component={CollapsibleTable} />
          }
        </Switch>
      </div>
    )
  }
}

export default App
