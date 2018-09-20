import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import App from './components/App'
import Rates from './components/Rates'

export default function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/" component={App} />
      <Route exact={true} path="/rates" component={Rates} />
      <Route component={RedirectToHomepage} />
    </Switch>
  )
}

function RedirectToHomepage() {
  return <Redirect to="/" />
}
