import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SYNC_USERS } from "@/config/constants";
import { registerBackgroundSync } from "@/lib/utils";

// async function addUser(userData) {
//   try {
//     const response = await fetch("/users", {
//       method: "POST",
//       body: JSON.stringify(userData),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     // Handle response
//     if (!response.ok) {
//       throw new Error("Failed to add user.");
//     }

//     const result = await response.json();
//     // Handle result as needed
//   } catch (error) {
//     console.error("Failed to add user:", error);
//     // Register sync event to sync added users when online
//     await registerBackgroundSync(SYNC_USERS);
//   }
// }

import { useAddUser } from "@/services/app-survey";
import { useRef } from "react";
import { I_AddUser_Body } from "@/types/user";

const AddUserModule = () => {
  const { mutateAsync, isPending } = useAddUser();
  const userNameRef = useRef<HTMLInputElement>(null);

  const handleAddUser = async () => {
    const userName = userNameRef?.current!.value;

    if (!userName) {
      alert("Please enter a user name");
      return;
    }

    const newUser: I_AddUser_Body = {
      name: userName,
    };

    try {
      await mutateAsync({
        body: newUser,
      });
      //   alert("User added successfully");
      userNameRef.current.value = "";
    } catch (error) {
      alert("Failed to add user");
      console.log("error :>> ", error);
      registerBackgroundSync(SYNC_USERS);
    }
  };

  return (
    <div className="flex w-full items-center space-x-2">
      <Input ref={userNameRef} type="text" placeholder="Enter User Name" />
      <Button type="button" onClick={handleAddUser} disabled={isPending}>
        {isPending ? "Adding..." : "Add User"}
      </Button>
    </div>
  );
};

export default AddUserModule;
