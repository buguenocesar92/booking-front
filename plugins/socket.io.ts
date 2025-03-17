import { defineNuxtPlugin } from '#app'
import { io, Socket } from 'socket.io-client'
import { watch } from 'vue'
import { useAuthStore } from '~/stores/authStore'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const authStore = useAuthStore()
  
  // Construimos la URL con las variables de entorno
  const socketUrl = `${runtimeConfig.public.SOCKET_SERVER}:${runtimeConfig.public.SOCKET_SERVER_PORT}`

  const socket: Socket = io(socketUrl, {
    path: '/ws',
    transports: ['websocket'],
    auth: {
      token: authStore.accessToken || ''
    }
  })

  // Observa cambios en el token del store
  watch(
    () => authStore.accessToken,
    (newToken) => {
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
