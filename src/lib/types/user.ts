export interface User {
  id: number;
  username: string;
  email: string;
  is_email_validated: boolean;
  role: string;
  document_type: string;
  document_number: string;
  name: string;
  birth_date: string;
  phone_number: string;
  is_active: boolean;
}
