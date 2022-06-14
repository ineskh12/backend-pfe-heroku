import { Document } from 'mongoose';

export interface User extends Document {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  secretcode: string;
}
