import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { socket } from "../../../socket";

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

  useEffect(() => {
    socket.on("room:user-enter", (data: User) => {
      console.log("data", data);

      setMessages((messages: any) => {
        const message = {
          text: `${data.name} entrou na sala`,
          variant: "success",
        };
        return [...messages, message];
      });

      setUsers((users) => {
        if (!users.some((user) => user.id === data.id)) {
          return [...users, data];
        }

        return users;
      });
    });

    socket.on("room:user-leave", (data: User) => {
      const message = {
        text: `${data.name} saiu da sala`,
        variant: "error",
      };

      setMessages((messages: any) => {
        return [...messages, message];
      });

      setUsers((users) => {
        const filteredUsers = users.filter((user) => user.id !== data.id);

        return [...filteredUsers];
      });
    });

    return () => {
      socket.off("room:user-enter");
      socket.off("room:user-leave");
    };
  }, []);

  return {
    users,
    setUsers,
  };
};

export default useUsers;
