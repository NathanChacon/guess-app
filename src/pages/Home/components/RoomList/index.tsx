import React from "react"
import RoomCard from "../RoomCard";

type Room = {
    title: string;
    id: string;
    players: number;
};


type Props = {
    rooms: Array<Room>,
    handleJoinRoom: (id:string) => void
}

const  RoomList = ({rooms, handleJoinRoom}: Props) => {
    return (
        <ul className="home__room-list">
        {rooms.map((room) => (
          <li className="home__room-list-item" key={room.id}>
            <RoomCard
              title={room.title}
              description={`Jogadores: ${room.players}/5`}
              onClick={() => handleJoinRoom(room.id)}
            />
          </li>
        ))}
      </ul>
    )
}


export default React.memo(RoomList)