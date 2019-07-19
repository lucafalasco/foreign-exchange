import * as React from 'react'
import Exchange from './Exchange'
import { Link } from 'react-router-dom'

class App extends React.Component {
  public render() {
    return (
      <div className="w-100 h-100 absolute absolute--fill m-auto">
        <Link className="absolute top-2 right-2 z-1 link light f4 fw7" to="/rates">
          RATES
        </Link>
        <Exchange />
      </div>
    )
  }
}

export default App
