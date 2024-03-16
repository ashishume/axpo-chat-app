import { useRef, useEffect, useState } from "react";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
import io from "socket.io-client";
import "./style.scss";
import { IUser } from "../../shared/models";
import { Snackbar } from "@mui/material";
import SnackbarMessage from "../../components/Snackbar";
const Chat = ({ targetUser }: { targetUser: IUser }) => {
  const { value } = useLocalStorage("auth");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([] as any);
  const [error, setErrorMessages] = useState("");
  const socket = useRef(null as any);
  const ref = useRef(null as any);
  const chatRef = useRef(null as any);

  /** initial load */
  useEffect(() => {
    socketConnection();
    requestNotificationPermission();
    ref.current.focus();

    return () => {
      socket.current.disconnect();
    };
  }, [targetUser]);

  /** scroll to the latest message */
  useEffect(() => {
    const lastMessage = chatRef.current.lastChild;
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  /** socket connection establised */
  const socketConnection = () => {
    // Establish a socket connection
    socket.current = io(import.meta.env.VITE_BASE_URL);
    try {
      // Event listeners
      socket.current.on("connect", (e: any) => {
        console.log("Connected to server");
        //create a unique id between user and target user to create room between them
        const conversationId = [value?.id, targetUser?.id].sort().join("-");
        socket.current.emit("login", conversationId);
      });

      socket.current.on("notification", (payload: any) => {
        console.log("notification received");
        // Create a new notification
        const notification = new Notification(payload.title, {
          body: payload.body,
        });
      });

      socket.current.on("disconnect", (e: any) => {
        console.log("Disconnected from server");
        setErrorMessages("");
        setChatMessages([]);
        setMessage("");
      });

      socket.current.on("message", (msg: any) => {
        setChatMessages((prev: any) => [...prev, msg]);
      });
    } catch (e) {
      setErrorMessages("Connection with client failed");
    }
  };

  /** request permission for notifications */
  const requestNotificationPermission = () => {
    Notification.requestPermission()
      .then((result) => {
        console.log("notication permission", result);
      })
      .catch((e: any) => {
        setErrorMessages("permission denied");
      });
  };

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

  /** send message to the target user */
  const sentMessage = () => {
    if (message?.length) {
      let messageObj = {
        senderId: value?.id,
        targetId: targetUser?.id,
        message,
      };
      socket.current.emit("message", messageObj);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      {error ? <SnackbarMessage message={error} /> : null}
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

export default Chat;
