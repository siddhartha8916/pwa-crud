import axios from "axios";
import { getApplicationSecret } from "../utils";

const appSurveyApplicationInstance = axios.create({
  baseURL: "https://pwa-api.brainstacktechnologies.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 1000 * 60 * 2,
});

appSurveyApplicationInstance.interceptors.request.use(async function (config) {
  // Do something before request is sent
  const customSecretHeader = await getApplicationSecret();
  config.headers["X-Custom-Header"] = customSecretHeader
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


export default appSurveyApplicationInstance;
