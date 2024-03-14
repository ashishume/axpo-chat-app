import { useEffect, useRef } from "react";
import io from "socket.io-client";
import Router from "./routing/routes";

const ChatComponent = () => {
  const socket = useRef(null as any);

  useEffect(() => {
    // Establish a socket connection
    socket.current = io("http://localhost:9000"); // Replace with your server URL

    // Event listeners
    socket.current.on("connect", (e: any) => {
      console.log(e, "Connected to server");
      socket.current.emit("login", "user123");
    });

    socket.current.on("disconnect", (e: any) => {
      console.log(e, "Disconnected from server");
    });
    socket.current.on("message", (msg: any) => {
      console.log(msg);
    });
    // Clean up
    return () => {
      socket.current.disconnect();
    };
  }, []);
  const handleClick = () => {
    let messageObj = {
      senderId: "user123",
      targetId: "randomUser123",
      message: "Hey there im here",
    };
    socket.current.emit("message", messageObj);
  };
  return (
    <>
      {/* <button type="button" onClick={handleClick}>
          Emit a time message
        </button> */}
      <Router />
    </>
  );
};

export default ChatComponent;
