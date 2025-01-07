import React from "react";
import { Link } from "react-router-dom";

const EducationDetails = ({ isAdmin, hasProfile, education = [], others, onAddEducation }) => {
  if (isAdmin || !hasProfile) {
    return null;
  }
  const formatDate = (date) => {
    if (!date) return "Unknown"; // Handle undefined/null dates gracefully
    const options = { year: "numeric", month: "long" }; // Customize the format
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Education</h2>

        {!others && (
          <div>
            <Link
              onClick={onAddEducation}
              className="text-blue-500 hover:text-blue-400 cursor-pointer flex items-center"
            >
              <span className="material-symbols-rounded text-2xl">add</span>
            </Link>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {education.length > 0 ? (
          education.map((ed, id) => (
            <div
              key={id}
              className="pb-4 border-b border-gray-700 last:border-0"
            >
              <h3 className="text-lg font-bold text-gray-100 mb-2">
                {ed?.institute?.name}
              </h3>
              <div className="text-sm text-gray-300 flex items-center gap-2">
                <span>Joined in {formatDate(ed?.joined)}</span>
                <span className="text-gray-500">•</span>
                <span>Education Type: {ed?.type}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-base text-gray-400">
            No Education Detail added
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationDetails;