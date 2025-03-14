// src/stores/exampleStore.ts
import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', {
  state: () => ({
    message: '¡Hola desde Pinia en Nuxt!'
  }),
  getters: {
    // Ejemplo de getter
    uppercaseMessage(state) {
      return state.message.toUpperCase();
    }
  },
  actions: {
    updateMessage(newMessage: string) {
      this.message = newMessage;
    }
  }
});
