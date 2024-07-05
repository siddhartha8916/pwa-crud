import {
  useDeleteUser,
  useGetAllUsers,
} from "@/services/app-survey";
import AddUserModule from "./add-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { I_User } from "@/types/user";
import { Button } from "@/components/ui/button";
import DeleteIcon from "@/components/icons/delete";
import { registerBackgroundSync } from "@/lib/utils";
import { SYNC_USERS } from "@/config/constants";

const UserPage = () => {
  const { data } = useGetAllUsers();
  console.log("data :>> ", data);
  const { mutateAsync: deleteUser } = useDeleteUser();

  const handleDeleteUser = async (userid: number) => {
    try {
      await deleteUser({
        params: {
          userId: userid,
        },
      });
      //   alert("User added successfully");
    } catch (error) {
      alert("Failed to delete user");
      console.log("error :>> ", error);
      registerBackgroundSync(SYNC_USERS);
    }
  };

  return (
    <div>
      <AddUserModule />
      <div className="flex flex-col gap-5 h-[calc(100vh-250px)] overflow-y-auto mt-10">
        {data?.map((user: I_User, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-xl">
                {user.id}. {user.name.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-center justify-between">
                <p>Sample Description</p>
                <p>{user.timestamp}</p>
                <Button
                  variant={"outline"}
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <DeleteIcon stroke="red" className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
