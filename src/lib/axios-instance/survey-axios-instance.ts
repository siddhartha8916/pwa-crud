import axios from "axios";
import { getApplicationSecret, getTokenFromCache } from "../utils";

const surveyApplicationInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 1000 * 60 * 2,
});

surveyApplicationInstance.interceptors.request.use(async function (config) {
  // Do something before request is sent
  const customSecretHeader = await getApplicationSecret();
  config.headers["X-Custom-Header"] = customSecretHeader
  if (!['/auth/signup','/auth/login'].includes(config.url!)) {
    const jwtToken = await getTokenFromCache()
    config.headers['Authorization'] = `Bearer ${jwtToken}`
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


export default surveyApplicationInstance;
