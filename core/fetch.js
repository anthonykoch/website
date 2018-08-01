import axios from 'axios';

/**
 * This is a hack so that the baseUrl works when using `npm run generate`,
 * dev mode, and on actual production.
 */
const baseURL =
  process.server
    ? process.env.app.baseUrl
    : '/';

const request = axios.create({
  baseURL,
});

export default request;
