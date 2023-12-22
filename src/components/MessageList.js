import React from "react";
import Shimmer from "./shimmer";

const MessageList = ({ messages, onDeleteMessage, loading }) => {
  return (
    <div className="message-list">
      {loading ? (
        <Shimmer />
      ) : (
        messages?.map((message) => (
          <div key={message.id} className="message-item">
            <p>
              {message.source} - {message.timestamp}
            </p>
            <p>{message.text}</p>
            <button onClick={() => onDeleteMessage(message.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
