import { useEffect, useState } from "react"
import { socket } from "../../../socket"

type Message = {
    text: string,
    variant: "common" | "success" | "error" 
}

const useMessages = () => {
    const [messages, setMessages] = useState <Message[]>([])

    useEffect(() => {
        socket.on('room:chat', (data: any) => {
            const text = `${data.fromUser.id}: ${data.message}`

            const message = {
              text,
              variant: "common"
            }

            setMessages((messages: any) => [...messages, message]);
      })

      return () => {
        socket.off('room:chat')
    }
      
    }, [])

    return {
        messages,
        setMessages
    }
}

export default useMessages