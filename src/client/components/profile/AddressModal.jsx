import React from 'react';

export default function AddressModal({ tempUser }) {
  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-300 mb-4">Address Information</h2>
      <div className="divide-y divide-gray-700">
        {/* Name */}
        <div className="py-2 flex items-center">
          <span className="w-32 font-semibold text-gray-300">Name:</span>
          <span className="text-gray-300">{tempUser?.data?.profile?.address?.name || 'N/A'}</span>
        </div>
        {/* Building Name */}
        {tempUser?.data?.profile?.address?.buildingName && (
          <div className="py-2 flex items-center">
            <span className="w-32 font-semibold text-gray-300">Building Name:</span>
            <span className="text-gray-300">{tempUser?.data?.profile?.address?.buildingName}</span>
          </div>
        )}
        {/* Street */}
        <div className="py-2 flex items-center">
          <span className="w-32 font-semibold text-gray-300">Street:</span>
          <span className="text-gray-300">{tempUser?.data?.profile?.address?.street || 'N/A'}</span>
        </div>
        {/* Address Line 1 */}
        <div className="py-2 flex items-center">
          <span className="w-32 font-semibold text-gray-300">Address Line 1:</span>
          <span className="text-gray-300">{tempUser?.data?.profile?.address?.line1 || 'N/A'}</span>
        </div>
        {/* Address Line 2 */}
        {tempUser?.data?.profile?.address?.line2 && (
          <div className="py-2 flex items-center">
            <span className="w-32 font-semibold text-gray-300">Address Line 2:</span>
            <span className="text-gray-300">{tempUser?.data?.profile?.address?.line2}</span>
          </div>
        )}
        {/* City */}
        <div className="py-2 flex items-center">
          <span className="w-32 font-semibold text-gray-300">City:</span>
          <span className="text-gray-300">{tempUser?.data?.profile?.address?.city || 'N/A'}</span>
        </div>
        {/* Pincode */}
        <div className="py-2 flex items-center">
          <span className="w-32 font-semibold text-gray-300">Pincode:</span>
          <span className="text-gray-300">{tempUser?.data?.profile?.address?.pinCode || 'N/A'}</span>
        </div>
        {/* State */}
        <div className="py-2 flex items-center">
          <span className="w-32 font-semibold text-gray-300">State:</span>
          <span className="text-gray-300">{tempUser?.data?.profile?.address?.state || 'N/A'}</span>
        </div>
        {/* Country */}
        <div className="py-2 flex items-center">
          <span className="w-32 font-semibold text-gray-300">Country:</span>
          <span className="text-gray-300">{tempUser?.data?.profile?.address?.country || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
