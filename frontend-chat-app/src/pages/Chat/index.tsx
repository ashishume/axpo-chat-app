import React, { useRef, useEffect, useState } from "react";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
import "./style.scss";
import { IChatBubble, IRoomResponse, IUser } from "../../shared/models";
import SnackbarMessage from "../../components/Snackbar";
import { fetchPreviousChats } from "../../shared/Utils";
import ChatMessages from "../../components/ChatMessages";
import ChatInput from "../../components/ChatInput";
import { socketConnection } from "../../shared/SocketConnection";
import { AccountCircle } from "@mui/icons-material";
const Chat = ({
  targetUser,
  room,
}: {
  targetUser: IUser;
  room: IRoomResponse | null;
}) => {
  const { value } = useLocalStorage("auth");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<null | IChatBubble[]>(null);
  const [error, setErrorMessages] = useState("");
  const socketRef = useRef(null as any);
  const inputRef = useRef(null as any);
  const lastChildRef = useRef(null as any);

  /** scroll to the latest message */
  useEffect(() => {
    const lastMessage = lastChildRef.current.lastChild;
    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    (async () => {
      if (room) {
        socketConnection(
          room.id,
          value?.id,
          setChatMessages,
          setErrorMessages,
          socketRef,
          setMessage
        );

        const previousChats = await fetchPreviousChats(room?.id);
        await setChatMessages(previousChats);
        inputRef.current.focus();
      }
    })();
    return () => {
      socketRef.current?.disconnect();
    };
  }, [room]);

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

  /** send message to the target user */
  const sendMessage = () => {
    if (message?.length) {
      let messageObj = {
        userId: value?.id,
        message,
      };

      socketRef.current.emit("message", messageObj);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      {error ? <SnackbarMessage message={error} /> : null}
      <div className="h-10 bg-white flex justify-start pl-3 border items-center drop-shadow-md">
        <div className="px-1">
          <AccountCircle fontSize="medium" />
        </div>
        {targetUser?.name}
      </div>
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

export default React.memo(Chat);
