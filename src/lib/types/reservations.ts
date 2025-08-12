import client, {wrapRequest} from '../../api/client.ts';

export type ReservationItem = {
  vehicle_id: number;
  line_amount: number;
};

export type Reservation = {
  id: number;
  customer_user_id: number;
  start_at: string;
  end_at: string;
  status: string;
  note: string;
  total_amount: string;
  items: ReservationItem[];
};

export function createReservation(data: {
  startAt: string;
  endAt: string;
  vehicleIds: number[];
  note?: string;
}) {
  return wrapRequest<Reservation>(client.post('/reservations', data));
}

export function listReservations(params?: {status?: string}) {
  return wrapRequest<Reservation[]>(client.get('/reservations', {params}));
}

export function getReservation(id: number) {
  return wrapRequest<Reservation>(client.get(`/reservations/${id}`));
}
