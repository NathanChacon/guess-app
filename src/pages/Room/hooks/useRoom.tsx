import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { socket } from "../../../socket";
import { useParams, useLocation, useNavigate } from "react-router-dom";

type User = {
  name: string;
  roomId: string | null;
  points: number;
  joinTime: Date;
  id: string;
};

type nextMatchData = {
  currentPlayer: User,
  previousTopic: string
}


const useRoom = ({
  setUsers,
}: {
  setUsers: Dispatch<SetStateAction<Array<User>>>;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>("");
  const [currentTopic, setCurrentTopic] = useState<string | null>("");
  const [timer, setTimer] = useState(null);
  const [descriptionMessage, setDescriptionMessage] = useState("");
  const [userNameModal, setUserNameModal] = useState({
    title: "",
    subtitle: "",
    isVisible: false,
  });

  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const initialized = useRef(false);
  const userName = location.state && location.state.userName;

  type ErrosMap = {
    [key: number]: {
      title: string;
      subtitle: string;
    };
  };

  const errorsMap: ErrosMap = {
    401: {
      title: "Nome inválido",
      subtitle: "Escolha outro nome: ",
    },
    409: {
      title: "Esse nome já está em uso :(",
      subtitle: "Escolha outro nome: ",
    },
  };

  const handleErrors = (status: number) => {
    const errorConfig = errorsMap[status] || {
      title: "Ops, algo deu erroado : (",
      subtitle: "Tente novamente: ",
    };

    if (status === 403) {
      return navigate("/", { state: { isRoomFull: true } });
    }

    if (errorConfig) {
      setUserNameModal({
        isVisible: true,
        title: errorConfig.title,
        subtitle: errorConfig.subtitle,
      });
    }
  };

  const handleJoinRoom = (userName: string | undefined) => {
    if (userName) {
      socket.emit("room:join", { roomId, userName }, (response: any) => {
        if (response?.status === 200) {
          const { usersInRoom, currentDescription, currentPlayer } =
            response.data;
          setDescriptionMessage(currentDescription);
          setCurrentPlayer(currentPlayer?.name);
          setUsers((users) => {
            return [...users, ...usersInRoom];
          });

          setUserNameModal({
            isVisible: false,
            title: "",
            subtitle: "",
          });
        } else {
          handleErrors(response?.status);
        }
      });
    } else {
      setUserNameModal({
        isVisible: true,
        title: "Escolha um nome",
        subtitle: "Seu nome:",
      });
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      handleJoinRoom(userName);
    }

    socket.on("room:next-match", (data: nextMatchData) => {
      const currentPlayer = data.currentPlayer
      if (currentPlayer.id === socket.id) {
        setIsPlaying(() => true);
      } else {
        setIsPlaying(() => false);
      }
      setDescriptionMessage('')
      setCurrentPlayer(() => currentPlayer.name);
    });

    socket.on("room:description", ({ description }) => {
      setDescriptionMessage(description);
    });

    socket.on("room:topic", (data: any) => {
      setCurrentTopic(data.topic);
    });

    socket.on("room:stop", (data: any) => {
      setCurrentTopic(null);
      setCurrentPlayer(null);
      setTimer(null)
      setIsPlaying(false)
    });

    return () => {
      socket.off("room:next-match");
      socket.off("room:description");
      socket.off("room:topic");
    };
  }, []);

  return {
    timer,
    descriptionMessage,
    currentPlayer,
    currentTopic,
    isPlaying,
    userNameModal,
    handleJoinRoom,
    setDescriptionMessage,
  };
};

export default useRoom;
