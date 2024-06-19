import apiPaths from "@/config/api-paths";
import { applicationClient } from "@/lib/api-client";
import { I_AddUser_Body, I_User } from "@/types/user";

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
