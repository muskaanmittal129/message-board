import React, { useState } from "react";

const MessageForm = ({ onPostMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handlePostMessage = () => {
    onPostMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="message-form">
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Enter your message..."
      />
      <button onClick={handlePostMessage}>Post!</button>
    </div>
  );
};

export default MessageForm;
