import { useEffect, useState } from 'react';
import UserCard from './components/UserCard';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket';
import './style.css'
const Room = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState<any[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([]) 

  useEffect(() => {
    socket.on('userJoin', (data: any) => {
        console.log(data)
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
    <section className='room'>
      <div className='room__board'>
          <ul className='room__users'>
            {users.map(() => {
              return <li className='room__user'>
                      <UserCard/>
                    </li>
            })}
          </ul>
      </div>
    </section>
  );
};

export default Room;