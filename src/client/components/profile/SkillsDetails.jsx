import React from "react";
import { Link } from "react-router-dom";

const SkillsDetails = ({ isAdmin, hasProfile, skills = [], others, onAddSkill }) => {
  if (!isAdmin || !hasProfile) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-gray-300">
      {/* Section Title */}
      <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
        {/* Title Text */}
        <h2 className="text-lg font-bold">Skills</h2>

        {/* Button Container */}
        {!others && (
          <div>
            {/* Add Skill Button */}
            <Link
              onClick={onAddSkill}
              className="text-blue-500 hover:text-blue-400 cursor-pointer flex items-center"
            >
              <span className="material-symbols-rounded text-2xl">add</span>
            </Link>
          </div>
        )}
      </div>

      {/* Skills Container */}
      <div>
        {skills.length > 0 ? (
          <ul className="space-y-2">
            {skills.map((skill, index) => (
              <li
                key={index}
                className="bg-gray-700 p-3 rounded-md text-sm font-semibold"
              >
                {skill?.name}
              </li>
            ))}
          </ul>
        ) : (
          // No Skills Message
          <p className="text-gray-400">No Skills added</p>
        )}
      </div>
    </div>
  );
};

export default SkillsDetails;
