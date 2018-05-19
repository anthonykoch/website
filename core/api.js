import axios from '@/core/fetch';


console.log({baseUrl: process.env.baseUrl})

if (typeof window !== 'undefined') {
  window.axios = axios;
}

export const getPost = async (slug) => {
  return axios.get(`/_nuxt/api/posts/${slug}`)
    .then(res => ({ error: null, data: res.data }))
    .catch(error => ({ error, data: null }));
};

export const getPostsMeta = async () => {
  return axios.get(`/_nuxt/api/postmeta.json`)
    .then(res => ({ error: null, data: res.data }))
    .catch(error => ({ error, data: null }));
};
