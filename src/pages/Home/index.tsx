import React, { useState, useEffect, useCallback } from "react";
import api from "../../axios";
import { useNavigate, useLocation } from "react-router-dom";
import RoomCard from "./components/RoomCard";
import Warning from "./components/Warning";
import { socket } from "../../socket";
import CustomScrollbar from "../../components/CustomScrollbar";
import "./style.css";
import RoomList from "./components/RoomList";

type Room = {
  title: string;
  id: string;
  players: number;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userName, setUserName] = useState<string>("");
  const isRoomFullError = location?.state?.isRoomFull;
  const [hasTouchedInput, setHasTouchedInput] = useState(false)
  const [isWarningVisible, setIsWarningVisible] = useState(isRoomFullError);
  const [isNameWarningVisible, setIsNameWarningVisible] = useState(false);

  const handleUserNameErrors = () => {
    var specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    // Check if username is not empty
      if (userName.trim() === "") {
        return "Campo obrigatório"
      }

      // Check if userName has more than 10 characters
      else if (userName.length > 10) {
        return "Máximo de 10 caracteres"
      }

      // Check if userName contains special characters
      else if (specialCharacters.test(userName)) {
        return "Seu nick deve pode conter apenas letras e dígitos"
      }

      // Check if userName contains empty spaces
      else if (/\s/.test(userName)) {
        return "Seu nick deve pode conter apenas letras e dígitos"
      } 
      else {
        return null
      }
    // If all checks pass, userName is valid
  };

  const userNameError = hasTouchedInput && handleUserNameErrors()
  const isUserNameValid = !userNameError && !!userName

  useEffect(() => {
    api.get("/rooms").then((res): void => {
      setRooms(res.data.rooms);
    });
  }, []);

  const handleJoinRoom = useCallback((roomId: string) => {
    if (isUserNameValid) {
      navigate(`rooms/${roomId}`, { state: { userName } });
    } else {
      setIsNameWarningVisible(true);
    }
  }, [isUserNameValid, userName])

  const handleUserNameChange = (event: any) => {
    if(!hasTouchedInput){
      setHasTouchedInput(true)
    }
    
    setUserName(event.target.value);
  };

  const handleWarning = () => {
    setIsWarningVisible(false);
  };

  useEffect(() => {
    socket.on("room:change-state", (data: any) => {
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
            <RoomList rooms={rooms} handleJoinRoom={handleJoinRoom} />
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
