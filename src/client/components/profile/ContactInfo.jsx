import React from 'react';

export default function ContactInfo({ tempUser }) {
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-300 mb-4">Contact Information</h2>
      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center">
          <span className="w-24 font-semibold text-gray-300">Email:</span>
          <span className="text-gray-300">{tempUser?.data?.email || 'N/A'}</span>
        </div>
        {/* Phone */}
        <div className="flex items-center">
          <span className="w-24 font-semibold text-gray-300">Phone:</span>
          <span className="text-gray-300">{tempUser?.data?.phone || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
