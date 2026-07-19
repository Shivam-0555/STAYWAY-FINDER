import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

const SavedHostels: React.FC = () => {
  const { data: savedPlaces, error, isLoading } = useSWR('/api/v1/saved-places', fetcher);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Saved Hostels</h2>
      
      {isLoading && <p className="text-gray-300">Loading saved hostels...</p>}
      {error && <p className="text-red-400">Failed to load saved hostels.</p>}
      
      {!isLoading && !error && savedPlaces?.length === 0 && (
        <p className="text-gray-300">Your saved hostels will appear here.</p>
      )}

      {!isLoading && !error && savedPlaces?.length > 0 && (
        <ul className="space-y-3">
          {savedPlaces.map((place: any) => (
            <li key={place._id} className="p-3 bg-gray-700 rounded-md">
              <p className="font-medium text-white">{place.hostel?.name || 'Unknown Hostel'}</p>
              <p className="text-sm text-gray-300 truncate">{place.hostel?.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedHostels;
