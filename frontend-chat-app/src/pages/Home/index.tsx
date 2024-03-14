import { useRef, useEffect, useState } from "react";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
import io from "socket.io-client";
import "./style.scss";
import axios from "axios";
const Home = () => {
  const { value, removeStoredValue } = useLocalStorage("auth");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([] as any);
  const [users, setUsers] = useState([]);
  const socket = useRef(null as any);
  useEffect(() => {
    socketConnection();

    const url = `${import.meta.env.VITE_BASE_URL}/users`;
    axios.get(url).then((res) => {
      if (res.status === 200) {
        setUsers(res.data);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const logOut = () => {
    removeStoredValue("auth");
  };

  const socketConnection = () => {
    // Establish a socket connection
    socket.current = io("http://192.168.1.7:9000"); // Replace with your server URL

    // Event listeners
    socket.current.on("connect", (e: any) => {
      console.log(e, "Connected to server");
      socket.current.emit("login", value?.id);
    });

    socket.current.on("disconnect", (e: any) => {
      console.log(e, "Disconnected from server");
    });
    socket.current.on("message", (msg: any) => {
      console.log(msg);

      setChatMessages((prev: any) => [...prev, msg]);
    });
  };

  const handleClick = () => {
    let messageObj = {
      senderId: value?.id,
      targetId: (users.find((v: any) => v?.id !== value?.id) as any).id,
      message,
    };
    socket.current.emit("message", messageObj);
  };

  return (
    <div className="chat-container">
      <button onClick={logOut}>Logout</button>
      <div className="chat-content">
        <div className="chat-messages">
          {chatMessages.map(({ message }: any) => {
            return (
              <div key={Math.floor(Math.random() * 100000)}>{message}</div>
            );
          })}
        </div>
        <input
          type="text"
          className="chat-input"
          value={message}
          placeholder="Enter your message..."
          onChange={(e: any) => setMessage(e.target.value)}
        />
        <button onClick={handleClick} className="submit-btn">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Home;
