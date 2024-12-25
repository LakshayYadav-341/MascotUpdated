import React, { useState, useEffect } from 'react';
import './styles.scss';
import Footer from '../footer';
import { useSelector } from 'react-redux';
import { useGetter } from '../../hooks/fetcher';
import urls, { basePath } from '@utils/urls';
import { selectSession } from '../auth/authSlice';

const ChatComponent = () => {
  const session = useSelector(selectSession);
  const connectionsUrl = basePath + urls.connections.getByUser.replace(":user", session?.user);

  // Fetch connected users
  const { data: connectedUsers, mutate: connectionMutate, isLoading: connectionIsLoading } = useGetter(connectionsUrl);

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Handle sending a new message
  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMessageObj = {
      id: messages.length + 1,
      sender: session.user,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessageObj]);
    setNewMessage('');
  };

  useEffect(() => {
    // Fetch initial messages or perform other side effects here
  }, []);

  return (
    <main className="mainChatContainer">
      <div className="leftChatContent card">
        <div className="chatList">
          <div className="chatListHeader">
            <h5>Messaging</h5>
            <i className="fa-regular fa-pen-to-square"></i>
          </div>
          <div className="searchChat">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="search messages" />
          </div>
          <div className="friendList">
            {connectedUsers && connectedUsers.data && connectedUsers.data.length > 0 ? (
              connectedUsers.data.map((reqUser) => {
                const user = reqUser.users?.[0];
                if (!user) return null;

                return (
                  <div
                    key={reqUser._id}
                    className="chatPerson"
                    onClick={() => setSelectedUser(user)}
                  >
                    <img
                      src={user.profilePhoto || '/default-profile.png'}
                      alt="personImg"
                      style={{ width: '70px', height: '70px' }}
                      className="profileImg"
                    />
                    <strong>{`${user.name.first} ${user.name.last}`}</strong>
                  </div>
                );
              })
            ) : (
              <p>No connected users found</p>
            )}
          </div>
        </div>
        <div id="chat-window">
          <div id="chat-header">
            {selectedUser && (
              <>
                <img
                  src={selectedUser.imageUrl || '/default-profile.png'}
                  alt="profileImg"
                  className="profileImg"
                />
                <h2>{`${selectedUser.name.first} ${selectedUser.name.last}`}</h2>
              </>
            )}
          </div>
          <div id="chat-body">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === session.user ? 'sent' : 'received'}`}
              >
                <p>{message.text}</p>
                <span className="timestamp">{message.timestamp}</span>
              </div>
            ))}
          </div>
          <div id="chat-footer">
            <input
              id="input"
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button id="send-btn" onClick={sendMessage}>
              <i className="fa-sharp fa-solid fa-paper-plane"></i> Send
            </button>
          </div>
        </div>
      </div>
      <div className="rightChatContent">
        <Footer />
      </div>
    </main>
  );
};

export default ChatComponent;
