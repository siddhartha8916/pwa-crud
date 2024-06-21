import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function registerBackgroundSync(tag: string) {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const registration = await navigator.serviceWorker.ready;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await registration.sync.register(tag);
    console.log(`Background Sync registered for tag - :>> ${tag}`);
  }
}

export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    // eslint-disable-next-line no-useless-escape
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const requestGeolocationPermission = async () => {
  console.log("Requesting Geolocation Permission :>> ");
  const permission = await navigator.permissions.query({ name: "geolocation" });

  if (permission.state === "granted") {
    console.log("Geolocation permission granted");
  } else if (permission.state === "prompt") {
    console.log("Geolocation permission request prompted");
    await navigator.geolocation.getCurrentPosition(() => {}, () => {});
  } else if (permission.state === "denied") {
    throw new Error("Geolocation permission denied");
  }
};