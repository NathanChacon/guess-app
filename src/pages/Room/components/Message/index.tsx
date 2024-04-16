
type messageProps = {
    text: string, 
    variant: "common" | "success" | "error" 
}
const Message = ({ text, variant }: messageProps) => {
    const colorMap = {
        common: "white",
        error: "red",
        success: "green"
    }

    const textColor = colorMap[variant]
  
    return (
      <div style={{ color: textColor }}>
        {text}
      </div>
    );
  };
  
  export default Message;