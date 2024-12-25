import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import urls, { basePath, socketServerPath } from "../../../utils/urls";
import { selectLoggedInUser, selectSession } from "../../components/auth/authSlice";
import ChatBox from "../../components/chatBox/ChatBox";
import Conversation from "../../components/conversation/Conversation";
import Loading from "../../components/loading";
import "./chat.css";

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
  const [isChatChanged, setIsChatChanged] = useState(false);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const getChat = async () => {
      try {
        const { data } = await axios.get(basePath + urls.chat.findChat.replace(":userId", userId), {
          headers: {
            authorization: `Bearer ${session.token}`
          }
        });
        if (Object.keys(data.data).length !== 0) {
          setCurrentChat(data.data)
          return;
        }
        else {
          const res = await axios.post(basePath + urls.chat.create, { user: userId }, {
            headers: {
              authorization: `Bearer ${session.token}`
            }
          })

          if (res?.data?.data) {
            setCurrentChat(res?.data?.data)
            setIsChatChanged(!isChatChanged)
            setLoading(true)
          }
        } 
      }
        catch (error) {
          console.error("Error fetching chat:", error.message);
        }
      };

      if (userId) getChat();
    }, [userId, session.token]);

  // Fetch all chats for the user
  useEffect(() => {
    const getChats = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(basePath + urls.chat.userChat, {
          headers: { authorization: `Bearer ${session.token}` },
        });
        setChats(data.data || []);
      } catch (error) {
        console.error("Error fetching chats:", error.message);
      } finally {
        setLoading(false);
      }
    };

    getChats();
  }, [user, isChatChanged]);

  // Socket setup and user connection
  useEffect(() => {
    socket.current = io(socketServerPath);

    socket.current.emit("new-user-add", user);
    socket.current.on("get-users", (users) => setOnlineUsers(users));

    // Cleanup socket listeners on unmount
    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  // Send message via socket
  useEffect(() => {
    if (sendMessage) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Receive messages from socket
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setReceivedMessage(data);
    };

    socket.current.on("recieve-message", handleReceiveMessage);

    // Cleanup listener on unmount
    return () => {
      socket.current.off("recieve-message", handleReceiveMessage);
    };
  }, []);

  // Check if a chat member is online
  const checkOnlineStatus = (chat) => {
    const chatMember = chat?.members?.find((member) => member._id !== user);
    return onlineUsers.some((onUser) => onUser.userId === chatMember?._id);
  };

  return (
    <div className="Chat" style={{ marginTop: "5rem" }}>
      {/* Left Side */}
      <div className="Left-side-chat">
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {loading ? (
              <Loading />
            ) : chats.length > 0 ? (
              chats.map((chat, id) => (
                <div key={id} onClick={() => setCurrentChat(chat)}>
                  <Conversation
                    data={chat}
                    currentUser={user}
                    online={checkOnlineStatus(chat)}
                  />
                </div>
              ))
            ) : (
              <span>No chats found!</span>
            )}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="Right-side-chat">
        <ChatBox
          chat={currentChat}
          currentUser={user}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
