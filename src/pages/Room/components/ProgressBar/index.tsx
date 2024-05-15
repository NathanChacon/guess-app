type Props =  {
  percentage: number
}

const ProgressBar: React.FC<Props> = ({percentage}) => {
  return (
    <div style={{ width: '100%', backgroundColor: '#f0f0f0', height: '5px', maxWidth: "755px" }}>
        <div style={{ width: `${percentage}%`, backgroundColor: 'rgb(236 0 255)', height: '100%', transition: 'width 0.1s ease' }}></div>
    </div>
  );
};

export default ProgressBar;