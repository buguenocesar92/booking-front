import { defineNuxtPlugin, useCookie } from '#app'
import { io, Socket } from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const accessTokenCookie = useCookie('access_token')
  const token = accessTokenCookie.value
  console.log('Token obtenido del cliente:', token)

  const socket: Socket = io('http://localhost:4000', {
    path: '/ws',
    transports: ['websocket'],
    auth: {
      token: token || ''
    }
  })

  return {
    provide: {
      socket
    }
  }
})
