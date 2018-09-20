import axios from 'axios'
const endpoint = 'https://openexchangerates.org/api'

function get(url: string) {
  return axios.get(url, {})
}

export default {
  fetchLatestRates: async () => {
    const result = await get(
      `${endpoint}/latest.json?app_id=${process.env.REACT_APP_OPEN_EXCHANGE_API_KEY}`,
    )

    return result.data
  },
}
