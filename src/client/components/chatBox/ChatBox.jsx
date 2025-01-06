import React, { useEffect, useState } from "react";
import { useRef } from "react";
import "./ChatBox.css";
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
  const [loading, setLoading] = useState(true)
  const session = useSelector(selectSession);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // fetching data for header
  useEffect(() => {
    if (chat !== null) {
      const memberDetails = chat.members.find(
        (member) => member._id !== currentUser
      );
      setUserData(memberDetails);
      setLoading(true)
    }
  }, [chat, currentUser]);

  // fetch messages
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
        console.log(error);
      }
      finally{
        setLoading(false)
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      message: newMessage,
      chatId: chat._id,
    };
    const receiver = chat.members.find((member) => member._id !== currentUser);
    // send message to socket server
    setSendMessage({ ...message, receiverId: receiver._id });
    // send message to database
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
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  const scroll = useRef();
  const imageRef = useRef();
  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-header */}
            <div className="chat-header">
              <div className="follower">
                <div>
                  <img
                    src={
                      userData?.profilePhoto
                        ? serverPath + userData?.profilePhoto
                        : tempImage
                    }
                    alt="Profile"
                    className="followerImage"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="name" style={{ fontSize: "0.9rem" }}>
                    <span>
                      {userData?.name.first} {userData?.name.last}
                    </span>
                    <span>{userData?.role}</span>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #ececec",
                  marginTop: "20px",
                }}
              />
            </div>
            {/* chat-body */}
            <div className="chat-body">
              {loading ? <Loading /> : messages?.length > 0 ? (
                messages.map((message, id) => (
                  <>
                    <div
                      ref={scroll}
                      className={
                        message.sender === currentUser
                          ? "message own"
                          : "message"
                      }
                      key={id}
                    >
                      <span>{message.message}</span>{" "}
                      <span>{format(message.createdAt)}</span>
                    </div>
                  </>
                ))
              ) : (
                <span className="chatbox-empty-message">
                  No messages found!!
                </span>
              )}
            </div>
            <div className="chat-sender">
              <div onClick={() => imageRef.current.click()}>+</div>
              <InputEmoji value={newMessage} onChange={handleChange} />
              <div
                className="send-button button"
                onClick={handleSend}
                style={{ width: "8%", height: "100%", borderRadius: "50px" }}
              >
                Send
              </div>
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
              />
            </div>{" "}
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
