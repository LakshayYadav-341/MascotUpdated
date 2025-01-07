import React from "react";
import { Link } from "react-router-dom";
import connectedWorldImg from "../../assets/images/connected-world.png";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 px-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={connectedWorldImg}
            alt="Connected World"
            className="h-16 w-16 object-contain"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm md:text-base font-medium">
          <Link
            to="/about"
            className="hover:text-blue-400 transition duration-300"
          >
            About
          </Link>
          <Link
            to="/accessibility"
            className="hover:text-blue-400 transition duration-300"
          >
            Accessibility
          </Link>
          <Link
            to="/privacy"
            className="hover:text-blue-400 transition duration-300"
          >
            Privacy
          </Link>
          <Link
            to="/faq"
            className="hover:text-blue-400 transition duration-300"
          >
            FAQs
          </Link>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-6 text-center text-sm font-light">
        Mascot &copy; 2024. All Rights Reserved.
      </div>
    </footer>
  );
}
