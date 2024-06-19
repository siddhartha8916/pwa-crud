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
