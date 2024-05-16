import React, {useState} from "react";
import { useParams } from "react-router-dom";
import useMessages from "./hooks/useMessages";
import CustomScrollbar from "../../../../components/CustomScrollbar";
import { socket } from "../../../../socket";

import Message from "../Message";
type Props = {
  isPlaying: boolean
}

const Chat = ({isPlaying}: Props) => {
  const { messages, isMessageDisabled, chatContainerRef } = useMessages();
  const [currentMessage, setCurrentMessage] = useState("");
  const { roomId } = useParams();

  const handleMessageChange = (event: any) => {
    setCurrentMessage(event.target.value);
  };

  const handleSendMessage = () => {
    socket.emit("room:chat", { roomId, message: currentMessage });

    setCurrentMessage("");
  };

  const handleOnKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };


  const getGuesserFieldPlaceHolder = () => {
    if(isPlaying){
      return "Sua vez!"
    }

    if (isMessageDisabled) {
      return "Você acertou!";
    }


    return "Escreva aqui...";
  };

  return (
    <div className="room__chat">
    <ul className="room__chat-messages">
      <CustomScrollbar scrollRef={chatContainerRef}>
        {messages.map(({ text, variant }, index) => {
          return (
            <li key={index}>
              <Message text={text} variant={variant} />
            </li>
          );
        })}
      </CustomScrollbar>
    </ul>
    <input
      type={"text"}
      disabled={isMessageDisabled || isPlaying}
      placeholder={getGuesserFieldPlaceHolder()}
      value={currentMessage}
      onChange={handleMessageChange}
      className="room__chat-input"
      onKeyDown={handleOnKeyDown}
    />
  </div>
  );
};


export default React.memo(Chat)
