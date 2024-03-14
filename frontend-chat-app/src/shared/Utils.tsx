import axios from "axios";

export const fetchUsers = async () => {
  const usersUrl = `${import.meta.env.VITE_BASE_URL}/users`;
  const res = await axios.get(usersUrl);
  if (res.status === 200) {
    return res.data;
  }
};
