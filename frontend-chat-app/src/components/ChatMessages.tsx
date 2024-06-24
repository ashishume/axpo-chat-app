import { CircularProgress } from "@mui/material";
import React, { Fragment } from "react";
import { IChatBubble, IUser } from "../shared/models";
import { InsertEmoticon } from "@mui/icons-material";

const ChatMessages = ({
  chatMessages,
  value,
}: {
  chatMessages: IChatBubble[] | null;
  value: IUser;
}) => {
  return (
    <Fragment>
      {chatMessages?.length ? (
        chatMessages.map(({ message, userId, createdAt }: IChatBubble) => {
          return (
            <div
              key={Math.floor(Math.random() * 100000)}
              className={`drop-shadow-lg inline-block h-inherit w-[300px] p-2.5 
                rounded-xl m-2.5 border border-gray-400/30 break-words text-base ${
                  userId === value?.id
                    ? "bg-teal-800	self-end text-white"
                    : "bg-white"
                }`}
            >
              {message}
              <div className="text-xs flex justify-end">
                {new Date(createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: undefined,
                })}
              </div>
            </div>
          );
        })
      ) : chatMessages === null ? (
        <CircularProgress />
      ) : (
        <div className="text-center py-5 flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            Start some interesting conversations <InsertEmoticon />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default React.memo(ChatMessages);
