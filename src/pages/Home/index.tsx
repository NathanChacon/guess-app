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

  useEffect(() => {
    api.get('/rooms').then((res):void => {
       setRooms(res.data)
    })
  }, [])

  const handleJoinRoom = (roomId:string) => {
    socket.emit('room:join', {roomId, userName});
    navigate(`rooms/${roomId}`)
  }

  const handleUserNameChange = (event:any) => {
     setUserName(event.target.value);
  };


  return (
    <section className='home'>
    <div className='home__name-section'>
      <h1 className='home__name-title'>Seu Nome:</h1>
      <input type="text" className="home__input" value={userName} onChange={handleUserNameChange}/>
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