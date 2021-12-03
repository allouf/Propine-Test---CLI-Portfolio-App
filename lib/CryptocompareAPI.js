const axios = require('axios');
const colors = require('colors');

class CryptocompareAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.priceUrl = 'https://min-api.cryptocompare.com/data/price';
    this.historyUrl = 'https://min-api.cryptocompare.com/data/pricehistorical';
    this.priceMultiUrl = 'https://min-api.cryptocompare.com/data/pricemulti';
    //?fsym=BTC&tsyms=USD&ts=1452680400
  }

  async cryptoToUSD(tokenName) {
    try {
      const res = await axios.get(
        `${this.priceUrl}?fsym=${tokenName}&tsyms=USD&key=${this.apiKey}`
      );
      return res.data.USD;
    } catch (err) {
      handleAPIError(err);
    }
  }

  async multiCryptoToUSD(tokensNames) {
    try {
      const res = await axios.get(
        `${this.priceMultiUrl}?fsyms=${tokensNames}&tsyms=USD`
      );
      return res.data;
    } catch (err) {
      handleAPIError(err);
    }
  }

  async cryptoToUSDate(tokenName, date) {
    try {

      const res = await axios.get(
        `${this.historyUrl}?fsym=${tokenName}&tsyms=USD&ts=${date}`
      );

      return res.data[tokenName].USD;
    } catch (err) {
      handleAPIError(err);
    }
  }
}

function handleAPIError(err) {
  if (err.response.status === 401) {
    throw new Error('Your API key is invalid - Go to https://min-api.cryptocompare.com');
  } else if (err.response.status === 404) {
    throw new Error('Your API is not responding');
  } else {
    throw new Error('Something is not working');
  }
}

module.exports = CryptocompareAPI;
