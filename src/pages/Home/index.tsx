import React, { useState, useEffect } from 'react';
import api from '../../axios'
import { socket } from '../../socket';
import { useNavigate } from 'react-router-dom';
type Room = {
  title: string;
};
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    api.get('/rooms').then((res):void => {
       setRooms(res.data)
    })
  }, [])

  const handleJoinRoom = (roomId:string) => {
    socket.emit('joinRoom', roomId);
    navigate(`rooms/${roomId}`)
  }

  return (
    <div>
    <h2>Rooms:</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {rooms.map(room => (
        <button
          key={room?.title}
          onClick={() => handleJoinRoom(room.title)}
          style={{
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            margin: '5px',
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
          }}
        >
          {room?.title}
        </button>
      ))}
    </div>
  </div>
  )
};


export default Home;