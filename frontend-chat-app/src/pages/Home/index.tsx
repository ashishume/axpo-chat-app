import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Chat from "../Chat";
import Users from "../Users";
import "./style.scss";
import { fetchTargetUser, fetchUsers } from "../../shared/Utils";
import { IUser } from "../../shared/models";
import { SVGs } from "../../components/SvgIcons";
const Home = () => {
  const [targetUser, setTargetUser] = useState(null as any);
  const [users, setUsers] = useState([] as IUser[]);
  const [activeUser, setActiveUser] = useState(null as any);
  useEffect(() => {
    (async function () {
      const res = await fetchUsers();
      setUsers(res);
    })();
  }, []);

  const openChat = (targetId: any) => {
    (async function () {
      const res = await fetchTargetUser(targetId);
      setTargetUser(res);
      setActiveUser(targetId);
    })();
  };
  return (
    <div>
      <Navbar />
      <div className="home-container">
        <div className="users-left-panel">
          <Users users={users} openChat={openChat} activeUser={activeUser} />
        </div>
        <div className="chat-right-panel">
          {targetUser ? (
            <Chat targetUser={targetUser} />
          ) : (
            <div className="empty-container">
              Start a interesting conversation with your friends'
             <div className="happy-icon">
              {SVGs().Happy}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
