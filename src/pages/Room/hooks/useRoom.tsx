import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { socket } from "../../../socket"
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

    useEffect(() => {
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

        socket.on("room:current-state", ({usersInRoom, currentDescription, currentPlayer}) => {

            console.log("test", currentPlayer, currentDescription)
            
            if(currentDescription){
              setDescriptionMessage(currentDescription)
            }
      
            if(currentPlayer){
              setCurrentPlayer(currentPlayer.id)
            }
      
            setUsers((users) => {
                return [...users, ...usersInRoom]
            });
          })

      return () => {
        socket.off("room:next-match")
        socket.off("room:description")
        socket.off("room:topic")
        socket.off("room:timer")
        socket.off("room:score")
        socket.off("room:current-state")
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