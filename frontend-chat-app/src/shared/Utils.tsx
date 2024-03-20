import axios from "axios";
export const fetchUsersWithLastMessage = async (userId: number) => {
  const usersUrl = `${
    import.meta.env.VITE_BASE_API_URL
  }/users-with-last-message?userId=${userId}`;
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
export const fetchPreviousChats = async (conversationId: string) => {
  const url = `${
    import.meta.env.VITE_BASE_API_URL
  }/chats?conversationId=${conversationId}`;
  const res = await axios.get(url);
  if (res.status === 200) {
    return res.data;
  }
};
