import React from "react";
import { Link } from "react-router-dom";

export default function ProfileAnalytics({ postData, tempUser, id, jobData, session, connectedUser, others }) {
  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md text-gray-300">
      {/* Analytics Title */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold">Analytics</div>
      </div>

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Posts Analytics */}
        <div className="flex flex-col items-center">
          <span className="material-symbols-rounded text-3xl text-blue-500">description</span>
          <Link
            to={`/posts-filter-results/${id}`}
            className="text-lg font-semibold text-blue-400 hover:underline mt-2"
          >
            {postData?.data?.length} Posts
          </Link>
          <span className="text-sm text-gray-400">Discover your posts.</span>
        </div>

        {/* Referrals Analytics */}
        {tempUser?.data.role === "alumni" && (
          <div className="flex flex-col items-center">
            <span className="material-symbols-rounded text-3xl text-green-500">bar_chart</span>
            <Link
              to={others ? "#" : `/userJob/${id}`}
              className="text-lg font-semibold text-green-400 hover:underline mt-2"
            >
              {jobData?.data?.length} Referrals posted
            </Link>
            <span className="text-sm text-gray-400">Checkout the referrals posted by you.</span>
          </div>
        )}

        {/* Connections Analytics */}
        <div className="flex flex-col items-center">
          <span className="material-symbols-rounded text-3xl text-yellow-500">group</span>
          <Link
            to={session?.user !== id ? "#" : "/network"}
            className="text-lg font-semibold text-yellow-400 hover:underline mt-2"
          >
            {typeof connectedUser?.data === "string" ? 0 : connectedUser?.data?.length} Connections
          </Link>
          <span className="text-sm text-gray-400">See your connections.</span>
        </div>
      </div>
    </div>
  );
}
