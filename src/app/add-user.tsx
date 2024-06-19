import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SYNC_USERS } from "@/config/constants";
import { registerBackgroundSync, urlBase64ToUint8Array } from "@/lib/utils";

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
import { useRef, useState } from "react";
import { I_AddUser_Body } from "@/types/user";

const AddUserModule = () => {
  const { mutateAsync, isPending } = useAddUser();
  const userNameRef = useRef<HTMLInputElement>(null);
  const userLocationRef = useRef<HTMLInputElement>(null);
  const [userLocation, setUserLocation] = useState("");

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

  const getUserLocation = async () => {
    console.log("Getting User Location :>> ");
    try {
      const position = await getCurrentPosition();
      const location = `${position.coords.latitude}, ${position.coords.longitude}`;
      console.log("location :>> ", location);
      setUserLocation(location);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  // Function to get current position using Geolocation API
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const saveSubscription = async (subscription: PushSubscription) => {
    const response = await fetch(
      "https://pwa-api.brainstacktechnologies.com/save-subscription",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(subscription),
      }
    );

    return response.json();
  };

  async function subscribeUser() {
    try {
      const serviceWorkerRegistration = await navigator.serviceWorker.ready;
      const subscription =
        await serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BCrtLO_-1aOLACVK1Uz1KoPo4w6-ihPZZ39NNRXavx3ebFqMjgCpVy_onCZrYR4Ew30BZMMBGQm5qAoCmhLDVew"
          ),
        });

      // Send the subscription details to the server
      await saveSubscription(subscription);
      alert("Subscribed to push notifications");
      console.log("User subscribed to push notifications.");
    } catch (error) {
      alert("Unable to subscribed to push notifications");
      console.error("Error subscribing to push notifications:", error);
    }
  }

  return (
    <div className="grid gap-5">
      <div className="flex w-full items-center space-x-2">
        <Input ref={userNameRef} type="text" placeholder="Enter User Name" />
        <Button
          type="button"
          onClick={handleAddUser}
          disabled={isPending}
          className="w-32"
        >
          {isPending ? "Adding..." : "Add User"}
        </Button>
      </div>
      <div className="flex w-full items-center space-x-2">
        <Input
          ref={userLocationRef}
          type="text"
          placeholder="Enter Location"
          disabled
          value={userLocation}
        />
        <Button type="button" onClick={getUserLocation} className="w-32">
          Get Location
        </Button>
      </div>

      <Button type="button" onClick={subscribeUser}>
        Enable Push Notification Subscription
      </Button>
    </div>
  );
};

export default AddUserModule;
