import "./App.css";

import React, { useState, useEffect } from "react";
import { socket } from "../../socket";

const Test: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  // Replace with your server URL

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.connect();
    socket.on("chat message", (msg: string) => {
      console.log("test", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off("chat message");
      socket.disconnect();
    };
  }, []); // Run this effect only once on component mount

  const handleMessageSubmit = (e: React.FormEvent) => {
    console.log("chamado 2");
    e.preventDefault();
    if (inputMessage.trim() !== "") {
      socket.emit("chat message", inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div>
      <h1>Chat Page</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Test;
