import { useEffect, useRef } from "react";
import io from "socket.io-client";

const ChatComponent = () => {
  const socket = useRef(null as any);

  useEffect(() => {
    // Establish a socket connection
    socket.current = io("http://localhost:9000"); // Replace with your server URL

    // Event listeners
    socket.current.on("connect", () => {
      console.log("Connected to server");
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from server");
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
    socket.current.emit("message", "hello message 22");
  };
  return (
    <div>
      <button type="button" onClick={handleClick}>
        Emit a time message
      </button>
    </div>
  );
};

export default ChatComponent;
