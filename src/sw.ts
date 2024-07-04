/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";
import { Queue } from "workbox-background-sync";
// import { encryptDataWithRSA, urlBase64ToUint8Array } from "./lib/utils";
import { PUBLIC_KEY_CACHE_NAME, USERS_CACHE } from "./config/constants";
import { I_AddUser_Body, I_PublicKeyResponse } from "./types/user";
import { encryptDataWithRSA, getPublicKeyFromCache, importPublicKey } from "./lib/utils";

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist: RegExp[] | undefined;
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV) allowlist = [/^\/$/];

const newAddedUsersQueue = new Queue("new-added-users", {
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      const body: I_AddUser_Body = await entry.request.json();

      const publicKey = await getPublicKeyFromCache()
      const publicKeyParsed = await importPublicKey(publicKey)

      // Encode the data :
      const encryptedTimestamp = await encryptDataWithRSA(Date.now().toString(), publicKeyParsed)

      // Update timestamp to current time
      body.timestamp = encryptedTimestamp; // Updating timestamp to current time

      // Create a new request with updated body
      const updatedRequest = new Request(entry.request.url, {
        method: entry.request.method,
        headers: entry.request.headers,
        body: JSON.stringify(body),
      });

      try {
        const response = await fetch(updatedRequest);
        console.log("Replay successful for request", response);
      } catch (error) {
        console.error("Replay failed for request", entry, error);

        // Put the entry back in the queue and re-throw the error:
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
    console.log("Replay complete!");
  },
});

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist })
);

registerRoute(
  ({ url, request }) => {
    return url.pathname.startsWith("/users") && request.method === "GET";
  },
  new NetworkFirst({
    cacheName: USERS_CACHE,
  })
);

registerRoute(
  ({ url, request }) => {
    return url.pathname.startsWith("/public-key") && request.method === "GET";
  },
  new CacheFirst({
    cacheName: PUBLIC_KEY_CACHE_NAME,
  })
);

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === "POST" && url.pathname === "/users") {
    event.respondWith(handlePostRequest(event.request));
  }
});

const handlePostRequest = async (request: Request) => {
  try {
    const response = await fetch(request.clone());
    return response;
  } catch (error) {
    await newAddedUsersQueue.pushRequest({ request: request });
    return new Response(JSON.stringify({ message: "Adding User Failed..." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

// {
//   "subject": "mailto: siddhartha6916@gmail.com",
//   "publicKey": "BCrtLO_-1aOLACVK1Uz1KoPo4w6-ihPZZ39NNRXavx3ebFqMjgCpVy_onCZrYR4Ew30BZMMBGQm5qAoCmhLDVew",
//   "privateKey": "aCyNzAnUCxep4Kd4AepgR2gfWc8FH2i7aUspupafbN8"
// }

// const saveSubscription = async (subscription: PushSubscription) => {
//   const response = await fetch(
//     "https://pwa-api.brainstacktechnologies.com/save-subscription",
//     {
//       method: "POST",
//       headers: { "Content-type": "application/json" },
//       body: JSON.stringify(subscription),
//     }
//   );

//   return response.json();
// };

// async function subscribeUser() {
//   try {
//     if ("serviceWorker" in self && "PushManager" in self) {
//       const serviceWorkerRegistration = await self.registration;
//       const subscription =
//         await serviceWorkerRegistration.pushManager.subscribe({
//           userVisibleOnly: true,
//           applicationServerKey: urlBase64ToUint8Array(
//             "BCrtLO_-1aOLACVK1Uz1KoPo4w6-ihPZZ39NNRXavx3ebFqMjgCpVy_onCZrYR4Ew30BZMMBGQm5qAoCmhLDVew"
//           ),
//         });

//       // Send the subscription details to the server
//       await saveSubscription(subscription);
//       console.log("User subscribed to push notifications.");
//     } else {
//       console.error("Service Worker or PushManager is not supported.");
//     }
//   } catch (error) {
//     console.error("Error subscribing to push notifications:", error);
//     // Handle specific errors or retry logic if necessary
//   }
// }

self.addEventListener("activate", async () => {
  console.log("Activating New SW :>> ");
  // await subscribeUser();
});

self.addEventListener("push", (e) => {
  self.registration.showNotification("Wohoo!!", { body: e?.data?.text() });
});

self.skipWaiting();
clientsClaim();
