import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { socket } from "../../../socket";
import userJoinAudio from '../../../audios/user_enter.mp3';
import userLeaveAudio from '../../../audios/user_leave.mp3';
type User = {
  name: string;
  roomId: string | null;
  points: number;
  joinTime: Date;
  id: string;
};

type Message = {
  text: string;
  variant: "common" | "success" | "error";
};

const useUsers = ({
  setMessages,
}: {
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
}) => {
  const [users, setUsers] = useState<User[]>([]);

  const userJoinSound = () => {
    const audio = new Audio(userJoinAudio);
    audio.volume=0.2
    audio.play();
  };

  const userLeaveSound = () => {
    const audio = new Audio(userLeaveAudio);
    audio.volume=0.2
    audio.play();
  };

  useEffect(() => {
    socket.on("room:user-enter", (data: User) => {
      setMessages((messages: any) => {
        const message = {
          text: `${data.name} entrou na sala`,
          variant: "info",
        };
        return [...messages, message];
      });
      
      setUsers((users) => {
        if (!users.some((user) => user.id === data.id)) {
          return [...users, data];
        }

        return users;
      });

      userJoinSound()
    });

    socket.on("room:user-leave", (data: User) => {
      const message = {
        text: `${data.name} saiu da sala`,
        variant: "info",
      };

      setMessages((messages: any) => {
        return [...messages, message];
      });

      setUsers((users) => {
        const filteredUsers = users.filter((user) => user.id !== data.id);

        return [...filteredUsers];
      });

      userLeaveSound()
    });

    socket.on("room:score", (data: any) => {
      const {writer, user} = data
  
        setUsers((users) => {
          const userToUpdate = users.find(({id}) => id === user.id)
          const writerToUpdate = users.find(({id}) => id === writer.id)
          if(userToUpdate && writerToUpdate){
            userToUpdate.points = user.points
            writerToUpdate.points = writer.points
          }
          return [...users]
        } )


        setMessages((messages: any) => {
          const message = {
            text: `${user.name} acertou!`,
            variant: "success",
          };

          return [...messages, message];
        });



    });

    return () => {
      socket.off("room:user-enter");
      socket.off("room:user-leave");
      socket.off("room:score");
    };
  }, []);

  return {
    users,
    setUsers,
  };
};

export default useUsers;
