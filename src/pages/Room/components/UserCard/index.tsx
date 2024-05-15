import "./style.css";
import cat from "../../../../images/avatars/cat.png";

type Props = {
  name: string;
  points: number;
};

const UserCard: React.FC<Props> = ({ name, points }) => {
  return (
    <div className="user-card">
      <div className="user-card__image">
        <img src={cat} alt="Your Image" />
      </div>
      <div className="user-card__info">
        <h4 className="user-card__title">{name}</h4>
        <h6 className="user-card__subtitle">pontos: {points || 0}</h6>
      </div>
    </div>
  );
};

export default UserCard;
