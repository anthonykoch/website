import axios from 'axios';

/**
 * This is a hack so that the baseUrl works when using `npm run generate`,
 * dev mode, and on actual production.
 */
const baseURL =
  typeof window === 'undefined'
  //  && ['www.anthonykoch.com', 'localhost:3000'].includes(window.location.host)
    ? process.env.app.baseUrl
    : '/';


const request = axios.create({
  baseURL,
});

export default request;
