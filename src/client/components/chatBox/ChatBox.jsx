import React, { useEffect, useState, useRef } from "react";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import axios from "axios";
import urls, { basePath, serverPath } from "../../../utils/urls";
import { useSelector } from "react-redux";
import { selectSession } from "../auth/authSlice";
import tempImage from "@client/assets/images/profile.png";
import Loading from "../loading";

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const session = useSelector(selectSession);

  const scroll = useRef();
  const imageRef = useRef();

  // Update new message input value
  const handleChange = (message) => setNewMessage(message);

  // Fetch chat partner's details
  useEffect(() => {
    if (chat) {
      const memberDetails = chat.members.find(
        (member) => member._id !== currentUser
      );
      setUserData(memberDetails);
      setLoading(true);
    }
  }, [chat, currentUser]);

  // Fetch messages for the chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          basePath + urls.message.getMessage.replace(":chatId", chat?._id),
          {
            headers: {
              authorization: `Bearer ${session.token}`,
            },
          }
        );
        setMessages(data.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (chat) fetchMessages();
  }, [chat, session.token]);

  // Scroll to the latest message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle message sending
  const handleSend = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const message = {
      message: newMessage,
      chatId: chat._id,
    };

    const receiver = chat.members.find((member) => member._id !== currentUser);

    // Send message to WebSocket server
    setSendMessage({ ...message, receiverId: receiver._id });

    // Send message to database
    try {
      const { data } = await axios.post(
        basePath + urls.message.create,
        message,
        {
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        }
      );
      setMessages([...messages, data.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle incoming message
  useEffect(() => {
    if (receivedMessage && receivedMessage.chatId === chat._id) {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  }, [receivedMessage, chat?._id]);

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col h-full">
      {chat ? (
        <>
          {/* Chat Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={
                  userData?.profilePhoto
                    ? serverPath + userData.profilePhoto
                    : tempImage
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="text-gray-300 text-lg font-semibold">
                  {userData?.name?.first} {userData?.name?.last}
                </h3>
                <p className="text-gray-400 text-sm capitalize">
                  {userData?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto mb-4">
            {loading ? (
              <Loading />
            ) : messages.length > 0 ? (
              messages.map((message, id) => (
                <div
                  key={id}
                  ref={scroll}
                  className={`p-3 rounded-lg mb-3 max-w-sm break-words text-sm ${
                    message.sender === currentUser
                      ? "bg-blue-950 text-gray-300 ms-auto"
                      : "bg-gray-700 text-gray-300 me-auto"
                  }`}
                >
                  <p>{message.message}</p>
                  <span className="text-gray-400 text-xs block mt-1">
                    {format(message.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No messages found!</p>
            )}
          </div>

          {/* Message Input */}
          <div className="flex items-center">
            <button
              onClick={() => imageRef.current.click()}
              className="bg-gray-700 p-2 rounded-full text-gray-400 hover:bg-gray-600 focus:outline-none mr-3"
            >
              <i className="fas fa-paperclip"></i>
            </button>

            <InputEmoji
              value={newMessage}
              onChange={handleChange}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 text-gray-300 rounded-lg px-4 py-2 focus:outline-none"
            />

            <button
              onClick={handleSend}
              className="bg-blue-500 hover:bg-blue-600 text-gray-300 font-bold py-2 px-6 rounded-lg ml-3 focus:outline-none transition-all"
            >
              Send
            </button>

            <input
              type="file"
              ref={imageRef}
              style={{ display: "none" }}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-center">Tap on a chat to start conversation...</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;