import axios from "axios";

export const fetchUsers = async () => {
  const usersUrl = `${import.meta.env.VITE_BASE_API_URL}/users`;
  try {
    const res = await axios.get(usersUrl);
    if (res.status === 200) {
      return res.data;
    }
  } catch (e) {
    console.error("error occurred");
  }
};
export const fetchTargetUser = async (targetUserId: number) => {
  const url = `${import.meta.env.VITE_BASE_API_URL}/user/${targetUserId}`;
  try {
    const res = await axios.get(url);
    if (res.status === 200) {
      return res.data;
    }
  } catch (e) {
    console.error("error occurred");
  }
};
