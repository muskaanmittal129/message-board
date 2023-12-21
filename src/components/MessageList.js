import React from 'react';

const MessageList = ({ messages, onDeleteMessage }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className="message-item">
          <p>{message.source} - {message.timestamp}</p>
          <p>{message.text}</p>
          <button onClick={() => onDeleteMessage(message.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
