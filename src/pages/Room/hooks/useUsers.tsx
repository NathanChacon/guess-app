import { useEffect, useState} from "react";
import { socket } from "../../../socket";
type User = {
  name: string;
  roomId: string | null;
  points: number;
  joinTime: Date;
  id: string;
};

type Props = {
  userLeaveSound: () => void
  userJoinSound: () => void
}

const useUsers = ({
  userLeaveSound,
  userJoinSound
}: Props) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    socket.on("room:user-enter", (data: User) => {  
      setUsers((users) => {
        if (!users.some((user) => user.id === data.id)) {
          return [...users, data];
        }

        return users;
      });

      userJoinSound()
    });

    socket.on("room:user-leave", (data: User) => {
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
