import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.png'
import discussionImg from "../../assets/images/Discussion-amico.png"
import metricsImg from "../../assets/images/Metrics-amico.png"
import HelpingPartnerImg from "../../assets/images/Helping a partner-pana.png"
import WorkingImg from "../../assets/images/Working-amico.png"
import ProfileDataImg from "../../assets/images/Profile data-amico.png"

const Landing = () => {
  return (
    <div className="mt-[-5rem] min-h-screen bg-gray-900 text-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="#" className="flex items-center">
                <img src={logo} alt="mascot" className="h-8 w-auto" />
              </Link>
              <form className="hidden md:flex items-center">
                <input
                  type="search"
                  placeholder="#Explore"
                  className="px-4 py-2 bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </form>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/signin">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/signup" className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                <i className="fa-regular fa-compass"></i>
                <span>SignUp</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-20">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-800 rounded-xl p-8">
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-4xl font-bold">Welcome to your professional community</h1>
            <p className="text-gray-300">
              Mascot is a social media platform designed for professional networking, job searching, and career development. Its main purpose is to connect professionals from all industries and provide a platform for them to showcase their skills, experiences, and accomplishments.
            </p>
            <p className="text-gray-300">
              Mascot serves as a valuable tool for professionals to build their personal brand, expand their network, and find new career opportunities.
            </p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img src={discussionImg} alt="Discussion" className="w-full max-w-md mx-auto" />
          </div>
        </div>

        {/* Job Search Section */}
        <div className="bg-gray-800 rounded-xl p-8 space-y-6">
          <h2 className="text-3xl font-bold">Find the right job or internship for you</h2>
          <div>
            <h3 className="text-xl mb-4">Suggested Searches</h3>
            <div className="flex flex-wrap gap-3">
              {["Engineering", "Full stack developer", "Backend developer", "Frontend developer", 
                "Android developer", "Software Engineer", "Finance", "Business Development", 
                "Operations", "Human Resources"].map((item) => (
                <button key={item} className="px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation Section */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-800 rounded-xl p-8">
          <div className="md:w-2/3 space-y-4">
            <h2 className="text-3xl font-bold">Conversations today could lead to opportunity tomorrow</h2>
            <p className="text-gray-300">
              Sending messages to people you know is a great way to strengthen relationships as you take the next step in your career.
            </p>
          </div>
          <div className="md:w-1/3 mt-8 md:mt-0">
            <img src={metricsImg} alt="Metrics" className="w-full max-w-sm mx-auto" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-xl p-8 text-center space-y-4">
            <div className="w-full max-w-xs mx-auto">
              <img src={HelpingPartnerImg} alt="Help" className="w-full" />
            </div>
            <h3 className="text-2xl font-bold">Connect with people who can help</h3>
            <button className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Find People you know
            </button>
          </div>
          <div className="bg-gray-800 rounded-xl p-8 text-center space-y-4">
            <div className="w-full max-w-xs mx-auto">
              <img src={WorkingImg} alt="Learning" className="w-full" />
            </div>
            <h3 className="text-2xl font-bold">Learn the skills you need to succeed</h3>
            <button className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Learn
            </button>
          </div>
        </div>

        {/* Who is it for Section */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gray-800 rounded-xl p-8">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold">Who is Mascot for?</h2>
            <h3 className="text-2xl">Any student who wants to navigate to their professional life</h3>
            <div className="space-y-4">
              {["Find a coworker, colleague or classmate", "Find an internship", "Find a job & referrals"].map((item) => (
                <div key={item} className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img src={ProfileDataImg} alt="Profile" className="w-full max-w-md mx-auto" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-4 text-center">
        <p className="text-gray-400">Mascot &copy; 2023. All rights reserved</p>
      </footer>
    </div>
  );
};

export default Landing;