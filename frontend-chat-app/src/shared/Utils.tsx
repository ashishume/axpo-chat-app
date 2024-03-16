import axios from "axios";

export const fetchUsers = async () => {
  const usersUrl = `${import.meta.env.VITE_BASE_API_URL}/users`;
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
