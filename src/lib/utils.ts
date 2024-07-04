import { PUBLIC_KEY_CACHE_NAME } from "@/config/constants";
import { I_PublicKeyResponse } from "@/types/user";
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
    await navigator.geolocation.getCurrentPosition(
      () => {},
      () => {}
    );
  } else if (permission.state === "denied") {
    throw new Error("Geolocation permission denied");
  }
};

// Utility function to convert Uint8Array to Base64 string
function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  // Use Uint8Array's buffer directly to convert to Base64
  const binaryString = Array.prototype.map
    .call(uint8Array, (byte: number) => String.fromCharCode(byte))
    .join("");
  return btoa(binaryString);
}

// Utility to get publicKey from text converted to CryptoKey format
export async function importPublicKey(publicKeyPEM: string) {
  // Trim PEM header and footer if present
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = publicKeyPEM
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\r\n/g, '')
    .trim();

  // Base64 decode the PEM contents
  const binaryDerString = atob(pemContents);

  // Convert to ArrayBuffer
  const publicKeyBuffer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    publicKeyBuffer[i] = binaryDerString.charCodeAt(i);
  }

  // Import the public key
  const publicKey = await crypto.subtle.importKey(
    'spki', // Public key import format
    publicKeyBuffer,
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' },
    },
    true, // Whether the key is extractable (i.e., can be used in exportKey)
    ['encrypt'] // Key usages
  );

  return publicKey;
}

// Utility function to encrypt data with RSA-OAEP and convert to Base64
export async function encryptDataWithRSA(
  sensitiveData: string,
  publicKey: CryptoKey
): Promise<string> {
  try {
    // Encode sensitive data
    const encodedData = new TextEncoder().encode(sensitiveData);

    // Encrypt with RSA-OAEP
    const encrypted = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      encodedData
    );

    // Convert encrypted data to Base64
    const encryptedArray = new Uint8Array(encrypted);
    const encryptedBase64 = uint8ArrayToBase64(encryptedArray);

    return encryptedBase64;
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}

export const getPublicKeyFromCache = async () : Promise<string> => {
  // Get public Key from cache
  const cache = await caches.open(PUBLIC_KEY_CACHE_NAME);
  const cachedRequest = new Request(
    "https://pwa-api.brainstacktechnologies.com/public-key",
    { method: "GET" }
  );
  const cachedResponse = await cache.match(cachedRequest);
  if (cachedResponse) {
    const cachedData: I_PublicKeyResponse = await cachedResponse.json();
    return cachedData.publicKey
  } else {
    throw new Error("Public key not found");
  }
};
