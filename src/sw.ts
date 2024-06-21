/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { SYNC_USERS, USER_STORE, USERS_CACHE } from "./config/constants";
import { registerBackgroundSync, urlBase64ToUint8Array } from "./lib/utils";
import { openDB } from "idb";

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist: RegExp[] | undefined;
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist })
);

self.skipWaiting();
clientsClaim();
// Define a regular expression to match URLs for caching
const cacheRegex = /^\/users(?:\/.*)?$/;

// Define caching strategy for GET /users
registerRoute(
  cacheRegex,
  new NetworkFirst({
    cacheName: "users-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

const dbPromise = openDB(USER_STORE, 1, {
  upgrade(db) {
    db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
  },
});

async function syncUsers() {
  console.log("Syncing users...");
  const db = await dbPromise;
  const users = await db.getAll("users");

  try {
    const syncPromises = users.map(async (user) => {
      try {
        const response = await fetch(
          "https://pwa-api.brainstacktechnologies.com/users",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          }
        );

        console.log("response :>> ", response);

        if (response.ok) {
          await db.delete("users", user.id);
        } else {
          console.error("Failed to sync user:", user);
        }
      } catch (error) {
        console.error("Error syncing user:", user, error);
      }
    });

    await Promise.all(syncPromises);
  } catch (error) {
    console.error("Error syncing users:", error);
  }
}

// Register a sync event for 'syncUsers'
self.addEventListener("sync", (event) => {
  if (event.tag === SYNC_USERS) {
    console.log("Running Sync Event :>> ");
    event.waitUntil(syncUsers());
  }
});

// Handle POST and DELETE requests
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === "GET" && url.pathname === "/users") {
    event.respondWith(handleGetRequest(event.request));
  } else if (event.request.method === "POST" && url.pathname === "/users") {
    event.respondWith(handlePostRequest(event.request));
  } else if (
    event.request.method === "DELETE" &&
    url.pathname.startsWith("/users/")
  ) {
    event.respondWith(handleDeleteRequest(event.request));
  }
});

async function handleGetRequest(request: Request): Promise<Response> {
  const cache = await caches.open(USERS_CACHE);

  try {
    // console.log("Attempting to fetch:", request.url);
    const response = await fetch(request);

    // console.log("Fetched response:", response);
    const responseClone = response.clone();

    await cache.put(request, responseClone);

    // console.log("Data cached successfully:", request.url);
    return response;
  } catch (error) {
    // console.error("Fetch failed:", error);

    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // console.log("Returning cached response:", cachedResponse);
      return cachedResponse;
    } else {
      // console.log("No cached data available. Returning fallback response.");
      return new Response(
        JSON.stringify({
          error: "Network error and no cached data available",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}

async function handlePostRequest(request: Request): Promise<Response> {
  try {
    // Clone the request to avoid consuming the original stream
    const clonedRequest = request.clone();
    const response = await fetch(clonedRequest);

    // If fetch was successful, return the response as-is
    return response;
  } catch (error) {
    try {
      // Attempt to parse the request body to get the user data
      const user = await request.json();

      // Access the database
      const db = await dbPromise;
      const tx = db.transaction("users", "readwrite");
      const store = tx.objectStore("users");

      // Add the user to the store
      await store.add(user);

      // Wait for the transaction to complete
      await tx.done;

      // Update the cache with the new user data
      const cache = await caches.open(USERS_CACHE);
      const cachedRequest = new Request(
        "https://pwa-api.brainstacktechnologies.com/users",
        { method: "GET" }
      );
      const cachedResponse = await cache.match(cachedRequest);

      if (cachedResponse) {
        const cachedData = await cachedResponse.json();
        const newData = [...cachedData, user]; // Assuming cachedData is an array of users
        await cache.put(cachedRequest, new Response(JSON.stringify(newData)));
      }

      // Respond with the added user
      return new Response(JSON.stringify(user), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error adding user to database:", error);
      return new Response("Error adding user", { status: 500 });
    }
  }
}

// TODO : Cache Delete Requests
async function handleDeleteRequest(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    const cache = await caches.open(USERS_CACHE);
    const usersCache = await cache.match("/users");

    if (usersCache) {
      const url = new URL(request.url);
      const userId = url.pathname.split("/").pop();

      if (userId) {
        const updatedUsers = (await usersCache.json()).filter(
          (user: any) => user.id !== userId
        );
        await cache.put("/users", new Response(JSON.stringify(updatedUsers)));
      }
    }

    return response;
  } catch (error) {
    // Update cache for offline sync
    const deletedUsersCache = await caches.open("deleted-users");
    await deletedUsersCache.add(request.url);

    // Register sync event to retry when online
    await registerBackgroundSync(SYNC_USERS);

    return new Response(
      JSON.stringify({
        error:
          "Failed to delete due to network issues. Changes will be synced when online.",
      }),
      { status: 503 }
    );
  }
}

// TODO : Push Notifications
// {
//   "subject": "mailto: siddhartha6916@gmail.com",
//   "publicKey": "BCrtLO_-1aOLACVK1Uz1KoPo4w6-ihPZZ39NNRXavx3ebFqMjgCpVy_onCZrYR4Ew30BZMMBGQm5qAoCmhLDVew",
//   "privateKey": "aCyNzAnUCxep4Kd4AepgR2gfWc8FH2i7aUspupafbN8"
//   }

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
    if ('serviceWorker' in self && 'PushManager' in self) {
      const serviceWorkerRegistration = await self.registration;
      const subscription = await serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BCrtLO_-1aOLACVK1Uz1KoPo4w6-ihPZZ39NNRXavx3ebFqMjgCpVy_onCZrYR4Ew30BZMMBGQm5qAoCmhLDVew"
        ),
      });

      // Send the subscription details to the server
      await saveSubscription(subscription);
      console.log("User subscribed to push notifications.");
    } else {
      console.error("Service Worker or PushManager is not supported.");
    }
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    // Handle specific errors or retry logic if necessary
  }
}

self.addEventListener("activate", async () => {
  console.log('Activating New SW :>> ');
  await subscribeUser();
});

self.addEventListener("push", (e) => {
  self.registration.showNotification("Wohoo!!", { body: e?.data?.text() });
});
