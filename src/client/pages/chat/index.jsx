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

const Chat = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");
  const socket = useRef();
  const user = useSelector(selectLoggedInUser);
  const session = useSelector(selectSession);
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [isChatChanged, setIsChatChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getChat = async () => {
      try {
        const { data } = await axios.get(basePath + urls.chat.findChat.replace(":userId", userId), {
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        });
        if (Object.keys(data.data).length !== 0) {
          setCurrentChat(data.data);
          return;
        } else {
          const res = await axios.post(
            basePath + urls.chat.create,
            { user: userId },
            {
              headers: {
                authorization: `Bearer ${session.token}`,
              },
            }
          );

          if (res?.data?.data) {
            setCurrentChat(res?.data?.data);
            setIsChatChanged(!isChatChanged);
            setLoading(true);
          }
        }
      } catch (error) {
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
    <div className="flex flex-col md:flex-row h-full bg-gray-900 text-gray-300">
      {/* Left Side */}
      <div className="w-full md:w-1/3 h-full flex flex-col border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Chats</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loading />
            </div>
          ) : chats.length > 0 ? (
            chats.map((chat, id) => (
              <div
                key={id}
                onClick={() => setCurrentChat(chat)}
                className="cursor-pointer p-4 hover:bg-gray-800 transition"
              >
                <Conversation
                  data={chat}
                  currentUser={user}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <span className="text-gray-400">No chats found!</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-2/3 h-full flex flex-col">
        {currentChat ? (
          <ChatBox
            chat={currentChat}
            currentUser={user}
            setSendMessage={setSendMessage}
            receivedMessage={receivedMessage}
          />
        ) : (
          <div className="flex justify-center items-center flex-1">
            <span className="text-gray-400">Select a chat to start messaging</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
