import { addUser, deleteUser, getAllUsers } from "@/api/app-survey-api";
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
