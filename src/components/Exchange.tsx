import * as React from 'react'
import { CURRENCY_TO_SYMBOL_MAP } from '../constants'
import { inject, observer } from 'mobx-react'
import CurrencySelector from './CurrencySelector'
import { IState } from '../state'
import ButtonInvert from './ButtonInvert'
import { Link } from 'react-router-dom'

const CURRENCIES_LIST: string[] = Array.from(CURRENCY_TO_SYMBOL_MAP.keys())
const MAX_FLOAT_PRECISION = 2

function getPrecision(n: number) {
  if (!isFinite(n)) {
    return 0
  }

  let e = 1
  let p = 0

  while (Math.round(n * e) / e !== n) {
    e *= 10
    p++
  }

  return p
}

@inject('state')
@observer
class Exchange extends React.Component<IState> {
  public setCurrencyFrom = (currency: string) => () => {
    const { setCurrencyFrom } = this.props.state
    setCurrencyFrom(currency)
  }

  public setCurrencyTo = (currency: string) => () => {
    const { setCurrencyTo } = this.props.state
    setCurrencyTo(currency)
  }

  public setAmountFrom = (amount: string) => {
    const { setAmountFrom } = this.props.state
    if (amount === '') {
      setAmountFrom(undefined)
    } else if (getPrecision(Number(amount)) <= MAX_FLOAT_PRECISION) {
      setAmountFrom(Number(amount))
    }
  }

  public setAmountTo = (amount: string) => {
    const { setAmountTo } = this.props.state
    if (amount === '') {
      setAmountTo(undefined)
    } else if (getPrecision(Number(amount)) <= MAX_FLOAT_PRECISION) {
      setAmountTo(Number(amount))
    }
  }

  public render() {
    const {
      amountFrom,
      amountTo,
      currencyFrom,
      currencyTo,
      setFocusedInputFrom,
      setFocusedInputTo,
      focusedInput,
      computedAmountFrom,
      computedAmountTo,
      swapFromTo,
      exchangeRates,
    } = this.props.state

    return (
      <div className="relative w-100 h-100 flex flex-column justify-center items-center f2">
        <CurrencySelector
          className="bg-dark white"
          currencies={CURRENCIES_LIST}
          selectedCurrency={currencyFrom}
          onCurrencyChange={this.setCurrencyFrom}
          onAmountChange={this.setAmountFrom}
          onFocusChange={setFocusedInputFrom}
          amount={focusedInput.from ? amountFrom : computedAmountFrom}
          focus={focusedInput.from}
          sign="-"
        />
        <div className="w-100 absolute left-0 pa3 pa4-m pa6-l">
          <ButtonInvert handleClick={swapFromTo} />
          <Link
            to="/rates"
            className="flex justify-center items-center absolute absolute--fill link m-auto bg-white dark br-pill f4 fw5 shadow-1"
            style={{ width: 200, height: 50 }}
          >
            {`${CURRENCY_TO_SYMBOL_MAP.get(currencyFrom)} 1 = ${CURRENCY_TO_SYMBOL_MAP.get(
              currencyTo,
            )} ${exchangeRates[currencyFrom][currencyTo].toFixed(2)}`}
          </Link>
        </div>
        <CurrencySelector
          className="bg-light dark"
          currencies={CURRENCIES_LIST}
          selectedCurrency={currencyTo}
          onCurrencyChange={this.setCurrencyTo}
          onAmountChange={this.setAmountTo}
          onFocusChange={setFocusedInputTo}
          amount={focusedInput.to ? amountTo : computedAmountTo}
          focus={focusedInput.to}
          sign="+"
        />
      </div>
    )
  }
}

export default Exchange
