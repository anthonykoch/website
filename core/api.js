import path from 'path'

import axios from '@/core/fetch';

const req = require.context('@/_posts', true, /\.md$/, 'lazy')
const filenames = req.keys()
console.log(req)

// For debugging purposes.
if (typeof window !== 'undefined') {
  window.axios = axios;
}

const apiPath = process.env.app.apiPath;

export const getPost = async (slug) => {
  for (const filename of filenames) {
    const basename = path.basename(filename)

    if (basename.includes(slug)) {
      return import(`@/_posts/${basename}`)
        .then((module) => module.default)
    }
  }

  return Promise.reject(new Error('Post not found'))
};

export const getPostsMeta = async () => {
  return axios.get(`${apiPath}postmeta.json`);
};
