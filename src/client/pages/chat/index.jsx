import React, { useRef, useState } from "react";
import ChatBox from "../../components/chatBox/ChatBox";
import { useLocation } from "react-router-dom";
import Conversation from "../../components/conversation/Conversation";
import "./Chat.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { selectLoggedInUser, selectSession } from "../../components/auth/authSlice";
import axios from "axios";
import urls, { basePath } from "../../../utils/urls";

const Chat = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const userId = searchParams.get('userId')
  const socket = useRef();
  const user = useSelector(selectLoggedInUser)
  const session = useSelector(selectSession)
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await axios.get(basePath + urls.chat.userChat, {
            headers: {
                authorization: `Bearer ${session.token}`
            }
        });
        setChats(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user._id]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:6969");
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage!==null) {
      socket.current.emit("send-message", sendMessage);}
  }, [sendMessage]);


  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data)
      setReceivedMessage(data);
    }

    );
  }, []);


  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member._id !== user._id);
    const online = onlineUsers.find((onUser) => onUser.userId === chatMember._id);
    return online ? true : false;
  };

  return (
    <div className="Chat" style={{marginTop: "5rem"}}>
      {/* Left Side */}
      <div className="Left-side-chat">
        {/* <LogoSearch /> */}
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.length > 0 ? chats.map((chat, id) => (
              <div
                key={id}
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
                <Conversation
                  data={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            )): <h1>No Chats found</h1>}
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        {/* <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons />
        </div> */}
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;