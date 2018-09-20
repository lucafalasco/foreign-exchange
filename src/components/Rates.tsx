import * as React from 'react'
import { CURRENCY_TO_SYMBOL_MAP } from '../constants'
import { inject, observer } from 'mobx-react'
import { IState } from '../state'
import { without } from 'lodash'
import { Link } from 'react-router-dom'

const CURRENCIES_LIST: string[] = Array.from(CURRENCY_TO_SYMBOL_MAP.keys())

@inject('state')
@observer
class Rates extends React.Component<IState> {
  public render() {
    const { currencyFrom, exchangeRates } = this.props.state

    return (
      <div className="relative w-100 h-100 flex flex-column justify-center items-center f2">
        <div className="absolute top-2 mh-auto link blue">Rates</div>
        <Link className="absolute top-2 right-2 link blue" to="/">
          ✕
        </Link>
        {without(CURRENCIES_LIST, currencyFrom).map(currency => (
          <div key={currency} className="f3 ma3">
            {`${CURRENCY_TO_SYMBOL_MAP.get(currencyFrom)} 1 = ${CURRENCY_TO_SYMBOL_MAP.get(
              currency,
            )} ${exchangeRates[currencyFrom][currency].toFixed(4)}`}
          </div>
        ))}
      </div>
    )
  }
}

export default Rates
