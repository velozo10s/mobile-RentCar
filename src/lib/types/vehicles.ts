export type Vehicle = {
  id: number;
  brand_id: number;
  type_id: number;
  model: string;
  year: number;
  license_plate: string;
  vin: string;
  color: string;
  transmission: string;
  seats: number;
  fuel_type: string;
  fuel_capacity: string;
  price_per_hour: string;
  price_per_day: string;
  insurance_fee: string;
  mileage: string;
  maintenance_mileage: string;
  status: string;
  brand_name: string;
  type_name: string;
  primary_image: string;
};

export type VehicleListFilters = {
  q?: string;
  sort: 'created_at' | 'price_per_day';
  order: 'asc' | 'desc';
  brand_id?: number;
  type_id?: number;
  startAt?: Date;
  endAt?: Date;
};
