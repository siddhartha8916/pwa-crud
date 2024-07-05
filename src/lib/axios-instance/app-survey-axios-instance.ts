import axios from "axios";

const appSurveyApplicationInstance = axios.create({
  baseURL: "https://pwa-api.brainstacktechnologies.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 1000 * 60 * 2,
});

export default appSurveyApplicationInstance;
