import io from "socket.io-client";

export const socketConnection = (
  roomId: string,
  senderId: string,
  setChatMessages: Function,
  setErrorMessages: Function,
  socketRef: any,
  setMessage: Function
) => {
  // Establish a socket connection
  socketRef.current = io(import.meta.env.VITE_BASE_URL);
  try {
    // Event listeners
    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      socketRef.current.emit("login", { roomId, senderId });
    });

    /** disconnect connection when chat is left */
    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from server");
      setErrorMessages("");
      setChatMessages([]);
      setMessage("");
    });

    /** fetch new messages */
    socketRef.current.on("message", (messageData: any) => {
      setChatMessages((prev: any) => [...prev, messageData]);
    });

    // socketRef.current.on("onlineStatus", ({ userId, isOnline }: any) => {});
  } catch (e) {
    setErrorMessages("Connection with client failed");
  }
};
