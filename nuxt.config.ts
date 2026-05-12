export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000',
    },
  },
  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#0b1220' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    manifest: {
      name: 'Agenda Vocale Smart',
      short_name: 'Agenda Smart',
      start_url: '/',
      display: 'standalone',
      background_color: '#0b1220',
      theme_color: '#0b1220',
      description: 'Agenda intelligente: Lavoro e Personale, note vocali, reminder e notifiche.',
      icons: [
        { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: '/icons/icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
      ],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
  },
})
