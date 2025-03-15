<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Notificaciones de Reservas</h1>
    <p v-if="joinedChannel" class="mb-4 text-sm text-gray-600">
      Conectado al canal: {{ joinedChannel }}
    </p>

    <!-- Contenedor de notificaciones tipo toast -->
    <div class="fixed bottom-0 right-0 flex flex-col items-end space-y-4 p-4">
      <ToastNotification
        v-for="(toast, index) in toasts"
        :key="index"
        :title="toast.title"
        :image="toast.image"
        :reservationName="toast.reservationName"
        :reservationMessage="toast.reservationMessage"
        :reservationTime="toast.reservationTime"
        @close="removeToast(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReservationNotifications } from '@/composables/useReservationNotifications';
import ToastNotification from '@/components/ToastNotification.vue';

const { joinedChannel, toasts, removeToast } = useReservationNotifications();
</script>
