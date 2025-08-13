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
