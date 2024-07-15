import apiPaths from "@/config/api-paths";
import { applicationClient } from "@/lib/api-client";
import { I_AddSurveyBody, I_AddSurveyResponse, I_AddUser_Body, I_User } from "@/types/user";

export const getAllUsers = async (): Promise<I_User[]> => {
  const { data } = await applicationClient.get(apiPaths.GET_ALL_USERS);
  return data;
};

export const addUser = async ({
  body,
}: {
  body: I_AddUser_Body;
}): Promise<I_User> => {
  const { data } = await applicationClient.post(apiPaths.ADD_USER, body);
  return data;
};

export const deleteUser = async ({
  params,
}: {
  params: { userId: number };
}): Promise<void> => {
  const { data } = await applicationClient.delete(apiPaths.DELETE_USER, {
    params,
  });
  return data;
};


export const getPublicKey = async (): Promise<I_User[]> => {
  const { data } = await applicationClient.get(apiPaths.PUBLIC_KEY);
  return data;
};

export const addHouseholdInfo = async ({
  body,
}: {
  body: I_AddSurveyBody;
}): Promise<I_AddSurveyResponse> => {
  const { data } = await applicationClient.post(apiPaths.ADD_SURVEY, body);
  return data;
};