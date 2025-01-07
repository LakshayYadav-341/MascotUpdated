import React, { useState, useEffect } from "react";
import { serverPath } from "../../../utils/urls";
import tempImage from "@client/assets/images/profile.png";

const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const memberDetails = data.members.find((member) => member._id !== currentUser);
    setUserData(memberDetails);
  }, [data, currentUser]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative">
          {online && (
            <div className="bg-green-500 w-3 h-3 rounded-full absolute bottom-0 right-0 border-2 border-gray-800"></div>
          )}
          <img
            src={userData?.profilePhoto ? serverPath + userData?.profilePhoto : tempImage}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        <div className="ml-4">
          <h3 className="text-gray-300 font-bold text-lg">
            {userData?.name?.first} {userData?.name?.last}
          </h3>
          <p className={`text-sm ${online ? "text-green-500" : "text-gray-400"}`}>
            {online ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Conversation;