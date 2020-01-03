import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import withAuth from './withAuth';
import Home from './Home';
import Login from './Login';
import Login2 from './Login2';
import Leaderboard from './Leaderboard'
import Save from './Save'


class App extends Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/">Leaderboard</Link></li>
          <li><Link to="/save">Add Results</Link></li>
        </ul>
        <Switch>
          <Route path="/" exact component={Leaderboard} />
          <Route path="/save" component={withAuth(Save)} />
          <Route path="/login" component={Login} />
        </Switch>
      </div>
    );
  }
}

export default App;
