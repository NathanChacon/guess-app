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
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState('')




  useEffect(() => {
    socket.on('userJoin', (data: any) => {
        const newUser = {
          userId: data?.userId,
        }

        setMessages((messages) => {
          const message = {
            text: `${newUser.userId} entrou na sala`,
            variant: 'success'
          }
          return [...messages, message]
        })
        
        setUsers((users) => {
          if(!users.some((user) => user.userId === newUser.userId)){
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
      setUsers((users) => {
          return [...users, ...usersInRoom]
      });
    })


    socket.on("userLeave", ({userId}: any) => {
      setMessages((messages) => {
        const message = {
          text: `${userId} saiu da sala`,
          variant: 'error'
        }
        return [...messages, message]
      })

      setUsers((users) => {
        const filteredUsers = users.filter((user) => user.userId !== userId)

        return [...filteredUsers]
      })
    })


    socket.on("nextPlayer", ({userId}: any) => {
      if(userId === socket.id){
        setIsPlaying(() => true)
      }
      else{
        setIsPlaying(() => false)
      }


      setCurrentPlayer(() => userId)
    })


    return () => {
        socket.off('userJoin')
        socket.off('roomMessage')
        socket.off("usersInRoom")
        socket.off("userLeave")
        socket.off("nextPlayer")
    }
  }, [])

  console.log(currentPlayer)

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
            {users.map(({userId, points}) => {
              return <li className='room__user'>
                      <UserCard name={userId} points={points}/>
                    </li>
            })}
          </ul>
          <div className='room__play-area'>
            <h1>{currentPlayer}</h1>
            <div className='room__play'>
                <textarea disabled={!isPlaying} />
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