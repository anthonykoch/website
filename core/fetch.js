import axios from 'axios';

const request = axios.create({
  baseURL: process.env.app.baseUrl,
});

export default request;
