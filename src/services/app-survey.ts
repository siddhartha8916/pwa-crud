import { addHouseholdInfo, addUser, changePassword, deleteUser, getAllUsers, getPublicKey, loginUser, registerUser, resetPassword } from "@/api/app-survey-api";
import queryClient from "@/lib/react-query-client";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["all-users"],
    queryFn: () => getAllUsers(),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useGetPublicKey = () => {
  return useQuery({
    queryKey: ["public-key"],
    queryFn: () => getPublicKey(),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useAddUser = () => {
  return useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    retry: false,
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
    },
    retry: false,
  });
};


export const useAddHouseholdInfo = () => {
  return useMutation({
    mutationFn: addHouseholdInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["household-info"] });
    },
    retry: false,
  });
};

// -------------------------- Backend Integration ----------------------------

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
    retry: false,
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
    retry: false,
  });
};
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    retry: false,
  });
};
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    retry: false,
  });
};