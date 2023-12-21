import React, { useState, useEffect } from 'react';
import ReactDOM  from 'react-dom/client';
import axios from 'axios';
import MessageForm from './components/MessageForm';
import MessageList from './components/MessageList';

const BASE_URL = 'https://mapi.harmoney.dev/api';
const AUTH_TOKEN = 'FPZAggtFMinDlG1r';

function App() {
  const [messages, setMessages] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/v1/messages/`, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const postMessage = async (newMessage) => {
    try {
      await axios.post(`${BASE_URL}/v1/messages/`, { text: newMessage }, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });
      fetchMessages(); // Fetch messages immediately after posting
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/v1/messages/${id}/`, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });
      const updatedMessages = messages.filter((message) => message.id !== id);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const deleteAllMessages = async () => {
    try {
      for (const message of messages) {
        await axios.delete(`${BASE_URL}/v1/messages/${message.id}/`, {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        });
      }
  
      // Clear the messages state after deletion
      setMessages([]);
    } catch (error) {
      console.error('Error deleting all messages:', error);
    }
  };

  const sortMessages = () => {
    const sortedMessages = [...messages].sort((a, b) => {
      const timestampA = new Date(a.timestamp).getTime();
      const timestampB = new Date(b.timestamp).getTime();
      return sortAsc ? timestampA - timestampB : timestampB - timestampA;
    });

    setMessages(sortedMessages);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="app-container">
      <MessageForm onPostMessage={postMessage} />
      <div>
        <button onClick={deleteAllMessages}>Delete All Messages</button>
        <button onClick={sortMessages}>Sort by Timestamp</button>
        <MessageList messages={messages} onDeleteMessage={deleteMessage} />
      </div>
    </div>
  );
}



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

