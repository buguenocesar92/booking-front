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
          <strong>{{ msg.user.sub }}:</strong> {{ msg.message }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useNuxtApp } from '#app';
  
  const { $socket } = useNuxtApp();
  const joinedChannel = ref<string>('');
  const message = ref<string>('');
  const messages = ref<Array<{ user: any; message: string }>>([]);
  
  const joinChannel = () => {
    // Suponiendo que el usuario autenticado tiene ID "1"
    const channel = 'laravel_database_private-chat-1';
    $socket.emit("join-private-channel", { channel });
  };
  
  onMounted(() => {
    $socket.on("joined-channel", (data: any) => {
      joinedChannel.value = data.channel;
      console.log("Unido al canal privado:", data.channel);
    });
  
    $socket.on("private-message", (data: any) => {
      console.log("Mensaje privado recibido:", data);
      messages.value.push(data);
    });
  
    $socket.on("error", (err: any) => {
      console.error("Error:", err);
    });
  });
  
  const sendMessage = () => {
    if (joinedChannel.value && message.value) {
      $socket.emit("send-private-message", { channel: joinedChannel.value, message: message.value });
      message.value = '';
    }
  };
  </script>
  