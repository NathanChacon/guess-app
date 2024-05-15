type Props = {
  text: string;
  variant: "common" | "success" | "error";
};
const Message: React.FC<Props> = ({ text, variant }) => {
  const colorMap = {
    common: "white",
    info: "#6b0087",
    error: "red",
    success: "#5cb85c",
  };

  const textColor = colorMap[variant];

  return <div style={{ color: textColor }}>{text}</div>;
};

export default Message;
