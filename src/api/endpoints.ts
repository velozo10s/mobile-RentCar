import client, {wrapRequest} from './client';
import {
  CreateRatingDto,
  Rating,
  RatingDirection,
} from '../lib/types/ratings.ts';
import {
  buildFormData,
  UploadDocsPayload,
  UserWithDocs,
} from '../lib/types/userDocs.ts';

export const login = (data: {[key: string]: any}) => {
  return wrapRequest(client.post('/auth/login/', data));
};

export const logout = (data: {[key: string]: any}) => {
  return wrapRequest(client.post('/auth/logout/', data));
};

export const signUp = (data: {[key: string]: any}) => {
  return wrapRequest(client.post('/auth/register/', data));
};

export const forgotPassword = (data: {[key: string]: any}) => {
  return wrapRequest(client.post('forgot_password_code', data));
};

export const createReservation = (data: {[key: string]: any}) => {
  return wrapRequest(client.post('/reservations/', data));
};

export const listVehicles = (params: {[key: string]: any}) => {
  return wrapRequest(client.get('/vehicles', {params}));
};

export const getVehicle = (id: number) => {
  return wrapRequest(client.get(`/vehicles/${id}`));
};

export const getVehicleBrands = () => {
  return wrapRequest(client.get(`/vehicles/brands`));
};

export const getVehicleTypes = () => {
  return wrapRequest(client.get(`/vehicles/types`));
};

export const listReservations = (params: {[key: string]: any}) => {
  return wrapRequest(client.get('/reservations', {params}));
};

export const getReservation = (id: number) => {
  return wrapRequest(client.get(`/reservations/${id}`));
};

export const cancelReservation = (id: number) => {
  return wrapRequest(client.patch(`/reservations/${id}/cancel`));
};

export const createReservationRating = (
  reservationId: number,
  data: CreateRatingDto,
) => {
  return wrapRequest<Rating>(
    client.post(`/reservations/${reservationId}/ratings`, data),
  );
};

export const getReservationRating = (
  reservationId: number,
  direction: RatingDirection = 'customer_to_company',
) => {
  return wrapRequest<Rating | null>(
    client.get(`/reservations/${reservationId}/ratings`, {
      params: {direction},
    }),
  );
};

export const uploadIdentityDocs = (
  payload: UploadDocsPayload,
  endpoint = '/users/me/documents',
) => {
  const formData = buildFormData(payload);
  return wrapRequest<{ok: boolean; files?: Record<string, string>}>(
    client.post(endpoint, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    }),
  );
};

export const getUserWithDocs = (userId: number) => {
  return wrapRequest<UserWithDocs>(client.get(`/users/${userId}`));
};
