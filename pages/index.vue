
<template>
    <Navbar bgColor="bg-black" />

    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6 text-center">Directorio de Profesionales</h1>
      <div v-if="pending">Cargando...</div>
      <div v-else-if="error">Ocurrió un error al cargar los datos.</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="pro in professionals"
          :key="pro.id"
          class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
        >
          <NuxtLink :to="`/professionales/${pro.id}`">
            <img class="p-8 rounded-t-lg" :src="pro.image" :alt="pro.name" />
          </NuxtLink>
          <div class="px-5 pb-5">
            <NuxtLink :to="`/professionales/${pro.id}`">
              <h5 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {{ pro.name }}
              </h5>
            </NuxtLink>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ pro.specialty }}</p>
            <div class="mt-4 text-center">
              <NuxtLink
                :to="`/professionales/${pro.id}`"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Ver perfil
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterComponent class="mt-14" />
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import { useLoginForm } from '@/composables/useLoginForm';

interface Professional {
  id: number;
  name: string;
  specialty: string;
  image: string;
}

const { form, isLoading, errors, errorMessage, handleLogin } = useLoginForm();
const config = useRuntimeConfig();
const { data: professionals, pending, error } = await useFetch<Professional[]>(`${config.public.apiURL}/professionals`, {
  // Puedes agregar opciones como headers si fuera necesario
});
</script>
