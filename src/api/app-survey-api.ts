import apiPaths from "@/config/api-paths";
import { applicationClient, surveyApplicationClient } from "@/lib/api-client";
import { I_AddSurveyBody, I_AddSurveyResponse, I_AddUser_Body, I_ChangePasswordBody, I_ChangePasswordResponse, I_LoginBody, I_LoginResponse, I_RegistrationBody, I_RegistrationResponse, I_ResetPasswordBody, I_ResetPasswordResponse, I_User } from "@/types/user";

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


// ============================= Survey Intergration =============================

export const registerUser = async ({
  body,
}: {
  body: I_RegistrationBody;
}): Promise<I_RegistrationResponse> => {
  const { data } = await surveyApplicationClient.post(apiPaths.REGISTER_USER, body);
  return data;
};

export const loginUser = async ({
  body,
}: {
  body: I_LoginBody;
}): Promise<I_LoginResponse> => {
  const { data } = await surveyApplicationClient.post(apiPaths.LOGIN_USER, body);
  return data;
};

export const changePassword = async ({
  body,
}: {
  body: I_ChangePasswordBody;
}): Promise<I_ChangePasswordResponse> => {
  const { data } = await surveyApplicationClient.post(apiPaths.CHANGE_PASSWORD, body);
  return data;
};

export const resetPassword = async ({
  body,
}: {
  body: I_ResetPasswordBody;
}): Promise<I_ResetPasswordResponse> => {
  const { data } = await surveyApplicationClient.post(apiPaths.RESET_PASSWORD, body);
  return data;
};