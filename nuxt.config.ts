// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    public: {
      apiURL: process.env.API_URL || 'https://booking-api-main-mg1a5i.laravel.cloud/api'
    }
  },
  css: [
    /* 'vuetify/styles', */ // Agregar estilos de Vuetify
    '@mdi/font/css/materialdesignicons.css', // Agregar Material Design Icons
    '@fortawesome/fontawesome-free/css/all.min.css'
  ],
  build: {
    transpile: ['vuetify'], // Transpilar Vuetify para que funcione correctamente con SSR
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    }
  }
});
