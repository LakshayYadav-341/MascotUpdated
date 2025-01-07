import React from 'react';

export default function CompleteProfile({ onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl"
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-8">Address Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Name"
              id="name"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="buildingName"
              placeholder="Building Name"
              id="buildingName"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="line1"
            placeholder="Address Line 1"
            id="line1"
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400 outline-none transition-all"
          />
          <input
            type="text"
            name="line2"
            placeholder="Address Line 2"
            id="line2"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400 outline-none transition-all"
          />
          <input
            type="text"
            name="street"
            placeholder="Street name"
            id="street"
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              name="city"
              placeholder="City"
              id="city"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="state"
              placeholder="State"
              id="state"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              name="country"
              placeholder="Country"
              id="country"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <input
              type="number"
              name="pinCode"
              placeholder="Pin Code"
              id="pinCode"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button type="button" className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}
