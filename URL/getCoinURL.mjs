import axios, { Axios } from 'axios';

export function getCoinURL(coin) {
   coin = coin.toUpperCase();
   return axios.get(`https://api.bybit.com/spot/quote/v1/depth?symbol=${coin}USDT&limit=1`)
      .then((res) => (res.data['result']['asks'][0][0]))
      .catch(error => console.log(error))
};

