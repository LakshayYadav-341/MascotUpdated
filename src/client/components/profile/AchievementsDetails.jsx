import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using Next.js
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
    <div className="profile-card card">
      {/* Section Title */}
      <div className="about-title section-title">
        <div style={{ fontSize: "22px", fontWeight: "bold" }}>Achievements</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2rem",
          }}
        >
          {!others && (
            <div>
              {/* Add Achievement Button */}
              <Link onClick={onAddAchievement} data-bs-toggle="modal">
                <span className="material-symbols-rounded about-edit">add</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Achievements Container */}
      <div className="skill-container">
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => (
            <div key={index} className="skill-main">
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                {achievement?.info}{" "}
                {achievement?.documents?.length > 0 && (
                  <LaunchIcon
                    component="a"
                    href={serverPath + achievement.documents[0]}
                  />
                )}
              </div>
              {achievement?.description && <p>{achievement?.description}</p>}
            </div>
          ))
        ) : (
          // No Achievements Message
          <p>No Achievements added</p>
        )}
      </div>
    </div>
  );
};

export default AchievementsDetails;
