import { useState } from "react";
import UserCard from "./components/UserCard";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import "./style.css";
import Message from "./components/Message";
import useMessages from "./hooks/useMessages";
import useUsers from "./hooks/useUsers";
import useRoom from "./hooks/useRoom";
import UserNameModal from "./components/UserNameModal";
import useTimer from "./hooks/useTimer";
import ProgressBar from "./components/ProgressBar";
import CustomScrollbar from "../../components/CustomScrollbar";
const Room = () => {
  const { roomId } = useParams();
  const [currentMessage, setCurrentMessage] = useState("");

  const { messages, setMessages, chatContainerRef } = useMessages();

  const { users, setUsers } = useUsers({ setMessages });
  const isWaitingMoreUsers = users?.length <= 1;
  const {
    timer,
    descriptionMessage,
    setDescriptionMessage,
    userNameModal,
    handleJoinRoom,
    currentPlayer,
    currentTopic,
    isPlaying,
  } = useRoom({ setUsers });

  const { percentage } = useTimer();

  const getPlaceHolderText = () => {
    if (isWaitingMoreUsers || !isPlaying) {
      return "Espere sua vez para escrever aqui : )";
    }

    return "Descreva seu tópico...";
  };

  const placeholderText = getPlaceHolderText();

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

  const onDescriptionChange = (event: any) => {
    const description = event.target.value;
    setDescriptionMessage(description);

    socket.emit("room:description", { roomId, description });
  };

  if (userNameModal?.isVisible) {
    return (
      <UserNameModal
        title={userNameModal?.title}
        subtitle={userNameModal?.subtitle}
        onEnter={handleJoinRoom}
      />
    );
  }

  return (
    <section className="room">
      <div className="room__board">
        {timer && <span className="room__board-timer">{timer}</span>}
        <div className="room__users-overflow">
          <ul className="room__users">
            {users.map(({ id, points, name }) => {
              return (
                <li className="room__user" key={id}>
                  <UserCard name={name} points={points} />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="room__play-area">
          <div className="room__writer-section">
            {isWaitingMoreUsers && (
              <h1 className="room__waiting-user">
                Esperando mais jogadores...
              </h1>
            )}
            {currentPlayer && (
              <h1 className="room__player-title">Vez de: {currentPlayer}</h1>
            )}
            {isPlaying && (
              <h4 className="room__topic">Tópico: {currentTopic}</h4>
            )}
            <div className="room__play">
              <textarea
                value={descriptionMessage}
                onChange={onDescriptionChange}
                placeholder={placeholderText}
                maxLength={180}
                disabled={!isPlaying}
              />
            </div>
            <ProgressBar percentage={percentage} />
          </div>

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
              placeholder={"escreva aqui..."}
              value={currentMessage}
              onChange={handleMessageChange}
              className="room__chat-input"
              onKeyDown={handleOnKeyDown}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Room;
