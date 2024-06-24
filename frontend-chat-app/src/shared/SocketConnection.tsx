import { socketConnectionUrl } from "./Utils";

export const socketConnection = (
  roomId: string,
  userId: string,
  setChatMessages: Function,
  setErrorMessages: Function,
  socketRef: any,
  setMessage: Function
) => {
  // Establish a socket connection
  socketRef.current = socketConnectionUrl
  try {
    // Event listeners
    socketRef.current.on("connect", () => {
      console.log("Connected to server");
      socketRef.current.emit("login", { roomId, userId });
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
