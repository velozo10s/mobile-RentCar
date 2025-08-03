import client, {wrapRequest} from './client';

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
