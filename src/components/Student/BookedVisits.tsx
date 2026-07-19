import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

const BookedVisits: React.FC = () => {
  const { data: bookings, error, isLoading } = useSWR('/api/v1/bookings', fetcher);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Booked Visits</h2>
      
      {isLoading && <p className="text-gray-300">Loading bookings...</p>}
      {error && <p className="text-red-400">Failed to load bookings.</p>}
      
      {!isLoading && !error && bookings?.length === 0 && (
        <p className="text-gray-300">Your upcoming visits will be displayed here.</p>
      )}

      {!isLoading && !error && bookings?.length > 0 && (
        <ul className="space-y-3">
          {bookings.map((booking: any) => (
            <li key={booking._id} className="p-3 bg-gray-700 rounded-md">
              <p className="font-medium text-white">{booking.hostel?.name || 'Unknown Hostel'}</p>
              <p className="text-sm text-gray-300">
                Date: {new Date(booking.visitDate).toLocaleDateString()}
              </p>
              <p className="text-sm">
                Status: <span className={
                  booking.status === 'accepted' ? 'text-green-400' :
                  booking.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                }>{booking.status}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookedVisits;
