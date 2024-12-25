import React from 'react';
import { Link } from 'react-router-dom';
import connectedWorldImg from "../../assets/images/connected-world.png"

export default function Footer() {
  return (
    <>
      <div className="card">
        <div className="footer">
          <div className="cardImg">
            <img src={connectedWorldImg} alt="" />
          </div>
          <div className="footerContainer">
            <Link to="/about">About</Link>
            <Link to="/accessibility">Accessibility</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/faq">FAQs</Link>
          </div>
        </div>
        <p className="footerBottom">Mascot &copy; 2024. All Rights Reserved.</p>
      </div>
    </>
  );
}
