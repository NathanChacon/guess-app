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

      if(chatContainerRef?.current){
        setTimeout(() => {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }, 400);
      }
    });

    return () => {
      socket.off("room:chat");
    };
  }, []);

  return {
    messages,
    setMessages,
    chatContainerRef
  };
};

export default useMessages;
