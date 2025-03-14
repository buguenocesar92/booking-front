<template>
    <div>
      <h1>Notificaciones en Tiempo Real</h1>
      <p v-if="notification">{{ notification }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useNuxtApp } from '#app'
  
  const notification = ref<string>('')
  
  const { $socket } = useNuxtApp()
  
  onMounted(() => {
    $socket.on('new-message', (data: any) => {
      notification.value = data.message
      console.log("Mensaje recibido:", data)
    })
  })
  </script>
  