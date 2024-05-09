const ProgressBar = ({percentage}: {percentage: number}) => {
  return (
    <div style={{ width: '100%', backgroundColor: '#f0f0f0', height: '5px', borderRadius: '5px', maxWidth: "755px" }}>
        <div style={{ width: `${percentage}%`, backgroundColor: '#4CAF50', height: '100%', borderRadius: '5px', transition: 'width 0.1s ease' }}></div>
    </div>
  );
};

export default ProgressBar;