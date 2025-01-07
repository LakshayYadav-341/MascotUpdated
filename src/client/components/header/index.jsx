import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectLoggedInUser, selectSession } from "../auth/authSlice";
import { getAllUsers, getAllJobs } from "../auth/user/userSlice";
import { SearchList } from "./SearchList";
import axios from "axios";
import urls, { basePath } from "../../../utils/urls";
import logo from "@client/assets/images/banner.png";
import {
  Search,
  Home,
  Mail,
  Users,
  Briefcase,
  User,
  Shield,
  Menu as MenuIcon
} from "lucide-react";

export default function PrimarySearchAppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const searchInputRef = useRef(null);

  const [allUsers, setAllUsers] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [input, setInput] = useState("");
  const [blur, setBlur] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useSelector(selectLoggedInUser);
  const session = useSelector(selectSession);

  const userNavigation = [
    { name: "My Profile", link: `/profile/${user}` },
    { name: "Sign out", link: "/logout" },
  ];

  useEffect(() => {
    const handleClick = (e) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setBlur(true);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, jobsRes] = await Promise.all([
          axios.get(basePath + urls.user.fetchAll, {
            headers: {
              "Content-Type": "application/JSON",
              authorization: `Bearer ${session.token}`,
            },
          }),
          axios.get(basePath + urls.job.findAll, {
            headers: {
              "Content-Type": "application/JSON",
              authorization: `Bearer ${session.token}`,
            },
          }),
        ]);

        dispatch(getAllUsers(usersRes.data.data));
        dispatch(getAllJobs(jobsRes.data));
        setAllUsers(usersRes.data.data);
        setAllJobs(jobsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch, session.token]);

  const handleChange = (value) => {
    setInput(value);
    const filtered = location.pathname === "/jobs"
      ? allJobs.filter(job => job?.title?.toLowerCase().includes(value.toLowerCase()))
      : allUsers.filter(user => {
        const name = `${user?.name?.first} ${user?.name?.last}`;
        return name.toLowerCase().includes(value.toLowerCase());
      });
    setSearchResults(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && location.pathname.includes("/jobs")) {
      navigate(`/jobs-filter-results/${input}`);
      setBlur(true);
    }
  };

  return (
    <>
      {!blur && input && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 h-[10vh]" />
      )}

      <nav className="fixed top-0 left-0 right-0 bg-gray-900 shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" className="flex-shrink-0">
              <img src={logo} alt="Logo" className="h-8" />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4 relative" ref={searchInputRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full bg-gray-800 text-gray-300 rounded-lg pl-10 pr-4 py-2 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={location.pathname === "/chat" ? "Search people to chat" : "Search…"}
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setBlur(false)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {!blur && !location.pathname.includes("/jobs") && (
                <SearchList
                  results={searchResults}
                  setSearchResults={setSearchResults}
                  setInput={setInput}
                  setBlur={setBlur}
                />
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/home" className="text-gray-300 hover:text-gray-300">
                <Home className="h-6 w-6" />
              </Link>

              {user.admin && (
                <Link to="/dashboard/admin" className="text-gray-300 hover:text-gray-300">
                  <Shield className="h-6 w-6" />
                </Link>
              )}

              <Link to="/network" className="text-gray-300 hover:text-gray-300">
                <Users className="h-6 w-6" />
              </Link>

              {!user.admin && (
                <Link to="/jobs" className="text-gray-300 hover:text-gray-300">
                  <Briefcase className="h-6 w-6" />
                </Link>
              )}

              <Link to="/chat" className="text-gray-300 hover:text-gray-300">
                <Mail className="h-6 w-6" />
              </Link>

              <button
                className="text-gray-300 hover:text-gray-300 relative"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <User className="h-6 w-6" />

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.link}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-gray-300"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/home"
                className="flex items-center px-3 py-2 text-gray-300 hover:text-gray-300"
              >
                <Home className="h-6 w-6 mr-3" />
                Home
              </Link>

              {user.admin && (
                <Link
                  to="/dashboard/admin"
                  className="flex items-center px-3 py-2 text-gray-300 hover:text-gray-300"
                >
                  <Shield className="h-6 w-6 mr-3" />
                  Admin Dashboard
                </Link>
              )}

              <Link
                to="/network"
                className="flex items-center px-3 py-2 text-gray-300 hover:text-gray-300"
              >
                <Users className="h-6 w-6 mr-3" />
                My Network
              </Link>

              {!user.admin && (
                <Link
                  to="/jobs"
                  className="flex items-center px-3 py-2 text-gray-300 hover:text-gray-300"
                >
                  <Briefcase className="h-6 w-6 mr-3" />
                  Jobs
                </Link>
              )}

              <Link
                to="/chat"
                className="flex items-center px-3 py-2 text-gray-300 hover:text-gray-300"
              >
                <Mail className="h-6 w-6 mr-3" />
                Messages
              </Link>

              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.link}
                  className="flex items-center px-3 py-2 text-gray-300 hover:text-gray-300"
                >
                  <User className="h-6 w-6 mr-3" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}