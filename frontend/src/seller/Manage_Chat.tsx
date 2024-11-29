import React, { useState, useEffect, useRef } from 'react';
import logo from '../images/davao-petworld-logo.png';
import '../css/manage_admin.css';
// import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../css/chat.css';
import { io } from 'socket.io-client';

const SellerChat: React.FC = () => {
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
  // const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
  const [ setAdminProfile] = useState<any | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [activeCustomer, setActiveCustomer] = useState<any | null>(null);
  const [typingStatus, setTypingStatus] = useState<string>(''); // Typing status for the other person
  const socket = useRef<any>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const Socketapiurl = 'ws://localhost:5000';

  useEffect(() => {
    socket.current = io(Socketapiurl);
    const staticRoomId = 'chatwithseller';
    socket.current.emit('joinRoom', { roomId: staticRoomId });

    // Listen for incoming messages
    socket.current.on('message', (message: any) => {
      if (message.sender !== 'seller') {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    // Listen for typing status
    socket.current.on('typing', (status: any) => {
      setTypingStatus(status);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [Socketapiurl]);

  useEffect(() => {
    const sellerId = localStorage.getItem('seller_id');
    if (sellerId) {
      fetch(`${apiUrl}seller/${sellerId}`)
        .then((res) => res.json())
        .then((data) => setAdminProfile(data[0] || null))
        .catch((err) => console.log(err));
    }
  }, [apiUrl]);

  useEffect(() => {
    fetch(`${apiUrl}user`)
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.log(err));
  }, [apiUrl]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const staticRoomId = 'chatwithseller';
      const message = {
        sender: 'seller',
        text: newMessage,
        time: new Date().toLocaleTimeString(),
        roomId: staticRoomId,
      };

      socket.current.emit('message', message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  const handleCustomerClick = (customer: any) => {
    setActiveCustomer(customer);
    setMessages([]);
    setTypingStatus(''); // Clear typing status when switching customers
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    socket.current.emit('typing', `${activeCustomer?.first_name} is typing...`);

    clearTimeout(socket.current.typingTimeout);
    socket.current.typingTimeout = setTimeout(() => {
      socket.current.emit('typing', ''); // Clear typing status after 1 second
    }, 1000);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div>
      <section id="sidebar" className={sidebarHidden ? 'hide' : ''}>
        <img
          src={logo}
          alt="Logo"
          className="logo"
          style={{
            height: 'auto',
            width: '90%',
            verticalAlign: 'middle',
            margin: '0 auto',
            display: 'flex',
          }}
        />
        <Sidebar />
      </section>

      <section id="content">
        <nav>
          <i
            className="bx bx-menu toggle-sidebar"
            onClick={() => setSidebarHidden((prev) => !prev)}
          ></i>
          {/* <div className="profile">
            {adminProfile && (
              <>
                <img
                  src={`${apiUrl}uploads/${adminProfile.image}`}
                  alt="Profile"
                  onClick={() =>
                    setProfileDropdownVisible((prev) => !prev)
                  }
                />
                <ul
                  className={`profile-link ${profileDropdownVisible ? 'show' : ''}`}
                >
                  <li>
                    <h1>Welcome: {adminProfile.first_name}</h1>
                  </li>
                  <li>
                    <Link
                      to={`/seller_profile/${localStorage.getItem('seller_id')}`}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <a href="#" onClick={() => localStorage.clear()}>
                      Logout
                    </a>
                  </li>
                </ul>
              </>
            )}
          </div> */}
        </nav>

        <main>
          <h1>Seller Chat</h1>
          <div id="seller-chat">
            <div id="seller-chat-sidebar">
              <h2 style={{color: 'white'}}>CUSTOMERS</h2>
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="seller-item"
                  onClick={() => handleCustomerClick(customer)}
                >
                  <img
                    src={`${apiUrl}uploads/${customer.image}`}
                    alt={customer.name}
                  />
                  <span>
                    {customer.first_name} {customer.last_name}
                  </span>
                </div>
              ))}
            </div>

            <div id="seller-chat-section">
    
              <div id="seller-chat-header">
                
                {activeCustomer
                  ? `Chat with ${activeCustomer.first_name} ${activeCustomer.last_name}`
                  : 'Select a Customer'}
              </div>
              
              <hr />
              
              <div id="seller-chat-messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`seller-message ${
                      msg.sender === 'seller' ? 'sent' : 'received'
                    }`}
                  >
                    <div className="seller-message-bubble">{msg.text}</div>
                    <div className="seller-message-time">{msg.time}</div>
                  </div>
                ))}
              </div>

              {typingStatus && <div className="typing-indicator">{typingStatus}</div>}

              <div id="seller-chat-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={handleTyping}
                />
                <button onClick={handleSendMessage} style={{marginRight: '10px'}}>Send</button>
                <button onClick={handleClearChat}>Clear Chat</button>
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default SellerChat;
