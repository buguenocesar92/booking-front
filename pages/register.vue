<template>
  <div>
    <Navbar />

    <main>
      <BackgroundSection
        imageUrl="https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3"
        title="Únete a nuestra plataforma"
        subtitle="Crea tu cuenta y comienza a disfrutar de nuestros servicios"
      >
        <div class="w-full max-w-lg bg-white shadow-lg rounded px-8 py-6">
          <form @submit.prevent="handleRegister" class="space-y-6">
            <FormInput
              id="name"
              v-model="form.name"
              :error="errors.name?.[0]"
              required
              label="Nombre completo"
              placeholder="Ejemplo: Juan Pérez"
            />

            <FormInput
              id="email"
              v-model="form.email"
              :error="errors.email?.[0]"
              type="email"
              required
              label="Correo electrónico"
              placeholder="Ejemplo: correo@dominio.com"
            />

            <FormInput
              id="password"
              v-model="form.password"
              :error="errors.password?.[0]"
              type="password"
              required
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
            />

            <FormInput
              id="passwordConfirmation"
              v-model="passwordConfirmation"
              type="password"
              required
              label="Confirmar Contraseña"
              placeholder="Repite tu contraseña"
            />

            <!-- Checkbox para indicar que es profesional -->
            <div class="mb-4">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  v-model="form.is_professional"
                  class="form-checkbox"
                />
                <span class="ml-2">Registrarme como profesional</span>
              </label>
            </div>

            <!-- Campos adicionales solo si se registra como profesional -->
            <div v-if="form.is_professional">
              <FormInput
                id="specialty"
                v-model="form.specialty"
                :error="errors.specialty?.[0]"
                required
                label="Especialidad"
                placeholder="Ejemplo: Psicólogo"
              />

              <FormInput
                id="image"
                v-model="form.image"
                :error="errors.image?.[0]"
                label="URL de imagen"
                placeholder="URL de tu foto"
              />

              <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-300 mb-2" for="description">
                  Descripción
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  class="w-full p-2 border rounded"
                  placeholder="Describe tus servicios"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ isLoading ? "Registrando..." : "Crear Cuenta" }}
            </button>

            <p class="text-center text-gray-600 mt-4">
              ¿Ya tienes cuenta?
              <router-link to="/login" class="text-blue-600 hover:underline">
                Inicia Sesión
              </router-link>
            </p>

            <p v-if="errorMessage" class="text-red-500 mt-2 text-center">
              {{ errorMessage }}
            </p>
          </form>
        </div>
      </BackgroundSection>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/Navbars/AuthNavbar.vue";
import FooterComponent from "@/components/Footers/Footer.vue";
import BackgroundSection from "@/components/BackgroundSection.vue";
import FormInput from "@/components/FormInput.vue";
import { useRegisterForm } from "@/composables/useRegisterForm";

// Configuración de meta para el middleware guest
definePageMeta({
  requiresGuest: true,
  sidebar: false,
  label: 'Registro',
  icon: 'mdi-account-plus'
});

// Extraemos la lógica del formulario desde el composable
const { form, passwordConfirmation, isLoading, errors, errorMessage, handleRegister } = useRegisterForm();
</script>
