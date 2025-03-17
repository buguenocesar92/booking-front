import { useNuxtApp } from '#app';
import type { ReservationPayload } from '@/types/ReservationTypes'; // Define este tipo según tus necesidades

export async function fetchProfessionalReservations(): Promise<ReservationPayload[]> {
  const { $axios } = useNuxtApp();
  const response = await $axios.get('/reservations/professional');
  return response.data;
}
