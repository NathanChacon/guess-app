import { useEffect, useState } from 'react';
import UserCard from './components/UserCard';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket';
import './style.css'
import Message from './components/Message';

type User = {
  name: string,
  roomId: string | null,
  points: number,
  joinTime: Date,
  id: string
}


const Room = () => {
  
  const { roomId } = useParams();
  const [users, setUsers] = useState<User[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [descriptionMessage, setDescriptionMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([]) 
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<string | null>('')
  const [currentTopic, setCurrentTopic] = useState<string | null>('')
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    socket.on('room:user-enter', (data: User) => {

        setMessages((messages) => {
          const message = {
            text: `${data.id} entrou na sala`,
            variant: 'success'
          }
          return [...messages, message]
        })
        
        setUsers((users) => {
          if(!users.some((user) => user.id === data.id)){
            return [...users, data]
          }

          return users
        });
    })

    socket.on('room:chat', (data: any) => {
        const text = `${data.fromUser.id}: ${data.message}`
        const message = {
          text,
          variant: "common"
        }
        setMessages(messages => [...messages, message]);
  })

    socket.on("room:current-state", ({usersInRoom, currentDescription}) => {
      if(currentDescription){
        setDescriptionMessage(currentDescription)
      }

      setUsers((users) => {
          return [...users, ...usersInRoom]
      });
    })


    socket.on("room:user-leave", (data: User) => {
      const message = {
        text: `${data.id} saiu da sala`,
        variant: 'error'
      }

      setMessages((messages) => {
        return [...messages, message]
      })

      setUsers((users) => {
        const filteredUsers = users.filter((user) => user.id !== data.id)

        return [...filteredUsers]
      })
    })


    socket.on("room:next-match", (data: User) => {
      if(data.id === socket.id){
        setIsPlaying(() => true)
      }
      else{
        setIsPlaying(() => false)
      }


      setCurrentPlayer(() => data.id)
    })

    socket.on("room:description", ({description}) => {
      setDescriptionMessage(description)
    })

    socket.on("room:topic", (data: any) => {
      setCurrentTopic(data.topic)
    })

    socket.on("room:stop", (data: any) => {
      setCurrentTopic(null)
      setCurrentPlayer(null)
    })

    socket.on("room:timer", (data: any) => {
      if(data && data > 0){
        setTimer(data)
      }
      else{
        setTimer(null)
      }
    })


    socket.on("room:score", (data: any) => {
      console.log("test", data)
    })


    return () => {
        socket.off('room:user-enter')
        socket.off('room:chat')
        socket.off("room:current-state")
        socket.off("room:user-leave")
        socket.off("room:next-match")
        socket.off("room:description")
        socket.off("room:topic")
        socket.off("room:timer")
    }
  }, [])

  const handleMessageChange = (event:any) => {
    setCurrentMessage(event.target.value);
  };

  const handleSendMessage = () => {
    socket.emit('room:chat', {roomId, message: currentMessage})
    
    setCurrentMessage('');
  };

  const handleOnKeyDown = (e:any) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }


  const onDescriptionChange = (event: any) => {
    const description = event.target.value;
    setDescriptionMessage(description);

    socket.emit('room:description', {roomId, description});
  }

  return (
    <section className='room'>
      <div className='room__board'>
        {timer &&  <span className='room__board-timer'>{timer}</span>}
       
          <ul className='room__users'>
            {users.map(({id, points}) => {
              return <li className='room__user'>
                      <UserCard name={id} points={points}/>
                    </li>
            })}
          </ul>
          <div className='room__play-area'>
            {currentPlayer && <h1>{currentPlayer}</h1>}
            {isPlaying && <h4>Tópico: {currentTopic}</h4>}
            <div className='room__play'>
                <textarea 
                  value={descriptionMessage}
                  onChange={onDescriptionChange}
                  placeholder="Type your message here..."
                  disabled={!isPlaying} />
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