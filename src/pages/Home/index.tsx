import React, { useState, useEffect } from 'react';
import api from '../../axios'
import { socket } from '../../socket';

type Room = {
  title: string;
};
const Home: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  socket.connect()
  useEffect(() => {
    api.get('/rooms').then((res):void => {
       setRooms(res.data)
    })
  }, [])

  const handleJoinRoom = (roomId:string) => {
    socket.emit('joinRoom', roomId);
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