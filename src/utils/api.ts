
import axios from 'axios';

export const fetchCountries = async () => {
  return axios.get('https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies');
};

export const fetchExchangeRates = async () => {
  return axios.get('https://open.er-api.com/v6/latest/USD');
};
