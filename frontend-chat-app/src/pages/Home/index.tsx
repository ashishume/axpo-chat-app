import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Chat from "../Chat";
import Users from "../Users";
import "./style.scss";
import {
  fetchRoomData,
  fetchTargetUser,
  fetchUsersWithLastMessage,
  socketConnectionUrl,
} from "../../shared/Utils";
import { IRoomResponse, IUser } from "../../shared/models";
import { SVGs } from "../../components/SvgIcons";
import SnackbarMessage from "../../components/Snackbar";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
const Home = () => {
  const [targetUser, setTargetUser] = useState(null as any);
  const [users, setUsers] = useState([] as IUser[]);
  const socketRef = useRef(null as any);
  const [room, setRoom] = useState(null as IRoomResponse | null);

  const [activeUser, setActiveUser] = useState(null as any);
  const [error, setErrorMessages] = useState("");
  const { value } = useLocalStorage("auth");
  useEffect(() => {
    (async function () {
      try {
        const res = await fetchUsersWithLastMessage(value?.id);
        setUsers(res);
      } catch (e) {
        setErrorMessages("Users fetching failed");
      }
    })();

    fetchRoomDetails();

    socketRef.current = socketConnectionUrl;
    userOnline();

    return () => {
      setRoom(null);
    };
  }, []);

  /**
   * fetching past chat conversations
   * @param conversationId
   */
  const fetchRoomDetails = async () => {
    try {
      const roomDetails = await fetchRoomData({
        userId: value?.id,
        targetId: targetUser?.id,
        isGroup: false,
      });
      await setRoom(roomDetails);
    } catch (e) {
      setErrorMessages("fetching failed");
    }
  };

  const openChat = (targetId: any) => {
    if (targetId !== activeUser) {
      (async function () {
        try {
          const res = await fetchTargetUser(targetId);
          setTargetUser(res);
          setActiveUser(targetId);
          fetchRoomDetails()
        } catch (e) {
          setErrorMessages("fetching failed");
        }
      })();
    }
  };

  const userOnline = () => {
    socketRef.current.emit("onlineStatus", {
      userId: value.id,
      isOnline: true,
    });
  };
  return (
    <div>
      <Navbar />
      {error ? <SnackbarMessage message={error} /> : null}
      <div className="home-container">
        <div className="users-left-panel">
          <Users users={users} openChat={openChat} activeUser={activeUser} />
        </div>
        <div className="chat-right-panel">
          {targetUser ? (
            <Chat room={room} targetUser={targetUser} />
          ) : (
            <div className="empty-container">
              {!error ? (
                <>
                  Start a interesting conversation with your friends'
                  <div className="happy-icon">{SVGs().Happy}</div>
                </>
              ) : (
                <>
                  Oops!! Something went wrong
                  <div className="happy-icon">{SVGs().Sad}</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
