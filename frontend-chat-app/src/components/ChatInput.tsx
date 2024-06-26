import React, { Fragment } from "react";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = ({
  message,
  setMessage,
  handleClick,
  handleEnter,
  inputRef,
}: {
  message: string;
  setMessage: Function;
  handleClick: Function;
  handleEnter: Function;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}) => {
  return (
    <Fragment>
      <input
        type="text"
        className="p-2.5 text-base rounded-full border border-gray-300 w-full h-[45px] outline-none"
        ref={inputRef}
        value={message}
        placeholder="Enter your message..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleEnter(e)}
      />
      <button
        disabled={!message?.length}
        onClick={() => handleClick()}
        className="submit-btn"
      >
        Send{" "}
        <SendIcon
          style={{
            verticalAlign: "-7px",
          }}
        />
      </button>
    </Fragment>
  );
};

export default React.memo(ChatInput);
