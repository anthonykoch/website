import axios from 'axios';

const request = axios.create({
  baseURL: process.env.baseUrl,
});

export default request;
