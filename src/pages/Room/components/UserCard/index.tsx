import './style.css'

type elipseProps = {
    width: number,
    height: number
}

const EllipseImage = ({ width, height }: elipseProps) => {
    const viewBox = `0 0 ${width} ${height}`;
    const radiusX = width / 2;
    const radiusY = height / 2;
    const cx = radiusX;
    const cy = radiusY;
  
    return (
      <svg width={width} height={height} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
        <ellipse cx={cx} cy={cy} rx={radiusX} ry={radiusY} fill="white" />
      </svg>
    );
  };

const UserCard = () => {
    return (
        <div className="user-card">
            <EllipseImage width={80} height={80}/>
            <div className='user-card__info'>
                <h4>Nathan</h4>
                <h6>pontos: 10</h6>
            </div>
        </div>
    )
}

export default UserCard