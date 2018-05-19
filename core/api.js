import axios from 'axios';

const request = axios.create({
  baseURL: process.env.baseUrl,
});

console.log('baseUrl', process.env.baseUrl);

if (typeof window !== 'undefined') {
  window.axios = axios;
}

export const getPost = async (slug) => {
  return axios.get(`http://localhost:3000/_nuxt/api/posts/${slug}`);
};

export const getPostsMeta = async () => {
  return axios.get(`http://localhost:3000/_nuxt/api/postmeta.json`);
};
