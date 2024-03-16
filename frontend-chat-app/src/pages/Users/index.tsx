import { IUser } from "../../shared/models";
import "./style.scss";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
import { SVGs } from "../../components/SvgIcons";
const Users = ({
  users,
  activeUser,
  openChat,
}: {
  users: IUser[];
  activeUser: number;
  openChat: (targetId: number) => void;
}) => {
  const { value } = useLocalStorage("auth");

  return (
    <>
      <div className="users-container">
        {users &&
          users.map(({ id, name, email }: IUser) => {
            return id !== value?.id ? (
              <div
                key={id}
                className={`users-content ${activeUser === id ? "active" : ""}`}
                onClick={() => openChat(id)}
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
    </>
  );
};

export default Users;
