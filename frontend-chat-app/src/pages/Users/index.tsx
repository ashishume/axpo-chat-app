import { IUser } from "../../shared/models";
import "./style.scss";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
import { SVGs } from "../../components/SvgIcons";
import React from "react";
const Users = ({
  users,
  activeUser,
  openChat,
}: {
  users: IUser[];
  activeUser: string;
  openChat: (targetId: string) => void;
}) => {
  const { value } = useLocalStorage("auth");

  return (
    <>
      <div className="users-container">
        {users &&
          users.map(({ id, name, lastMessage }: IUser) => {
            return id !== value?.id ? (
              <div
                key={id}
                className={`users-content ${activeUser === id ? "active" : ""}`}
                onClick={() => openChat(id)}
              >
                <div className="icon">{SVGs().User}</div>
                <div className="users-data">
                  <div>{name}</div>
                  {/* <div className="last-message">{lastMessage}</div> */}
                </div>
              </div>
            ) : null;
          })}
      </div>
    </>
  );
};

export default React.memo(Users);
