import { User } from 'src/app/core/models/user.model';
import { Chat } from './chat.model';

export interface Message {
  id?: string;
  text?: string;
  createAt?: string;
  sender?: User;
  chat?: Chat;
}
