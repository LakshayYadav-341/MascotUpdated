import React from "react";
import { Link } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch"; // Assuming Material-UI is used

const AchievementsDetails = ({
  isAdmin,
  hasProfile,
  achievements = [],
  others,
  onAddAchievement,
  serverPath,
}) => {
  if (!isAdmin || !hasProfile) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-gray-300">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Achievements</h2>
        {!others && (
          <Link
            onClick={onAddAchievement}
            className="text-blue-500 hover:text-blue-400 cursor-pointer flex items-center"
          >
            <span className="material-symbols-rounded text-2xl">add</span>
          </Link>
        )}
      </div>

      {/* Achievements Container */}
      <div className="space-y-4">
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => (
            <div
              key={index}
              className="p-4 bg-gray-700 rounded-lg shadow flex flex-col"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{achievement?.info}</h3>
                {achievement?.documents?.length > 0 && (
                  <a
                    href={`${serverPath}${achievement.documents[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500"
                  >
                    <LaunchIcon />
                  </a>
                )}
              </div>
              {achievement?.description && (
                <p className="text-gray-400 mt-2">{achievement?.description}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No Achievements added</p>
        )}
      </div>
    </div>
  );
};

export default AchievementsDetails;