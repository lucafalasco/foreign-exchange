import { types as t, Instance, flow } from 'mobx-state-tree'
import { RouterModel } from 'mst-react-router'
import api from '../api'

const DATA_REFRESH_RATE: number = 10000
const amountFormatter = (amount: number) => parseFloat(amount.toFixed(2))

const ExchangeRatesModel = t.model({
  USD: t.model({ EUR: t.number, GBP: t.number }),
  EUR: t.model({ USD: t.number, GBP: t.number }),
  GBP: t.model({ USD: t.number, EUR: t.number }),
})

const focusedInputModel = t.model({ from: false, to: false })

export const State = t
  .model('State', {
    routing: RouterModel,
    currencyFrom: 'USD',
    currencyTo: 'EUR',
    amountFrom: t.maybe(t.number),
    amountTo: t.maybe(t.number),
    focusedInput: t.optional(focusedInputModel, { from: true, to: false }),
    exchangeRates: t.optional(ExchangeRatesModel, {
      USD: { EUR: 0, GBP: 0 },
      EUR: { USD: 0, GBP: 0 },
      GBP: { USD: 0, EUR: 0 },
    }),
  })
  .views(self => ({
    get computedAmountTo(): number | undefined {
      if (!self.amountFrom) {
        return undefined
      }

      return amountFormatter(
        self.amountFrom * self.exchangeRates[self.currencyFrom][self.currencyTo],
      )
    },
    get computedAmountFrom(): number | undefined {
      if (!self.amountTo) {
        return undefined
      }
      return amountFormatter(self.amountTo / self.exchangeRates[self.currencyFrom][self.currencyTo])
    },
  }))
  .actions(self => {
    function setCurrencyFrom(currency: string) {
      setFocusedInputFrom()
      if (currency === self.currencyTo) {
        self.currencyTo = self.currencyFrom
      }
      self.currencyFrom = currency
    }

    function setCurrencyTo(currency: string) {
      setFocusedInputFrom()
      if (currency === self.currencyFrom) {
        self.currencyFrom = self.currencyTo
      }
      self.currencyTo = currency
    }

    function setAmountFrom(amount: number | undefined) {
      self.amountFrom = amount
      self.amountTo = self.computedAmountTo
    }

    function setAmountTo(amount: number | undefined) {
      self.amountTo = amount
      self.amountFrom = self.computedAmountFrom
    }

    function setFocusedInputFrom() {
      if (self.focusedInput.from) {
        return
      }
      self.focusedInput.from = true
      self.focusedInput.to = false
      self.amountFrom = self.computedAmountFrom
    }

    function setFocusedInputTo() {
      if (self.focusedInput.to) {
        return
      }
      self.focusedInput.to = true
      self.focusedInput.from = false
      self.amountTo = self.computedAmountTo
    }

    function swapFromTo() {
      const amountTo = self.computedAmountTo
      const currencyTo = self.currencyTo

      self.amountTo = self.computedAmountFrom
      self.currencyTo = self.currencyFrom
      self.amountFrom = amountTo
      self.currencyFrom = currencyTo
      if (self.focusedInput.to) {
        setFocusedInputFrom()
      } else {
        setFocusedInputTo()
      }
    }

    function updateRates(rates: { [key: string]: number }) {
      self.exchangeRates.USD.EUR = rates.EUR
      self.exchangeRates.USD.GBP = rates.GBP
      self.exchangeRates.EUR.USD = 1 / rates.EUR
      self.exchangeRates.EUR.GBP = (1 / rates.EUR) * rates.GBP
      self.exchangeRates.GBP.USD = 1 / rates.GBP
      self.exchangeRates.GBP.EUR = (1 / rates.GBP) * rates.EUR
    }

    const fetchRates = flow(function*() {
      const result = yield api.fetchLatestRates()
      updateRates(result.rates)
    })

    return {
      setCurrencyFrom,
      setCurrencyTo,
      setAmountFrom,
      setAmountTo,
      setFocusedInputFrom,
      setFocusedInputTo,
      swapFromTo,
      updateRates,
      fetchRates,
    }
  })
  .actions(self => {
    function afterCreate() {
      self.fetchRates()
      setInterval(self.fetchRates, DATA_REFRESH_RATE)
    }
    return { afterCreate }
  })

export interface IState {
  state?: Instance<typeof State>
}
