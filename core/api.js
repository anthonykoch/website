import axios from '@/core/fetch';

// For debugging purposes.
if (typeof window !== 'undefined') {
  window.axios = axios;
}

const apiPath = process.env.app.apiPath;

export const getPost = async (slug) => {
  console.log(`${apiPath}posts/${slug}.json`)
  return axios.get(`${apiPath}posts/${slug}.json`);
};

export const getPostsMeta = async () => {
  console.log(`${apiPath}postmeta.json`)
  return axios.get(`${apiPath}postmeta.json`);
};
