declare module 'virtual:client-loaders' {
  export const catalogues: Record<string, () => Promise<{default: any}>>;
  export const services: Record<string, () => Promise<{default: any}>>;
  export const guides: Record<string, () => Promise<{default: any}>>;
  export const loadSearch: () => Promise<{default: Record<string, string>}>;
}
