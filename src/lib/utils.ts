/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { APPLICATION_CACHE, PUBLIC_KEY } from "@/config/constants";
import { all_province } from "@/data/household_module/all-province";
import { province_commune_mapping } from "@/data/household_module/province-commune-mapping";
import { commune_hill_mapping } from "@/data/household_module/commune-hill-mapping";
import { hill_subhill_mapping } from "@/data/household_module/hill-subhill-mapping";

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
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = publicKeyPEM
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\r\n/g, "")
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
    "spki", // Public key import format
    publicKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    true, // Whether the key is extractable (i.e., can be used in exportKey)
    ["encrypt"] // Key usages
  );

  return publicKey;
}

// Utility function to encrypt data with RSA-OAEP and convert to Base64
async function encryptDataWithRSA(data: string): Promise<string> {
  try {
    const publicKey = PUBLIC_KEY;
    const publicKeyParsed = await importPublicKey(publicKey);

    // Encode sensitive data
    const encodedData = new TextEncoder().encode(data);

    // Encrypt with RSA-OAEP
    const encrypted = await crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKeyParsed,
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

// async function getApplicationRandomUUID() {
//   // Update the cache with the new user data
//   const cache = await caches.open(APPLICATION_CACHE);
//   const cachedResponse = await cache.match("/uuid");
//   if (cachedResponse) {
//     const uuid = await cachedResponse.text();
//     return uuid;
//   } else {
//     const uuid = self.crypto.randomUUID();
//     cache.put("/uuid", new Response(uuid));
//     return uuid;
//   }
// }

export const getApplicationSecret = async () => {
  // const uuid = await getApplicationRandomUUID();
  const encryptedData = await encryptDataWithRSA(`${Date.now().toString()}`);
  return encryptedData;
};

export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 0,
    });
  });
};

export const populateDataToCache = async () => {
  const cache = await caches.open(APPLICATION_CACHE);
  const province = all_province;
  cache.put(
    "https://pwa-api.brainstacktechnologies.com/api/v1/province",
    new Response(JSON.stringify(province), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

  const province_commune = province_commune_mapping;
  cache.put(
    "https://pwa-api.brainstacktechnologies.com/api/v1/province-commune",
    new Response(JSON.stringify(province_commune), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

  const commune_hill = commune_hill_mapping;
  cache.put(
    "https://pwa-api.brainstacktechnologies.com/api/v1/commune-hill",
    new Response(JSON.stringify(commune_hill), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  );

  const hill_subhill = hill_subhill_mapping;
  cache.put(
    "https://pwa-api.brainstacktechnologies.com/api/v1/hill-subhill",
    new Response(JSON.stringify(hill_subhill), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
};

export async function getUserSubscriptionObject() {
  try {
    const serviceWorkerRegistration = await navigator.serviceWorker.ready;
    const subscription = await serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BCrtLO_-1aOLACVK1Uz1KoPo4w6-ihPZZ39NNRXavx3ebFqMjgCpVy_onCZrYR4Ew30BZMMBGQm5qAoCmhLDVew"
      ),
    });

    return subscription;
  } catch (error) {
    console.error("Error getting subscription object:", error);
    return null;
  }
}

export async function saveTokenToCache(token: string) {
  try {
    const cache = await caches.open(APPLICATION_CACHE);
    cache.put(
      "https://pwa-api.brainstacktechnologies.com/token",
      new Response(token, {
        status: 200,
      })
    );
    return token;
  } catch (error) {
    console.log("error saving token to cache :>> ", error);
    return false;
  }
}

export async function getTokenFromCache() {
  try {
    const res = await fetch("https://pwa-api.brainstacktechnologies.com/token");
    const token = await res.text();
    return token;
  } catch (error) {
    console.log("error getting token from cache :>> ", error);
    return null;
  }
}

interface KeyValueObject {
  [key: string]: any;
}

interface LabelValuePair {
  label: string;
  value: string;
}

export function convertToArrayOfValues(obj: any): any {
  // Ensure obj is an object and not null
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // If obj is an array, map over its elements
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToArrayOfValues(item));
  }

  // Otherwise, obj is an object
  const newObj: KeyValueObject = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Recursively convert nested objects
      newObj[key] = convertToArrayOfValues(obj[key]);

      // Check if the current property is an array with objects having 'label' and 'value' properties
      if (
        Array.isArray(newObj[key]) &&
        newObj[key].every(
          (item: any) =>
            typeof item === "object" &&
            item !== null &&
            "label" in item &&
            "value" in item
        )
      ) {
        // Determine how to format based on the length of the array
        if (newObj[key].length === 1) {
          newObj[key] = (newObj[key][0] as LabelValuePair).value; // Convert to a single string value
        } else {
          newObj[key] = newObj[key].map((item: LabelValuePair) => item.value); // Convert to an array of string values
        }
      }
    }
  }
  return newObj;
}

export const validationRule = {
  1: "Only Numbers without Decimal",
  2: "Only Numbers with Decimal",
  3: "Only Alphabets",
  4: "Only Alphabets With Spaces",
  5: "Only Alphabets and Numbers",
  6: "Only Alphabets and Numbers With Spaces",
  7: "Any Character Input",
  8: "Email Validation",
};

export const validationFunctions: {
  [key: number]: (event: KeyboardEvent) => boolean;
} = {
  1: validateOnlyNumbersWithoutDecimal,
  2: validateOnlyNumbersWithDecimal,
  3: validateOnlyAlphabets,
  4: validateOnlyAlphabetsWithSpaces,
  5: validateOnlyAlphabetsAndNumbers,
  6: validateOnlyAlphabetsAndNumbersWithSpaces,
  7: validateAnyCharacterInput,
  8: validateEmail,
  // Add more mappings as needed
};

export const handleKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement>,
  validationRule: number
) => {
  const validationFunction = validationFunctions[validationRule];
  if (validationFunction) {
    // TODO: Fix
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!validationFunction(event)) {
      event.preventDefault();
    }
  }
};

// Rule 1: Only Numbers without Decimal
export function validateOnlyNumbersWithoutDecimal(
  event: KeyboardEvent
): boolean {
  const key = event.key;
  // Allow digits 0-9 and navigation keys
  return (
    /^\d$/.test(key) ||
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  );
}

// Rule 2: Only Numbers with Decimal
export function validateOnlyNumbersWithDecimal(event: KeyboardEvent): boolean {
  const key = event.key;
  const value = (event.target as HTMLInputElement).value;

  // Check if the key is a digit, or a decimal point and it's not already present in the value
  if (/^\d$/.test(key) || (key === '.' && value.indexOf('.') === -1)) {
    return true;
  }

  // Allow navigation and editing keys
  return (
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  );
}

// Rule 3: Only Alphabets
export function validateOnlyAlphabets(event: KeyboardEvent): boolean {
  const key = event.key;
  // Allow alphabetic characters and navigation keys
  return (
    /^[a-zA-Z]$/.test(key) ||
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  );
}

// Rule 4: Only Alphabets With Spaces
export function validateOnlyAlphabetsWithSpaces(event: KeyboardEvent): boolean {
  const key = event.key;
  // Allow alphabetic characters, space, and navigation keys
  return (
    /^[a-zA-Z ]$/.test(key) ||
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  );
}

// Rule 5: Only Alphabets and Numbers
export function validateOnlyAlphabetsAndNumbers(event: KeyboardEvent): boolean {
  const key = event.key;
  // Allow alphanumeric characters and navigation keys
  return (
    /^[a-zA-Z0-9]$/.test(key) ||
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  );
}

// Rule 6: Only Alphabets and Numbers With Spaces
export function validateOnlyAlphabetsAndNumbersWithSpaces(
  event: KeyboardEvent
): boolean {
  const key = event.key;
  // Allow alphanumeric characters, space, and navigation keys
  return (
    /^[a-zA-Z0-9 ]$/.test(key) ||
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  );
}

// Rule 7: Any Character Input
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function validateAnyCharacterInput(_event: KeyboardEvent): boolean {
  // Allow any character and navigation keys
  return true;
}

// Rule 8: Email Validation (Basic check for '@' symbol)
export function validateEmail(event: KeyboardEvent): boolean {
  const key = event.key;
  // Basic check for email format (allow alphanumeric characters, @ symbol, dot, and navigation keys)
  return (
    /^[a-zA-Z0-9@.]$/.test(key) ||
    event.key === "Backspace" ||
    event.key === "Delete" ||
    event.key === "ArrowLeft" ||
    event.key === "ArrowRight"
  );
}
