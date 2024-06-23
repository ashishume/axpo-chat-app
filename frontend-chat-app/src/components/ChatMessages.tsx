import { CircularProgress } from "@mui/material";
import React, { Fragment } from "react";
import { IMessage, IUser } from "../shared/models";

const ChatMessages = ({
  chatMessages,
  value,
}: {
  chatMessages: IMessage[] | null;
  value: IUser;
}) => {
  return (
    <Fragment>
      {chatMessages?.length ? (
        chatMessages.map(({ message, senderId }: any) => {
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
        })
      ) : chatMessages === null ? (
        <CircularProgress />
      ) : null}
    </Fragment>
  );
};

export default React.memo(ChatMessages);
