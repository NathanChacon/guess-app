import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { socket } from "../../../socket"
import { useParams, useLocation } from "react-router-dom";
type User = {
    name: string,
    roomId: string | null,
    points: number,
    joinTime: Date,
    id: string
}


const useRoom =  ({setUsers}: {setUsers: Dispatch<SetStateAction<Array<User>>>}) => {

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentPlayer, setCurrentPlayer] = useState<string | null>('')
    const [currentTopic, setCurrentTopic] = useState<string | null>('')
    const [timer, setTimer] = useState(null)
    const [descriptionMessage, setDescriptionMessage] = useState('')

    const { roomId } = useParams();
    const location = useLocation()

    const userName = location.state && location.state.userName;
    console.log(userName)
    const handleJoinRoom = () => {
        socket.emit('room:join', {roomId, userName}, (response: any) => {
          if(response?.status === 200){
            const {usersInRoom, currentDescription, currentPlayer} = response.data

            if(currentDescription){
                setDescriptionMessage(currentDescription)
              }
        
              if(currentPlayer){
                setCurrentPlayer(currentPlayer.id)
              }
        
              setUsers((users) => {
                  return [...users, ...usersInRoom]
              });
          }
          else{
            //handleErrors(response?.status)
          }
        });
        
      }

    useEffect(() => {
        handleJoinRoom()

        socket.on("room:next-match", (data: User) => {
            if(data.id === socket.id){
                setIsPlaying(() => true)
            }
            else{
                setIsPlaying(() => false)
            }
    
    
            setCurrentPlayer(() => data.name)
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
        socket.off("room:next-match")
        socket.off("room:description")
        socket.off("room:topic")
        socket.off("room:timer")
        socket.off("room:score")
      }
    }, [])


    return {
        timer,
        descriptionMessage,
        currentPlayer,
        currentTopic,
        isPlaying,
        setDescriptionMessage
    }
}

export default useRoom