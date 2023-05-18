import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = string
declare module "/home/thanh/Documents/VSneaker/VSneaker_FE/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}