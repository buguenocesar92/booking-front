<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Notificaciones de Reservas</h1>
    <p v-if="joinedChannel" class="mb-4 text-sm text-gray-600">
      Conectado al canal: {{ joinedChannel }}
    </p>
    
    <!-- Contenedor de notificaciones tipo toast -->
    <div class="fixed bottom-0 right-0 flex flex-col items-end space-y-4 p-4">
      <div
        v-for="(toast, index) in toasts"
        :key="index"
        class="w-full max-w-xs p-4 text-gray-900 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-300"
      >
        <div class="flex items-center mb-3">
          <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ toast.title }}</span>
          <button
            type="button"
            @click="removeToast(index)"
            class="ms-auto -mx-1.5 -my-1.5 bg-white flex items-center justify-center shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <span class="sr-only">Cerrar</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
        <div class="flex items-center">
          <div class="relative inline-block shrink-0">
            <img class="w-12 h-12 rounded-full" :src="toast.image" alt="Reserva" />
          </div>
          <div class="ms-3 text-sm font-normal">
            <div class="text-sm font-semibold text-gray-900 dark:text-white">{{ toast.reservationName }}</div>
            <div class="text-sm">{{ toast.reservationMessage }}</div>
            <span class="text-xs font-medium text-blue-600 dark:text-blue-500">{{ toast.reservationTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useNuxtApp } from '#app';
import { useAuthStore } from '@/stores/authStore';

interface Reservation {
  id: number;
  name: string;
  email: string;
  date: string;
  time: string;
  message: string;
  professional_id: number;
  created_at: string;
  updated_at: string;
  image?: string;
}

interface ReservationMessage {
  event: string;
  data: {
    reservation: Reservation;
    professionalId: number;
  };
  socket: null;
}

const { $socket } = useNuxtApp();
const authStore = useAuthStore();

const joinedChannel = ref<string>('');
const toasts = ref<Array<{
  title: string;
  image: string;
  reservationName: string;
  reservationMessage: string;
  reservationTime: string;
}>>([]);

const joinChannel = (userId: number) => {
  const channel = `laravel_database_private-reservations.${userId}`;
  joinedChannel.value = channel;
  $socket.emit("join-private-channel", { channel });
  console.log("Canal unido:", channel);
};

const removeToast = (index: number) => {
  toasts.value.splice(index, 1);
};

onMounted(() => {
  if (authStore.userId) {
    joinChannel(authStore.userId);
  }
  
  watch(
    () => authStore.userId,
    (newId) => {
      if (newId) {
        joinChannel(newId);
      }
    }
  );

  $socket.on("joined-channel", (data: { channel: string }) => {
    joinedChannel.value = data.channel;
    console.log("Canal conectado:", data.channel);
  });

  $socket.on("private-message", (data: ReservationMessage) => {
    console.log("Notificación recibida:", data);
    
    if (data?.data?.reservation) {
      const reservation = data.data.reservation;
      const newToast = {
        title: "Nueva Reserva",
        image: reservation.image || 'https://media.istockphoto.com/id/1495088043/es/vector/icono-de-perfil-de-usuario-avatar-o-icono-de-persona-foto-de-perfil-s%C3%ADmbolo-de-retrato.jpg?s=612x612&w=0&k=20&c=mY3gnj2lU7khgLhV6dQBNqomEGj3ayWH-xtpYuCXrzk=',
        reservationName: reservation.name,
        reservationMessage: reservation.message,
        reservationTime: `${reservation.date} ${reservation.time}`
      };
      
      toasts.value.push(newToast);
      
      // Eliminar automáticamente después de 5 segundos
      setTimeout(() => {
        const index = toasts.value.indexOf(newToast);
        if (index !== -1) {
          toasts.value.splice(index, 1);
        }
      }, 5000);
    } else {
      console.warn("Estructura de datos inválida:", data);
    }
  });

  $socket.on("error", (err: string) => {
    console.error("Error de socket:", err);
  });
});
</script>