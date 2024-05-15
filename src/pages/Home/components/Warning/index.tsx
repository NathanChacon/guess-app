import "./style.css";

type WarningProps = {
  title: string;
  subtitle: string;
  onClick: () => void;
};

const Warning:React.FC<WarningProps> = ({ title, subtitle, onClick }) => {
  return (
    <div className="warning">
      <div className="warning__card">
        <h1 className="warning__card-title">{title}</h1>
        <h3 className="warning__card-subtitle">{subtitle}</h3>

        <div className="warning__card-button-container">
          <button className="warning__card-button" onClick={onClick}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default Warning;
