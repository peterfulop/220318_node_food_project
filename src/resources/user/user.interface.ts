import { Document } from 'mongodb';

export interface UserCreateOptions extends Document {
  _id?: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserUpdateOptions extends Document {
  username?: string;
  email?: string;
}
