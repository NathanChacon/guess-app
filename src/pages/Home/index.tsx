import React, { useState, useEffect } from "react";
import api from "../../axios";
import { useNavigate, useLocation } from "react-router-dom";
import RoomCard from "./components/RoomCard";
import Warning from "./components/Warning";
import { socket } from "../../socket";
import CustomScrollbar from "../../components/CustomScrollbar";
import "./style.css";

type Room = {
  title: string;
  id: string;
  players: number;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState<String | null>(null);
  const isRoomFullError = location?.state?.isRoomFull;

  const [isWarningVisible, setIsWarningVisible] = useState(isRoomFullError);
  const [isNameWarningVisible, setIsNameWarningVisible] = useState(false);

  const handleUserNameErrors = (userName: string) => {
    var specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    // Check if username is not empty
    if (userName.trim() === "") {
      setUserNameError("Campo obrigatório");
    }

    // Check if userName has more than 10 characters
    else if (userName.length > 10) {
      setUserNameError("Máximo de 10 caracteres");
    }

    // Check if userName contains special characters
    else if (specialCharacters.test(userName)) {
      setUserNameError("Seu nick deve pode conter apenas letras e dígitos");
    }

    // Check if userName contains empty spaces
    else if (/\s/.test(userName)) {
      setUserNameError("Seu nick deve pode conter apenas letras e dígitos");
    } else {
      setUserNameError(null);
    }

    // If all checks pass, userName is valid
  };

  useEffect(() => {
    api.get("/rooms").then((res): void => {
      setRooms(res.data.rooms);
    });
  }, []);

  const handleJoinRoom = (roomId: string) => {
    if (!userNameError && userName) {
      navigate(`rooms/${roomId}`, { state: { userName } });
    } else {
      setIsNameWarningVisible(true);
    }
  };

  const handleUserNameChange = (event: any) => {
    setUserName(event.target.value);

    handleUserNameErrors(event.target.value);
  };

  const handleWarning = () => {
    setIsWarningVisible(false);
  };

  useEffect(() => {
    socket.on("room:change-state", (data: any) => {
      console.log("works", data);
    });

    return () => {
      socket.off("room:change-state");
    };
  }, []);

  return (
    <section className="home">
      <CustomScrollbar>
        <div className="home__main">
          <div className="home__name-section">
            <h1 className="home__name-title">Seu Nome:</h1>
            <div className="home__input-container">
              <input
                type="text"
                className="home__input"
                value={userName}
                onChange={handleUserNameChange}
              />
              <span className="home__input-error">
                {userNameError && userNameError}
              </span>
            </div>
          </div>
          <div className="home__room-section">
            <h1 className="home__room-title">Salas:</h1>
            <ul className="home__room-list">
              {rooms.map((room) => (
                <li className="home__room-list-item">
                  <RoomCard
                    title={room.title}
                    description={`Jogadores: ${room.players}/5`}
                    onClick={() => handleJoinRoom(room.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {isWarningVisible && (
          <Warning
            title="Ops, a sala está cheia"
            subtitle="Tente outra da nossa lista :)"
            onClick={handleWarning}
          />
        )}

        {isNameWarningVisible && (
          <Warning
            title="Seu nick pode conter apenas letras e dígitos"
            subtitle="Deve Possuir no máximo 10 caracteres"
            onClick={() => {
              setIsNameWarningVisible(false);
            }}
          />
        )}
      </CustomScrollbar>
    </section>
  );
};

export default Home;
