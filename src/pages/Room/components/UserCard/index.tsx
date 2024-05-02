import "./style.css";
import cat from "../../../../images/avatars/cat.png";

type elipseProps = {
  width: number;
  height: number;
};

type userProps = {
  name: string;
  points: number;
};

const EllipseImage = ({ width, height }: elipseProps) => {
  const viewBox = `0 0 ${width} ${height}`;
  const radiusX = width / 2;
  const radiusY = height / 2;
  const cx = radiusX;
  const cy = radiusY;

  return (
    <svg
      className="user-card__image"
      width={width}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx={cx} cy={cy} rx={radiusX} ry={radiusY} fill="white" />
    </svg>
  );
};

const UserCard = ({ name, points }: userProps) => {
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
