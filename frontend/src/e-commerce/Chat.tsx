import React, { useState, useEffect, useRef } from 'react';
import '../css/styles.css';
import '../css/customerchat.css';
import { io } from 'socket.io-client';

const Chat: React.FC = () => {
  const [sellers, setSellers] = useState<any[]>([]); // List of sellers
  const [messages, setMessages] = useState<any[]>([]); // Chat messages
  const [newMessage, setNewMessage] = useState<string>(''); // Input message
  const [activeSeller, setActiveSeller] = useState<any | null>(null); // Active seller for chat
  const [sellerTyping, setSellerTyping] = useState<boolean>(false); // Typing indicator for seller
  const socket = useRef<any>(null);
  const apiUrl = import.meta.env.VITE_API_URL; // API URL
  const Socketapiurl = 'ws://localhost:5000'; // WebSocket URL

  // Initialize WebSocket connection
  useEffect(() => {
    socket.current = io(Socketapiurl);

    // Join the static chat room
    const staticRoomId = 'chatwithseller';
    socket.current.emit('joinRoom', { roomId: staticRoomId });

    // Listen for incoming messages
    socket.current.on('message', (message: any) => {
      // Check if the message is already in the chat
      if (!messages.some((msg) => msg.text === message.text && msg.time === message.time)) {
        setMessages((prevMessages) => [...prevMessages, message]); // Append new messages to the chat
      }
    });

    // Listen for typing indicator from seller
    socket.current.on('typing', (status: boolean) => {
      setSellerTyping(status);
    });

    // Cleanup on component unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [Socketapiurl, messages]);

  // Fetch sellers data
  useEffect(() => {
    fetch(`${apiUrl}seller`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch sellers');
        }
        return res.json();
      })
      .then((data) => setSellers(data))
      .catch((err) => console.error(err));
  }, [apiUrl]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const staticRoomId = 'chatwithseller';
      const message = {
        sender: 'customer', // Sender identity
        text: newMessage,
        time: new Date().toLocaleTimeString(),
        roomId: staticRoomId,
      };

      // Only add the message if it's not already in the state
      if (!messages.some((msg) => msg.text === message.text && msg.time === message.time)) {
        socket.current.emit('message', message); // Emit message to the server
        setMessages((prevMessages) => [...prevMessages, message]); // Add to local messages
      }

      setNewMessage(''); // Clear the input field
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    socket.current.emit('typing', true); // Notify that the customer is typing

    // Stop typing notification after 1 second of inactivity
    clearTimeout(socket.current.typingTimeout);
    socket.current.typingTimeout = setTimeout(() => {
      socket.current.emit('typing', false); // Notify that the customer stopped typing
    }, 1000);
  };

  const handleSellerClick = (seller: any) => {
    setActiveSeller(seller);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div id="customer-chat">
      <div id="customer-chat-sidebar">
        <h2>SELLERS</h2>
        {sellers.map((seller) => (
          <div
            key={seller.id}
            className="customer-item"
            onClick={() => handleSellerClick(seller)}
          >
            <img
              src={`${apiUrl}uploads/${seller.image}`}
              alt={seller.first_name}
            />
            <span>
              {seller.first_name} {seller.last_name}
            </span>
          </div>
        ))}
      </div>

      <div id="customer-chat-section">
        {activeSeller && (
          <div id="customer-chat-header">
            Chat with {activeSeller.first_name}
          </div>
        )}
        <hr style={{ marginBottom: '30px' }} />
        <div id="customer-chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`customer-message ${msg.sender === 'customer' ? 'sent' : 'received'}`}
            >
              <div className="customer-message-bubble">{msg.text}</div>
              <div className="customer-message-time">{msg.time}</div>
            </div>
          ))}
          {sellerTyping && (
            <div className="typing-indicator">
              <span>Seller is typing...</span>
            </div>
          )}
        </div>
        <div id="customer-chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleTyping}
          />
          <button onClick={handleSendMessage}>Send</button>
          <button onClick={handleClearChat}>Clear Chat</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
