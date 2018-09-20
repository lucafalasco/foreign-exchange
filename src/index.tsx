import createBrowserHistory from 'history/createBrowserHistory'
import { Provider } from 'mobx-react'
import { RouterModel, syncHistoryWithStore } from 'mst-react-router'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import 'tachyons'
import 'tachyons-extra'
import registerServiceWorker from './registerServiceWorker'
import Routes from './Routes'
import { State } from './state'
import './style.css'

const state = State.create({ routing: RouterModel.create() })
const history = syncHistoryWithStore(createBrowserHistory(), state.routing)

ReactDOM.render(
  <Provider state={state}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('root') as HTMLElement,
)

registerServiceWorker()
