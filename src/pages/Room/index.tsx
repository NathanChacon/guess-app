import { useEffect, useState } from 'react';
import UserCard from './components/UserCard';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket';
import './style.css'
import Message from './components/Message';
const Room = () => {
  const { roomId } = useParams();
  const [users, setUsers] = useState<any[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([]) 

  useEffect(() => {
    socket.on('userJoin', (data: any) => {
        const {user: newUser} = data

        console.log("user join", data)
        setMessages((messages) => {
          const message = {
            text: `${newUser} entrou na sala`,
            variant: 'success'
          }
          return [...messages, message]
        })
        
        setUsers((users) => {
          if(!users.some((user) => user === newUser)){
            return [...users, newUser]
          }

          return users
        });
    })

    socket.on('roomMessage', (data: any) => {
        const text = `${data.fromUser}: ${data.message}`
        const message = {
          text,
          variant: "common"
        }
        setMessages(messages => [...messages, message]);
  })

    socket.on("usersInRoom", ({usersInRoom}) => {
      console.log("usersInRoom", usersInRoom)
      setUsers((users) => {
          return [...users, ...usersInRoom]
      });
    })


    return () => {
        socket.off('userJoin')
        socket.off('roomMessage')
        socket.off("usersInRoom")
    }
  }, [])



  const handleMessageChange = (event:any) => {
    setCurrentMessage(event.target.value);
  };

  const handleSendMessage = () => {
    socket.emit('roomMessage', {roomId, message: currentMessage})
    
    setCurrentMessage('');
  };

  const handleOnKeyDown = (e:any) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }
  console.log("users", users)
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
          <div className='room__play-area'>
            <div className='room__play'>

            </div>

            <div className='room__chat'>
                <ul className='room__chat-messages'>
                    {
                      messages.map(({text, variant}) => {
                        return <li>
                            <Message text={text} variant={variant}/>
                        </li>
                      })
                    }
                </ul>
                <input
                  type={"text"}
                  placeholder={"escreva aqui..."}
                  value={currentMessage}
                  onChange={handleMessageChange}
                  className='room__chat-input'
                  onKeyDown={handleOnKeyDown}
                />
            </div>
          </div>

      </div>
    </section>
  );
};

export default Room;