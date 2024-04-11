import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket';

const Room = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState<any[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([]) 

  useEffect(() => {
    socket.on('userJoin', (data: any) => {
        const {user: newUser} = data
        
        setUsers((users) => {
          if(!users.some((user) => user === newUser)){
            return [...users, newUser]
          }

          return users
        });
    })

    socket.on('roomMessage', (data: any) => {
        setMessages(messages => [...messages, data.message]);
  })


    return () => {
        socket.off('useJoin')
        socket.off('roomMessage')
    }
  }, [])



  const handleMessageChange = (event:any) => {
    setCurrentMessage(event.target.value);
  };

  const handleSendMessage = () => {
    socket.emit('roomMessage', {roomId, message: currentMessage})
    
    setCurrentMessage('');
  };

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      {users.map((user) => {
        return <div>{user}</div>
      })}
        {messages.map((message) => {
        return <div>{message}</div>
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