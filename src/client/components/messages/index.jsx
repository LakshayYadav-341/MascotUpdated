import React, { useState, useEffect } from 'react';
import Footer from '../footer';
import { useSelector } from 'react-redux';
import { useGetter } from '../../hooks/fetcher';
import urls, { basePath } from '@utils/urls';
import { selectSession } from '../auth/authSlice';

const ChatComponent = () => {
  const session = useSelector(selectSession);
  const connectionsUrl = basePath + urls.connections.getByUser.replace(":user", session?.user);

  // Fetch connected users
  const { data: connectedUsers, mutate: connectionMutate } = useGetter(connectionsUrl);

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
    <main className="flex flex-col lg:flex-row gap-4 px-4 py-8 bg-gray-900 text-gray-300 h-full">
      {/* Left Panel */}
      <div className="flex flex-col lg:w-1/3 bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-semibold">Messaging</h5>
          <i className="fa-regular fa-pen-to-square text-gray-400 cursor-pointer"></i>
        </div>
        <div className="relative mb-4">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search messages"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-300 focus:outline-none"
          />
        </div>
        <div className="overflow-y-auto h-96">
          {connectedUsers && connectedUsers.data && typeof connectedUsers.data !== "string" && connectedUsers.data.length > 0 ? (
            connectedUsers.data.map((reqUser) => {
              const user = reqUser.users?.[0];
              if (!user) return null;

              return (
                <div
                  key={reqUser._id}
                  className="flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-gray-700"
                  onClick={() => setSelectedUser(user)}
                >
                  <img
                    src={user.profilePhoto || '/default-profile.png'}
                    alt="personImg"
                    className="w-12 h-12 rounded-full"
                  />
                  <strong className="text-lg">{`${user.name.first} ${user.name.last}`}</strong>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">No connected users found</p>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex items-center gap-4 border-b border-gray-700 pb-4 mb-4">
              <img
                src={selectedUser.imageUrl || '/default-profile.png'}
                alt="profileImg"
                className="w-12 h-12 rounded-full"
              />
              <h2 className="text-lg font-semibold">{`${selectedUser.name.first} ${selectedUser.name.last}`}</h2>
            </div>
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === session.user ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === session.user
                        ? 'bg-blue-600 text-gray-300'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-gray-300 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <i className="fa-sharp fa-solid fa-paper-plane text-gray-300"></i>
                <span className="ml-2 text-gray-300">Send</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-400">Select a user to start chatting</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="lg:w-1/3 mt-8 lg:mt-0">
        <Footer />
      </div>
    </main>
  );
};

export default ChatComponent;
