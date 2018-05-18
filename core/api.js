import axios from 'axios';

export const getPost = async (slug) => {
  return axios.get(`/posts/${slug}`);
};

export const getMetadata = async () => {};
