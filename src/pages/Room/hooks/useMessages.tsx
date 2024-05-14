import { useEffect, useState, useRef} from "react";
import { socket } from "../../../socket";

type Message = {
  text: string;
  variant: "common" | "success" | "error";
};

const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const chatContainerRef: any = useRef(null);
  useEffect(() => {
    socket.on("room:chat", (data: any) => {
      const text = `${data.fromUser.name}: ${data.message}`;

      const message = {
        text,
        variant: "common",
      };

      setMessages((messages: any) => {
        return [...messages, message]
      } );
      setTimeout(() => {
        if(chatContainerRef?.current){
          chatContainerRef.current.scrollToBottom();
        }
      }, 100)

    });

    socket.on("room:next-match", (data: any) => {
      if(!!data.previousTopic){
        const text = `A resposta era: ${data.previousTopic}`;
        const message = {
          text,
          variant: "success",
        };
  
        setMessages((messages: any) => {
          return [...messages, message]
        } );
      }

    });

    return () => {
      socket.off("room:chat");
      socket.off("room:next-match")
    };
  }, []);

  return {
    messages,
    setMessages,
    chatContainerRef
  };
};

export default useMessages;
