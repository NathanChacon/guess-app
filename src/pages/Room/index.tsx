import UserCard from "./components/UserCard";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import useUsers from "./hooks/useUsers";
import useRoom from "./hooks/useRoom";
import UserNameModal from "./components/UserNameModal";
import useTimer from "./hooks/useTimer";
import ProgressBar from "./components/ProgressBar";
import useAudios from "./hooks/useAudios";
import Chat from "./components/Chat";

import "./style.css";

const Room = () => {
  const { roomId } = useParams();
  const {nextMatchSound, userJoinSound, userLeaveSound, setCanPlayAudio} = useAudios()

  const { users, setUsers } = useUsers({userLeaveSound, userJoinSound });

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
  } = useRoom({ setUsers, nextMatchSound});

  const { percentage } = useTimer();

  const getWriterFieldPlaceHolder = () => {
    if (isWaitingMoreUsers || !isPlaying) {
      return "Espere sua vez para escrever aqui :)";
    }

    return "Descreva seu tópico...";
  };

  const writerPlaceholder = getWriterFieldPlaceHolder();


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
    <section className="room" onClick={() => {setCanPlayAudio(true)}}>
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
                placeholder={writerPlaceholder}
                maxLength={180}
                disabled={!isPlaying}
              />
            </div>
            <ProgressBar percentage={percentage} />
          </div>

          <Chat isPlaying={isPlaying}></Chat>
        </div>
      </div>
    </section>
  );
};

export default Room;
