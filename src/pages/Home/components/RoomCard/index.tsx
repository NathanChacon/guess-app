import "./style.css";

type RoomCard = {
  title: string;
  description: string;
  onClick: () => void;
};

const RoomCard: React.FC<RoomCard> = ({ title, description, onClick = () => {} }) => {
  return (
    <div className="room-card" onClick={onClick}>
      <h3 className="room-card__title">{title}</h3>
      <h4 className="room-card__description">{description}</h4>
    </div>
  );
};

export default RoomCard;
