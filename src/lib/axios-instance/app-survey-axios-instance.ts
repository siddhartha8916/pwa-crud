import axios from "axios";
import { getApplicationSecret } from "../utils";

// Encode the data :

const getCustomSecretHeader = async () => {
  const encryptedData = await getApplicationSecret();
  return encryptedData
};

const appSurveyApplicationInstance = axios.create({
  baseURL: "https://pwa-api.brainstacktechnologies.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Custom-Header": await getCustomSecretHeader(),
  },
  timeout: 1000 * 60 * 2,
});

export default appSurveyApplicationInstance;
