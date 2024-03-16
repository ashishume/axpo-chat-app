import { useRef, useEffect, useState } from "react";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
import io from "socket.io-client";
import "./style.scss";
import { IUser } from "../../shared/models";
import SnackbarMessage from "../../components/Snackbar";
import { fetchPreviousChats } from "../../shared/Utils";
import ChatMessages from "../../components/ChatMessages";
import ChatInput from "../../components/ChatInput";
const Chat = ({ targetUser }: { targetUser: IUser }) => {
  const { value } = useLocalStorage("auth");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([] as any);
  const [error, setErrorMessages] = useState("");
  const socket = useRef(null as any);
  const inputRef = useRef(null as any);
  const lastChildRef = useRef(null as any);

  //create a unique id between user and target user to create room between them
  const conversationId = [value?.id, targetUser?.id].sort().join("-");

  /** initial load */
  useEffect(() => {
    fetchFormerChats();
    socketConnection();
    requestNotificationPermission();
    inputRef.current.focus();

    return () => {
      socket.current.disconnect();
    };
  }, [targetUser]);

  /** scroll to the latest message */
  useEffect(() => {
    const lastMessage = lastChildRef.current.lastChild;
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
      socket.current.on("connect", () => {
        console.log("Connected to server");
        socket.current.emit("login", conversationId);
      });

      /** fetch notifications */
      socket.current.on("notification", (payload: any) => {
        // Create a new notification
        const notification = new Notification(payload.title, {
          body: payload.body,
        });
        console.log(notification, "notification received");
      });

      /** disconnect connection when chat is left */
      socket.current.on("disconnect", () => {
        console.log("Disconnected from server");
        setErrorMessages("");
        setChatMessages([]);
        setMessage("");
      });

      /** fetch new messages */
      socket.current.on("message", (messageData: any) => {
        setChatMessages((prev: any) => [...prev, messageData]);
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
      .catch(() => {
        setErrorMessages("permission denied");
      });
  };

  /** send message on send button */
  const handleClick = () => {
    sendMessage();
  };

  /** send message on press enter */
  const handleEnter = (e: any) => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  };

  /**
   * fetching past chat conversations
   * @param conversationId
   */
  const fetchFormerChats = () => {
    (async function () {
      try {
        const res = await fetchPreviousChats(conversationId);
        setChatMessages(res);
      } catch (e) {
        setErrorMessages("fetching failed");
      }
    })();
  };
  /** send message to the target user */
  const sendMessage = () => {
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
      <div className="chat-navbar">{targetUser?.name}</div>
      <div className="chat-content">
        <div className="chat-messages" ref={lastChildRef}>
          <ChatMessages chatMessages={chatMessages} value={value} />
        </div>
        <div className="chat-actions-container">
          <div className="chat-actions">
            <ChatInput
              message={message}
              setMessage={setMessage}
              handleClick={handleClick}
              handleEnter={handleEnter}
              inputRef={inputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
