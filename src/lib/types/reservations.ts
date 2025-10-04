export type ReservationItem = {
  vehicle_id: number;
  line_amount: number;
  vin: string;
  year: number;
  color: string;
  model: string;
  seats: number;
  status: string;
  mileage: number;
  fuel_type: string;
  is_active: boolean;
  type_name: string;
  brand_name: string;
  created_at: Date;
  updated_at: Date;
  transmission: string;
  vehicle_type: string;
  brand_country: string;
  fuel_capacity: number;
  insurance_fee: number;
  license_plate: string;
  price_per_day: number;
  price_per_hour: number;
  maintenance_mileage: number;
  vehicle_type_description: string;
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
