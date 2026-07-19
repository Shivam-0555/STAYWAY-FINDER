import React from 'react';

const RecentSearches: React.FC = () => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Recent Searches</h2>
      <ul className="space-y-3">
        {/* Placeholder for local storage searches if any */}
        <li className="p-3 bg-gray-700 rounded-md text-gray-300">
          No recent searches found.
        </li>
      </ul>
    </div>
  );
};

export default RecentSearches;
