import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import MessageForm from "./components/MessageForm";
import MessageList from "./components/MessageList";

const BASE_URL = "https://mapi.harmoney.dev/api";
const AUTH_TOKEN = "FPZAggtFMinDlG1r";

function App() {
  const [messages, setMessages] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages(currentPage);
  }, [currentPage]);

  const fetchMessages = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/v1/messages/`, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
        params: {
          page,
          pageSize,
        },
      });
      setMessages(response?.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const postMessage = async (newMessage) => {
    try {
      await axios.post(
        `${BASE_URL}/v1/messages/`,
        { text: newMessage },
        {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        }
      );
      fetchMessages(); // Fetch messages immediately after posting
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/v1/messages/${id}/`, {
        headers: {
          Authorization: AUTH_TOKEN,
        },
      });
      const updatedMessages = messages?.filter((message) => message.id !== id);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const deleteAllMessages = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete all messages?"
      );
      if (confirmDelete) {
        if (messages && messages.length > 0) {
          for (const message of messages) {
            await axios.delete(`${BASE_URL}/v1/messages/${message.id}/`, {
              headers: {
                Authorization: AUTH_TOKEN,
              },
            });
          }
        }

        // Clear the messages state after deletion
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting all messages:", error);
    }
  };

  const sortMessages = () => {
    const sortedMessages = [...messages].sort((a, b) => {
      const timestampA = new Date(a.timestamp).getTime();
      const timestampB = new Date(b.timestamp).getTime();
      return sortAsc ? timestampA - timestampB : timestampB - timestampA;
    });

    setMessages(sortedMessages || []);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="app-container">
      <h2>Chatter</h2>
      <p>Type something in the box below, then hit "Post"</p>
      <div className="message-input-container">
        <MessageForm onPostMessage={postMessage} />

        <button
          onClick={deleteAllMessages}
          disabled={!messages || messages.length === 0}
        >
          Delete All
        </button>
        <button onClick={sortMessages}>Sort</button>
      </div>
      <div className="message-list-container">
        <MessageList
          messages={messages}
          onDeleteMessage={deleteMessage}
          loading={loading}
        />

        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={nextPage}>Next</button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
