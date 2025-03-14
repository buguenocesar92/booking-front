<template>
    <div>
      <h1>Chat Privado</h1>
      <div v-if="joinedChannel">
        <p>Unido al canal: {{ joinedChannel }}</p>
        <input v-model="message" placeholder="Escribe un mensaje" />
        <button @click="sendMessage">Enviar</button>
      </div>
      <div v-else>
        <button @click="joinChannel">Unirse al Canal Privado</button>
      </div>
      <ul>
        <li v-for="(msg, index) in messages" :key="index">
          <strong>{{ msg.data.userId }}:</strong> {{ msg.data.message }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useNuxtApp } from '#app';
  import { useAuthStore } from '@/stores/authStore'; // Importa directamente el store
  
  const { $socket } = useNuxtApp();
  const authStore = useAuthStore(); // Usa el store de Pinia
  const joinedChannel = ref<string>('');
  const message = ref<string>('');
  const messages = ref<Array<{
      event: string;
      data: { message: string; userId: number };
      socket: null;
  }>>([]);
  
  const joinChannel = () => {
    // Accede directamente al ID del usuario desde el store
    const channel = `laravel_database_private-user.${authStore.userId}`;
    $socket.emit("join-private-channel", { channel });
  };
  
  onMounted(() => {
    $socket.on("joined-channel", (data: { channel: string }) => {
      joinedChannel.value = data.channel;
    });
  
    $socket.on("private-message", (data: any) => {
      messages.value.push(data);
    });
  
    $socket.on("error", (err: string) => {
      console.error("Error:", err);
    });
  });
  
  const sendMessage = () => {
    if (joinedChannel.value && message.value) {
      $socket.emit("send-private-message", {
        channel: joinedChannel.value,
        message: message.value
      });
      message.value = '';
    }
  };
  </script>