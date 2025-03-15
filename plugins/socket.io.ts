import { defineNuxtPlugin } from '#app'
import { io, Socket } from 'socket.io-client'
import { watch } from 'vue'
import { useAuthStore } from '~/stores/authStore'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const socket: Socket = io('http://localhost:4000', {
    path: '/ws',
    transports: ['websocket'],
    auth: {
      token: authStore.accessToken || ''
    }
  })

  // Observa cambios en el token del store
  watch(
    () => authStore.accessToken,
    (newToken, oldToken) => {
      // Forzamos el tipo para acceder a token
      (socket.auth as any).token = newToken || ''
      socket.disconnect()
      socket.connect()
    }
  )

  return {
    provide: {
      socket
    }
  }
})
