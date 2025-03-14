import { defineNuxtPlugin } from '#app'
import { io, Socket } from 'socket.io-client'

export default defineNuxtPlugin((nuxtApp) => {
  // Forzamos el uso exclusivo de WebSocket para evitar polling
  const socket: Socket = io('http://localhost:4000', {
    path: '/ws',
    transports: ['websocket']
  })
  nuxtApp.provide('socket', socket)
})
