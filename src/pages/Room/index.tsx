import { useState } from 'react';
import UserCard from './components/UserCard';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket';
import './style.css'
import Message from './components/Message';
import useMessages from './hooks/useMessages';
import useUsers from './hooks/useUsers';
import useRoom from './hooks/useRoom';
import UserNameModal from './components/UserNameModal';


const Room = () => {
  
  const { roomId } = useParams();
  const [currentMessage, setCurrentMessage] = useState('')


  const {
    messages,
    setMessages
  } = useMessages()

  const {
    users,
    setUsers
  } = useUsers({setMessages})

  const {
    timer,
    descriptionMessage,
    setDescriptionMessage,
    currentPlayer,
    currentTopic,
    isPlaying
  } = useRoom({setUsers})

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

  if(true){
    return <UserNameModal title='Escolha seu nome' subtitle='asdasdasdasd' onEnter={() => {}}/>
  }


  return (
    <section className='room'>
      <div className='room__board'>
        {timer &&  <span className='room__board-timer'>{timer}</span>}
        <div className='room__users-overflow'>
        <ul className='room__users'>
            {users.map(({id, points, name}) => {
              return <li className='room__user' key={id}>
                      <UserCard name={name} points={points}/>
                    </li>
            })}
          </ul>
        </div>

          <div className='room__play-area'>
            {currentPlayer && <h1 className='room__player-title'>{currentPlayer}</h1>}
            {isPlaying && <h4 className='room__topic'>Tópico: {currentTopic}</h4>}
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