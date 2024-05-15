import { useEffect, useState, useRef } from "react";
import { socket } from "../../../socket";

type Message = {
  text: string;
  variant: "common" | "success" | "error";
};
type User = {
  name: string;
  roomId: string | null;
  points: number;
  joinTime: Date;
  id: string;
};

const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMessageDisabled, setIsMessageDisabled] = useState<boolean>(false)
  const chatContainerRef: any = useRef(null);


  useEffect(() => {
    socket.on("room:chat", (data: any) => {
      const text = `${data.fromUser.name}: ${data.message}`;

      const message = {
        text,
        variant: "common",
      };

      setMessages((messages: any) => {
        return [...messages, message];
      });
      setTimeout(() => {
        if (chatContainerRef?.current) {
          chatContainerRef.current.scrollToBottom();
        }
      }, 100);
    });

    socket.on("room:next-match", (data: any) => {
      if (!!data.previousTopic) {
        const text = `A resposta era: ${data.previousTopic}`;
        const message = {
          text,
          variant: "success",
        };

        setMessages((messages: any) => {
          return [...messages, message];
        });
      }

      setIsMessageDisabled(false)
    });

    socket.on("room:score", (data: any) => {
      const { user } = data;
      setMessages((messages: any) => {
        const message = {
          text: `${user.name} acertou!`,
          variant: "success",
        };

        return [...messages, message];
      });

      if(user.id === socket.id){
        setIsMessageDisabled(true)
      }
    });

    socket.on("room:user-enter", (data: User) => {
      setMessages((messages: any) => {
        const message = {
          text: `${data.name} entrou na sala`,
          variant: "info",
        };
        return [...messages, message];
      });
    });

    socket.on("room:user-leave", (data: User) => {
      const message = {
        text: `${data.name} saiu da sala`,
        variant: "info",
      };

      setMessages((messages: any) => {
        return [...messages, message];
      });
    });

    return () => {
      socket.off("room:chat");
      socket.off("room:next-match");
      socket.off("room:score");
      socket.off("room:user-enter")
      socket.off("room:user-leave")
    };
  }, []);

  return {
    messages,
    setMessages,
    isMessageDisabled,
    chatContainerRef,
  };
};

export default useMessages;
