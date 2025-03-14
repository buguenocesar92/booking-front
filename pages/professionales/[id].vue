<script setup lang="ts">
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import { useRoute } from 'vue-router'
import { computed } from 'vue'

interface Professional {
  id: number;
  name: string;
  specialty: string;
  image: string;
  description?: string;
}

// Accedemos a la configuración para obtener la URL base de la API
const config = useRuntimeConfig();

// Obtenemos el parámetro de la ruta
const route = useRoute();

// Utilizamos useFetch para obtener el detalle del profesional
const { data: professional, pending, error } = await useFetch<Professional>(
  `${config.public.apiURL}/api/professionals/${route.params.id}`
);
</script>

<template>
  <Navbar bgColor="bg-black" />

  <div class="container mx-auto p-4 mt-14">
    <div v-if="pending" class="text-center">Cargando...</div>
    <div v-else-if="error" class="text-center text-red-500">
      Ocurrió un error: {{ error.message }}
    </div>
    <div v-else-if="professional" class="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <!-- Imagen del profesional -->
      <img class="w-full p-8 rounded-t-lg" :src="professional.image" :alt="professional.name" />
      <div class="px-8 pb-8">
        <!-- Nombre y especialidad -->
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ professional.name }}
        </h1>
        <p class="text-xl text-gray-500 dark:text-gray-400 mb-4">
          {{ professional.specialty }}
        </p>
        <!-- Descripción o información adicional -->
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          {{ professional.description || 'No hay descripción disponible.' }}
        </p>
        <!-- Botón para reservar cita con la id del profesional -->
        <div class="text-center">
          <NuxtLink
            :to="`/reservar/${professional.id}`"
            class="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Reservar Cita
          </NuxtLink>
        </div>
      </div>
    </div>
    <div v-else class="text-center p-4">
      <p class="text-red-500">Profesional no encontrado.</p>
      <NuxtLink to="/" class="text-blue-500 hover:underline">
        Volver al Directorio
      </NuxtLink>
    </div>
  </div>

  <FooterComponent class="mt-14" />
</template>
