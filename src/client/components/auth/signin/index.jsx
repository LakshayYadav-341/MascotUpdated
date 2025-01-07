import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import {
  checkUserAsync,
  selectError,
  selectLoggedInUser,
  selectLoginStatus,
} from '../authSlice';
import Loading from '../../loading';

export default function SignIn() {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const user = useSelector(selectLoggedInUser);
  const status = useSelector(selectLoginStatus);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    dispatch(checkUserAsync({ email, password }));
  };

  return (
    <>
      {status === 'loading' && <Loading />}
      {!error && user && <Navigate to="/home" replace={true} />}
      {status === 'idle' && !user && (
        <div className="h-full flex items-center justify-center bg-gray-900">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
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
              <h1 className="text-gray-300 text-2xl font-semibold mt-4">Sign In</h1>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="text-gray-400 text-sm">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                />
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
                  className="mt-1 block w-full rounded-md bg-gray-700 border border-gray-600 text-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-gray-300 rounded-md font-semibold"
              >
                Sign In
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link
                to="/signup"
                className="text-sm text-gray-400 hover:text-blue-400"
              >
                Don't have an account? Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
