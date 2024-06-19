/* eslint-disable @typescript-eslint/no-explicit-any */
interface SyncEvent extends Event {
  readonly tag: string;
  waitUntil(promise: Promise<any>): void;
}

interface ServiceWorkerGlobalScope {
  addEventListener(
    type: "sync",
    listener: (this: ServiceWorkerGlobalScope, ev: SyncEvent) => any
  ): void;
}

declare const self: ServiceWorkerGlobalScope;
