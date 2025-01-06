import React from "react";
import { Link } from "react-router-dom"; // Assuming Next.js is used

const SkillsDetails = ({ isAdmin, hasProfile, skills = [], others, onAddSkill }) => {
  if (!isAdmin || !hasProfile) {
    return null;
  }

  return (
    <div className="profile-card card">
      {/* Section Title */}
      <div className="about-title section-title">
        {/* Title Text */}
        <div className="title-text" style={{ fontSize: "22px", fontWeight: "bold" }}>Skills</div>

        {/* Button Container */}
        <div className="button-container" style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
          {!others && (
            <div>
              {/* Add Skill Button */}
              <Link data-bs-toggle="modal" onClick={onAddSkill}>
                <span className="material-symbols-rounded about-edit">add</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Skills Container */}
      <div className="skill-container">
        {/* Render Skills */}
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <div key={index} className="skill-main">
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>{skill?.name}</div>
            </div>
          ))
        ) : (
          // No Skills Message
          <p>No Skills added</p>
        )}
      </div>
    </div>
  );
};

export default SkillsDetails;
