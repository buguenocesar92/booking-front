<template>
  <Navbar bgColor="bg-gradient-to-r from-indigo-600 to-purple-600" />
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Hero section -->
    <div class="relative bg-gradient-to-r from-indigo-600 to-purple-600 py-12 z-10">
      <div class="container mx-auto px-4 relative z-20">
        <h1 class="text-4xl font-bold text-white text-center mb-4 mt-10">
          Reserva tu Cita Profesional
        </h1>
        <p class="text-white text-center text-lg mb-8 max-w-2xl mx-auto">
          Encuentra al especialista perfecto y agenda tu cita en minutos
        </p>

        <!-- Search and filter bar -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 relative z-30">
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por nombre o especialidad"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div class="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="md:w-1/4">
            <select
              v-model="specialtyQuery"
              class="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Todas las especialidades</option>
              <option value="Cardiología">Cardiología</option>
              <option value="Dermatología">Dermatología</option>
              <option value="Psicología">Psicología</option>
              <option value="Nutrición">Nutrición</option>
            </select>
          </div>
          <button
            @click="handleSearch"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors cursor-pointer">
            Buscar
          </button>
        </div>
      </div>

      <!-- Wave decoration with corrected z-index -->
      <div class="absolute bottom-0 left-0 right-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" class="w-full h-auto">
          <path fill="#f9fafb" fill-opacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            class="dark:fill-gray-900"></path>
        </svg>
      </div>
    </div>

    <!-- Main content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Loading and error states -->
      <div v-if="pending" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> Ocurrió un error al cargar los datos. Por favor, intenta nuevamente.</span>
      </div>

      <!-- Professionals grid -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="pro in professionals.data"
            :key="pro.id"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
            <div class="relative">
              <NuxtLink :to="`/professionales/${pro.id}`">
                <img class="w-full h-48 object-cover" :src="pro.image" :alt="pro.name" />
              </NuxtLink>
            </div>

            <div class="p-5">
              <div class="flex justify-between items-start mb-2">
                <NuxtLink :to="`/professionales/${pro.id}`">
                  <h3
                    class="text-xl font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {{ pro.name }}
                  </h3>
                </NuxtLink>

                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ getRandomRating() }}
                  </span>
                </div>
              </div>

              <div class="flex items-center mb-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {{ pro.specialty }}
                </span>
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {{ getRandomDescription(pro.specialty) }}
              </p>

              <div class="flex items-center justify-between mt-4">
                <div class="flex space-x-2">
                  <button
                    class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  <NuxtLink
                    :to="`/professionales/${pro.id}`"
                    class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Reservar
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5l7 7-7 7" />
                    </svg>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center mt-12" v-if="professionals.last_page > 1">
          <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              :disabled="professionals.current_page === 1"
              @click="changePage(professionals.current_page - 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="page in professionals.last_page"
              :key="page"
              @click="changePage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                professionals.current_page === page
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]">
              {{ page }}
            </button>
            <button
              :disabled="professionals.current_page === professionals.last_page"
              @click="changePage(professionals.current_page + 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
  <FooterComponent class="mt-14" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import { NuxtLink } from '#components';

interface Professional {
  id: number;
  name: string;
  specialty: string;
  image: string;
}

// Variables reactivas para búsqueda y paginado
const searchQuery = ref('');
const specialtyQuery = ref('');
const currentPage = ref(1);
const professionals = ref<any>(null);
const pending = ref(false);
const error = ref<any>(null);

const { $axios } = useNuxtApp();

// Función para obtener profesionales aplicando filtros y paginado
async function fetchProfessionals() {
  pending.value = true;
  error.value = null;
  try {
    const { data } = await $axios.get('/professionals', {
      params: {
        search: searchQuery.value,
        specialty: specialtyQuery.value,
        page: currentPage.value,
        per_page: 4,
      },
    });
    professionals.value = data;
  } catch (err) {
    console.error('Error fetching professionals:', err);
    error.value = err;
  } finally {
    pending.value = false;
  }
}

// Función para manejar la búsqueda (reinicia la página a 1)
function handleSearch() {
  currentPage.value = 1;
  fetchProfessionals();
}

// Función para cambiar de página
function changePage(page: number) {
  currentPage.value = page;
  fetchProfessionals();
}

// Helper function para generar rating aleatorio (demo)
function getRandomRating() {
  return (4 + Math.random()).toFixed(1);
}

// Helper function para obtener una descripción aleatoria basada en la especialidad
function getRandomDescription(specialty: string) {
  const descriptions: Record<string, string> = {
    'Cardiología': 'Especialista en salud cardiovascular con amplia experiencia en diagnóstico y tratamiento.',
    'Dermatología': 'Experto en tratamientos para la piel, cabello y uñas con enfoque en medicina estética.',
    'Psicología': 'Profesional dedicado a la salud mental y bienestar emocional con terapias personalizadas.',
    'Nutrición': 'Especialista en planes alimenticios personalizados y asesoramiento nutricional.',
    'default': 'Profesional con amplia experiencia y excelentes valoraciones de sus pacientes.'
  };
  
  return descriptions[specialty] || descriptions['default'];
}

// Llamada inicial a la función para obtener los profesionales
fetchProfessionals();
</script>
