import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import urls, { basePath } from "../../../../utils/urls";
import Details from "../../details";

export default function SignUp() {
  const [credential, setCredential] = useState({});
  const [credentialAdded, setCredentialAdded] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [selectedValue, setSelectedValue] = useState("student");

  const handleEmailBlur = () => {
    setIsEmailValid(email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEmailValid || email === "") {
      return toast.error("Please enter a valid email address!");
    }

    const data = new FormData(event.currentTarget);
    const password = data.get("password");

    try {
      const res = await axios.get(
        basePath + urls.auth.getUserByEmail.replace(":email", email)
      );

      if (res && res.status === 200) {
        return toast.error("This email has already been taken!");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setCredential({ email, password, role: selectedValue });
        setCredentialAdded(true);
        return toast.success("Credentials added successfully!");
      } else {
        return toast.error("An unexpected error occurred. Please try again!");
      }
    }
  };

  return (
    <>
      {credentialAdded && <Details credential={credential} />}
      {!credentialAdded && (
        <div className="h-full flex items-center justify-center bg-gray-900">
          <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-md">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3 1.344 3 3 3zm0 0c-2.667 0-8 1.333-8 4v2h16v-2c0-2.667-5.333-4-8-4z"
                  />
                </svg>
              </div>
              <h1 className="text-gray-300 text-2xl font-semibold mt-4">Sign Up</h1>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="text-gray-400 text-sm">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  required
                  className={`mt-1 block w-full rounded-md bg-gray-700 border ${
                    !isEmailValid
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-600 focus:border-blue-500"
                  } text-gray-300 px-3 py-2 focus:ring-blue-500`}
                />
                {!isEmailValid && (
                  <p className="text-red-500 text-sm mt-1">Invalid email address</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="text-gray-400 text-sm">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-gray-400 text-sm font-medium mb-2">
                  Select Your Role
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="student"
                      checked={selectedValue === "student"}
                      onChange={handleChange}
                      className="form-radio text-blue-500"
                    />
                    <span className="text-gray-400">Student</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="alumni"
                      checked={selectedValue === "alumni"}
                      onChange={handleChange}
                      className="form-radio text-blue-500"
                    />
                    <span className="text-gray-400">Alumni</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="institute"
                      checked={selectedValue === "institute"}
                      onChange={handleChange}
                      className="form-radio text-blue-500"
                    />
                    <span className="text-gray-400">Institute Admin</span>
                  </label>
                  {/* <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="admin"
                      checked={selectedValue === "admin"}
                      onChange={handleChange}
                      className="form-radio text-blue-500"
                    />
                    <span className="text-gray-400">Admin</span>
                  </label> */}
                </div>
              </div>
              <button
                type="submit"
                disabled={!isEmailValid}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-gray-300 rounded-md font-semibold disabled:opacity-50"
              >
                Sign Up
              </button>
              <div className="text-center mt-4">
                <Link
                  to="/signin"
                  className="text-sm text-gray-400 hover:text-blue-400"
                >
                  Already have an account? Login here
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
