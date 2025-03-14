import api from '@/axiosConfig';
import type { ReservationPayload } from '@/types/ReservationTypes'; // Define este tipo según tus necesidades

export async function fetchProfessionalReservations(): Promise<ReservationPayload[]> {
  const response = await api.get('/reservations/professional');
  return response.data;
}