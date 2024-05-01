import React, { useState, useEffect } from 'react';
import api from '../../axios'
import { socket } from '../../socket';
import { useNavigate } from 'react-router-dom';
import RoomCard from './components/RoomCard';
import './style.css'

type Room = {
  title: string;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([])
  const [userName, setUserName] = useState('')
  const [userNameError, setUserNameError] = useState<String | null>(null)

const handleUserNameErrors = (userName: string) => {
  var specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    // Check if username is not empty
 if (userName.trim() === "") {
     setUserNameError("Campo obrigatório")
 }

 // Check if userName has more than 10 characters
else if (userName.length > 10) {
    setUserNameError("Máximo de 10 caracteres")
 }

 // Check if userName contains special characters

 else if (specialCharacters.test(userName)) {
     setUserNameError("Seu nick deve pode conter apenas letras e dígitos")
 }

 // Check if userName contains empty spaces
 else if (/\s/.test(userName)) {
     setUserNameError("Seu nick deve pode conter apenas letras e dígitos")
 }

 else{
   setUserNameError(null)
 }

 // If all checks pass, userName is valid
  
}

  useEffect(() => {
    api.get('/rooms').then((res):void => {
       setRooms(res.data)
    })
  }, [])

  const handleErrors = (status: number) => {

  }

  const handleJoinRoom = (roomId:string) => {
    if(!userNameError){
      navigate(`rooms/${roomId}`,{ state: { userName} })   
    }
    else{

    }
  }

  const handleUserNameChange = (event:any) => {
     setUserName(event.target.value);

     handleUserNameErrors(event.target.value)
  };


  return (
    <section className='home'>
    <div className='home__name-section'>
      <h1 className='home__name-title'>Seu Nome:</h1>
      <div className='home__input-container'>
        <input type="text" className="home__input" value={userName} onChange={handleUserNameChange}/>
        <span className='home__input-error'>
          {userNameError && userNameError}
        </span>
      </div>
    </div>
    <div className='home__room-section'>
      <h1 className='home__room-title'>Salas:</h1>
        <ul className='home__room-list'>
        {rooms.map(room => (
          <li className='home__room-list-item'>
            <RoomCard
              title={room.title}
              description='Jogadores: 1/5'
              onClick={() => handleJoinRoom(room.title)}
            />
          </li>

        ))}
        </ul>
    </div>
  </section>
  )
};


export default Home;