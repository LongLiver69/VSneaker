import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "admin" | "auth" | "default" | "payment"
declare module "/home/thanh/Documents/VSneaker/VSneaker_FE/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}