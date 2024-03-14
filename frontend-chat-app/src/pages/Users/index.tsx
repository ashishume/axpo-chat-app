import { useEffect, useState } from "react";
import { fetchUsers } from "../../shared/Utils";
import { IUser } from "../../shared/models";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
const Users = () => {
  const [users, setUsers] = useState([] as IUser[]);
  const navigate = useNavigate();
  const { value } = useLocalStorage("auth");
  useEffect(() => {
    (async function () {
      const res = await fetchUsers();
      setUsers(res);
    })();
  }, []);
  return (
    <div>
      <h2>Users</h2>
      <div>
        {users.map(({ id, name, email }: IUser) => {
          return id !== value?.id ? (
            <div
              key={id}
              className="users-container"
              onClick={() => navigate(`/chat/${id}`)}
            >
              <div>{name}</div>
              <div>{email}</div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default Users;
