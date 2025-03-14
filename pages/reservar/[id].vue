<script setup lang="ts">
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";

import { ref, watch } from 'vue'
import { useRoute, useRuntimeConfig } from '#app'

const route = useRoute()
// Obtenemos la id del profesional de la URL
const professionalId = Number(route.params.id)

const name = ref('')
const email = ref('')
const selectedDate = ref('')
const message = ref('')
const availableTimeSlots = ref<string[]>([])

const selectedTimeSlot = ref('')

// Variable reactiva para el mensaje de error
const errorMessage = ref('')

const config = useRuntimeConfig()

// Genera la fecha de hoy en formato ISO (YYYY-MM-DD)
const today = new Date().toISOString().split('T')[0]

// Función para actualizar los horarios disponibles de forma dinámica
const fetchAvailableSlots = async () => {
  if (!selectedDate.value) {
    availableTimeSlots.value = []
    return
  }
  try {
    const url = `${config.public.apiURL}/api/reservations/professionals/${professionalId}/available-slots?date=${selectedDate.value}`
    const slots = await $fetch<string[]>(url)
    availableTimeSlots.value = slots
  } catch (err: any) {
    console.error('Error fetching available slots:', err)
    availableTimeSlots.value = []
  }
}

// Actualiza los horarios cada vez que la fecha seleccionada cambie
watch(selectedDate, () => {
  fetchAvailableSlots()
})

const reservar = async () => {
  if (!name.value || !email.value || !selectedDate.value || !selectedTimeSlot.value) {
    errorMessage.value = 'Por favor, completa todos los campos obligatorios.'
    return
  }
  
  const payload = {
    professional_id: professionalId, // Se envía la id del profesional obtenida de la URL
    name: name.value,
    email: email.value,
    date: selectedDate.value,
    time: selectedTimeSlot.value,
    message: message.value
  }
  
  // Enviar la reserva a la API usando useFetch
  const { error } = await useFetch(`${config.public.apiURL}/api/reservations`, {
    method: 'POST',
    body: payload
  })

  if (error.value) {
    errorMessage.value = error.value.data?.message || 
                         error.value.message || 
                         'Error al enviar la reserva.'
  } else {
    errorMessage.value = ''
    alert('Reserva creada exitosamente.')
    // Limpia el campo de horario seleccionado (opcional)
    selectedTimeSlot.value = ''
    // Actualiza los horarios disponibles para reflejar la nueva reserva
    await fetchAvailableSlots()
  }
}
</script>

<template>
  <Navbar bgColor="bg-black" />

  <div class="container mx-auto p-4 mt-14">
    <h1 class="text-3xl font-bold text-center mb-6">Reservar Cita</h1>
    <form @submit.prevent="reservar" class="max-w-xl mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
        <input v-model="name" type="text" placeholder="Tu nombre" class="w-full p-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
        <input v-model="email" type="email" placeholder="Tu email" class="w-full p-2 border rounded" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">Fecha de Cita</label>
        <input 
          v-model="selectedDate" 
          type="date" 
          :min="today" 
          class="w-full p-2 border rounded" 
          required 
        />
      </div>
      <div class="mb-4" v-if="availableTimeSlots.length > 0">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">Selecciona un horario</label>
        <div class="grid grid-cols-3 gap-4">
          <button
            v-for="time in availableTimeSlots"
            :key="time"
            @click.prevent="selectedTimeSlot = time"
            :class="[
              'p-2 rounded border transition-colors',
              selectedTimeSlot === time ? 'bg-blue-700 text-white' : 'bg-white text-gray-700 hover:bg-blue-100'
            ]"
          >
            {{ time }}
          </button>
        </div>
      </div>
      <div v-else class="mb-4">
        <p class="text-gray-700 dark:text-gray-300">No hay horarios disponibles para la fecha seleccionada.</p>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">Mensaje</label>
        <textarea v-model="message" placeholder="Comentarios o requerimientos" class="w-full p-2 border rounded"></textarea>
      </div>
      <!-- Mostrar mensaje de error si existe -->
      <div v-if="errorMessage" class="text-red-500 mb-4">
        {{ errorMessage }}
      </div>
      <button type="submit" class="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5">
        Confirmar Reserva
      </button>
    </form>
    <div class="mt-4 text-center">
      <NuxtLink to="/" class="text-blue-500 hover:underline">Volver al Directorio</NuxtLink>
    </div>
  </div>

  <FooterComponent class="mt-14" />
</template>
