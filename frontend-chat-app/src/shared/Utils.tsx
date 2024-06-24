import axios from "axios";
import { IRoomPayload } from "./models";
import { io } from "socket.io-client";

export const fetchUsersWithLastMessage = async (userId: number) => {
  const usersUrl = `${
    import.meta.env.VITE_BASE_API_URL
  }/users?userId=${userId}`;
  const res = await axios.get(usersUrl);
  if (res.status === 200) {
    return res.data;
  }
};
export const fetchTargetUser = async (targetUserId: number) => {
  const url = `${import.meta.env.VITE_BASE_API_URL}/user/${targetUserId}`;
  const res = await axios.get(url);
  if (res.status === 200) {
    return res.data;
  }
};
export const fetchPreviousChats = async (roomId: string) => {
  const url = `${import.meta.env.VITE_BASE_API_URL}/chats/${roomId}`;
  const res = await axios.get(url);
  if (res.status === 200) {
    return res.data;
  }
};
export const fetchRoomData = async (payload: IRoomPayload) => {
  const url = `${import.meta.env.VITE_BASE_API_URL}/room`;
  const res = await axios.post(url, payload);
  if (res.status === 200) {
    return res.data?.room;
  }
};

export const socketConnectionUrl = io(import.meta.env.VITE_BASE_URL, {
  transports: ["websocket", "polling"],
});
