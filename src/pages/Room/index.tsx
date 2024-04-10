import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket';

const Room = () => {
  const { roomId } = useParams(); // Extract roomId from URL parameters
  const [users, setUsers] = useState<any[]>([])
  const [currentMessage, setCurrentMessage] = useState('')

  useEffect(() => {
    socket.on('userJoin', (data: any) => {
        const {user: newUser} = data
        if(!users.some((user) => user === newUser)){
            setUsers([...users, newUser])
        }
    })


    return () => {
        socket.off('useJoin')
    }
  }, [])

  const handleMessageChange = (event:any) => {
    setCurrentMessage(event.target.value);
  };

  const handleSendMessage = () => {
    // Add your logic to send the message, for example, emitting a socket event
    console.log('Sending message:', currentMessage);
    socket.emit('roomMessage', {roomId, message: currentMessage})
    // Clear the textarea after sending the message
    setCurrentMessage('');
  };


  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      {users.map((user) => {
        return <div>{user}</div>
      })}

    <div>
        <textarea
            value={currentMessage}
            onChange={handleMessageChange}
            placeholder="Type your message here..."
            rows={4}
            cols={50}
        />
            <br />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    </div>
  );
};

export default Room;