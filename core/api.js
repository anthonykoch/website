import axios from '@/core/fetch';

if (typeof window !== 'undefined') {
  window.axios = axios;
}

const apiPath = process.env.app.apiPath;

export const getPost = async (slug) => {
  return axios.get(`${apiPath}/posts/${slug}.json`);
};

export const getPostsMeta = async () => {
  return axios.get(`${apiPath}/postmeta.json`);
};
