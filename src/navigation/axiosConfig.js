import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://dominik-2.local:8000/',
});

export function setAuthToken(token) {
  if (token) {
    instance.defaults.headers.common.Authorization = `Token ${token}`;
  } else {
    delete instance.defaults.headers.common.Authorization;
  }
}

export default instance;
