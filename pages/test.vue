<template>
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold">Ejemplo de Store con Pinia</h1>
      <p>{{ exampleStore.message }}</p>
      <p>{{ exampleStore.uppercaseMessage }}</p>
      <input v-model="newMessage" placeholder="Nuevo mensaje" />
      <button @click="updateStore">Actualizar Mensaje</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useExampleStore } from '@/stores/exampleStore'
  
  const exampleStore = useExampleStore()
  const newMessage = ref('')
  
  function updateStore() {
    exampleStore.updateMessage(newMessage.value)
  }
  </script>
  