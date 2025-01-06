import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using Next.js

const EducationDetails = ({ isAdmin, hasProfile, education = [], others, onAddEducation }) => {
  if (isAdmin || !hasProfile) {
    return null;
  }

  return (
    <div className="profile-card card">
      <div className="about-title section-title">
        <div style={{ fontSize: "22px", fontWeight: "bold" }}>Education</div>
        <div
          className="button-container"
          style={{ display: "flex", flexDirection: "row", gap: "2rem" }}
        >
          {!others && (
            <div>
              <Link data-bs-toggle="modal" onClick={onAddEducation}>
                <span className="material-symbols-rounded about-edit">add</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="education-container">
        <div className="education-main" style={{ flexDirection: "column" }}>
          {education.length > 0 ? (
            education.map((ed, id) => (
              <div
                style={{ fontSize: "12px", borderBottom: "1px solid white" }}
                key={id}
              >
                <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {ed?.institute?.name}
                </div>
                <div>
                  Joined in {formatDate(ed?.joined)}{" "}
                  <span style={{ fontSize: "15px" }}>•</span> Education Type:{" "}
                  {ed?.type}
                </div>
                <div style={{ paddingTop: "7px" }}></div>
              </div>
            ))
          ) : (
            <h1 style={{ fontSize: "1rem" }}>No Education Detail added</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationDetails;
