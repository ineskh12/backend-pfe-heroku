import { Document } from 'mongoose';
import { User } from 'src/users/interfaces/user.interface';
export interface Template extends Document {
  name: string;
  nbreofuses: number;
  version: number;
  editor: [];
  layout: [];
  userId: User;
}
