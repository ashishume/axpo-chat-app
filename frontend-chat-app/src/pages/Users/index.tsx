import { useEffect, useState } from "react";
import { fetchUsers } from "../../shared/Utils";
import { IUser } from "../../shared/models";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
import Navbar from "../../components/Navbar/Navbar";
import { SVGs } from "../../components/SvgIcons";
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
    <>
      <Navbar />
      <div className="users-container">
        <div>
          <div>Users</div>
          {users.map(({ id, name, email }: IUser) => {
            return id !== value?.id ? (
              <div
                key={id}
                className="users-content"
                onClick={() => navigate(`/chat/${id}`)}
              >
                <div className="icon">{SVGs().User}</div>
                <div className="users-data">
                  <div>{name}</div>
                  <div>{email}</div>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </>
  );
};

export default Users;
