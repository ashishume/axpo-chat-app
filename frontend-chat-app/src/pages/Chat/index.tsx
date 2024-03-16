import { useRef, useEffect, useState } from "react";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
import "./style.scss";
import { IUser } from "../../shared/models";
import SnackbarMessage from "../../components/Snackbar";
import { fetchPreviousChats } from "../../shared/Utils";
import ChatMessages from "../../components/ChatMessages";
import ChatInput from "../../components/ChatInput";
import socketConnection from "../../shared/SocketConnection";
const Chat = ({ targetUser }: { targetUser: IUser }) => {
  const { value } = useLocalStorage("auth");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([] as any);
  const [error, setErrorMessages] = useState("");
  const socketRef = useRef(null as any);
  const inputRef = useRef(null as any);
  const lastChildRef = useRef(null as any);
  //create a unique id between user and target user to create room between them
  const conversationId = [value?.id, targetUser?.id].sort().join("-");

  /** initial load */
  useEffect(() => {
    fetchFormerChats();

    socketConnection(
      conversationId,
      setChatMessages,
      setErrorMessages,
      socketRef,
      setMessage
    );
    showNotifications();
    inputRef.current.focus();
    return () => {
      socketRef.current.disconnect();
    };
  }, [targetUser]);

  /** scroll to the latest message */
  useEffect(() => {
    const lastMessage = lastChildRef.current.lastChild;
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

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
      socketRef.current.emit("message", messageObj);
      setMessage("");
    }
  };

  const showNotifications = () => {
    /** request permission for notifications */
    Notification.requestPermission()
      .then((result) => {
        console.log("notication permission", result);
      })
      .catch(() => {
        setErrorMessages("permission denied");
      });

    /** fetch notifications */
    socketRef.current.on(
      "notification",
      (payload: { title: string; body: string }) => {
        //TODO find a way to show notifications when tab is out of focus
        // Create a new notification
        // const notification = new Notification(payload.title, {
        //   body: payload.body,
        // });
        // console.log(notification, "notification received");
      }
    );
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
