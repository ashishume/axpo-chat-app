import { useEffect, useState } from "react";
import { fetchUsers } from "../../shared/Utils";
import { IUser } from "../../shared/models";
import "./style.scss";
import { useNavigate } from "react-router-dom";
const Users = () => {
  const [users, setUsers] = useState([] as IUser[]);
  const navigate = useNavigate();
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
        {users.map((value: any) => {
          return (
            <div
              key={value.id}
              className="users-container"
              onClick={() => navigate(`/chat/${value.id}`)}
            >
              <div>{value.name}</div>
              <div>{value.email}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Users;
