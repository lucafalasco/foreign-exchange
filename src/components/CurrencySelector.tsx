import * as React from 'react'
import Select from './Select'
import ResizableInput from './ResizableInput'

interface IProps {
  className?: string
  currencies: string[]
  selectedCurrency: string
  onCurrencyChange: (currency: string) => () => void
  onAmountChange: (amount: string) => void
  onFocusChange: () => void
  amount: number
  sign: '+' | '-'
  focus: boolean
}

class CurrencySelector extends React.Component<IProps> {
  public render() {
    const {
      className,
      currencies,
      selectedCurrency,
      onCurrencyChange,
      onAmountChange,
      onFocusChange,
      amount,
      sign,
      focus,
    } = this.props
    return (
      <div
        className={`w-100 h-100 pa3 pa4-m pa6-l flex justify-between items-center ${className ||
          ''}`}
      >
        <Select
          label={selectedCurrency}
          className="fw5 w4"
          childrenClassName="dark ba br2 overflow-hidden"
        >
          {currencies.map((currency, i) => (
            <div
              key={i}
              onClick={onCurrencyChange(currency)}
              className={`f3 lh-title pv2 ph3 w4 hover-bg-light-gray pointer ${
                currency === selectedCurrency ? 'bg-near-white' : 'bg-white'
              }`}
            >
              {currency}
            </div>
          ))}
        </Select>
        <div className="relative truncate">
          {amount !== undefined && sign}
          <ResizableInput
            className={`${amount === undefined ? 'o-50' : ''} tl`}
            type="number"
            pattern="\d*"
            min="0"
            handleChange={onAmountChange}
            onFocus={onFocusChange}
            focus={focus}
            value={amount}
          />
        </div>
      </div>
    )
  }
}

export default CurrencySelector
