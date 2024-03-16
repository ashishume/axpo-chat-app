export interface IUser {
  id: number;
  name: string;
  email?: string;
  password?: string;
  label: string;
  value: string;
}
export interface IMessage {
  id: number;
  message: string;
  targetId: number;
  senderId: number;
  conversationId: string;
}
