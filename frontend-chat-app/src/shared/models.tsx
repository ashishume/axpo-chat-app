export interface IUser {
  id: string;
  name: string;
  email?: string;
  lastMessage?: string;
  password?: string;
  label: string;
  value: string;
}
export interface IMessage {
  id: string;
  message: string;
  targetId: number;
  senderId: number;
  conversationId: string;
}


export interface IRoomPayload {
  senderId: string;
  targetId: string;
  name?: string;
  isGroup: boolean;
}
export interface IRoomResponse {
  createdAt: string;
  id: string;
  isGroup: boolean;
  name: string;
  updatedAt: string;
}