import { useRef, useEffect, useState } from "react";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
import io from "socket.io-client";
import "./style.scss";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
const Home = () => {
  const { value } = useLocalStorage("auth");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([] as any);
  const [targetUser, setTargetUser] = useState(null as any);
  const socket = useRef(null as any);
  const { id } = useParams();
  const ref = useRef(null as any);
  const chatRef = useRef(null as any);

  /** initial load */
  useEffect(() => {
    socketConnection();
    ref.current.focus();

    const url = `${import.meta.env.VITE_BASE_API_URL}/user/${id}`;

    axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          setTargetUser(res.data);
        }
      })
      .catch((e) => {
        console.error("Users fetch failed");
      });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  /** socket connection establised */
  const socketConnection = () => {
    // Establish a socket connection
    socket.current = io(import.meta.env.VITE_BASE_URL);

    // Event listeners
    socket.current.on("connect", (e: any) => {
      console.log(e, "Connected to server");
      //create a unique id between user and target user to create room between them
      const conversationId = [value?.id, id].sort().join("-");
      socket.current.emit("login", conversationId);
    });

    socket.current.on("disconnect", (e: any) => {
      console.log(e, "Disconnected from server");
    });
    socket.current.on("message", async (msg: any) => {
      setChatMessages((prev: any) => [...prev, msg]);
    });
  };

  /** scroll to the latest message */
  useEffect(() => {
    const lastMessage = chatRef.current.lastChild;
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  /** send message on send button */
  const handleClick = () => {
    sentMessage();
  };
  /** send message on press enter */
  const handleEnter = (e: any) => {
    if (e.keyCode === 13) {
      sentMessage();
    }
  };

  const sentMessage = () => {
    if (message?.length) {
      let messageObj = {
        senderId: value?.id,
        targetId: parseInt(id as string),
        message,
      };
      socket.current.emit("message", messageObj);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <Navbar />
      <div>
        To: {targetUser?.name}
        {` (${targetUser?.email})`}
      </div>
      <div className="chat-content">
        <div className="chat-messages" ref={chatRef}>
          {chatMessages.map(({ message, senderId }: any) => {
            return (
              <div
                key={Math.floor(Math.random() * 100000)}
                className={`chat-bubble ${
                  senderId === value?.id ? "sent-by-me" : ""
                }`}
              >
                {message}
              </div>
            );
          })}
        </div>
        <div className="chat-actions-container">
          <div className="chat-actions">
            <input
              type="text"
              className="chat-input"
              ref={ref}
              value={message}
              placeholder="Enter your message..."
              onChange={(e: any) => setMessage(e.target.value)}
              onKeyDown={handleEnter}
            />
            <button
              disabled={!message?.length}
              onClick={handleClick}
              className="submit-btn"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
