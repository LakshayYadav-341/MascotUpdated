import React from "react";
import { useNavigate } from "react-router-dom";

const RightContainer = ({
  others,
  tempUser,
  setShowAddressModal,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {!(others || Object.keys(tempUser?.data).includes("profile") || tempUser?.data?.role === "admin") && (
        <div className="p-4 bg-gray-800 rounded-lg shadow-md text-gray-300">
          <button
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-400 text-gray-300 font-semibold rounded-md shadow-md transition"
            onClick={() => setShowAddressModal(true)}
          >
            Unlock Complete Profile
          </button>
        </div>
      )}

      {!others &&
        tempUser?.data?.admin &&
        tempUser?.data?.admin?.role === "institute" &&
        !tempUser?.data?.admin?.institute && (
          <div className="p-4 bg-gray-800 rounded-lg shadow-md text-gray-300">
            <button
              className="w-full mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-400 text-gray-300 font-semibold rounded-md shadow-md transition"
              onClick={() => navigate("/institute/create")}
            >
              Create Institute
            </button>
          </div>
        )}
    </>
  );
};

export default RightContainer;
