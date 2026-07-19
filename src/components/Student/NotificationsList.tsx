import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

const NotificationsList: React.FC = () => {
  const { data: notifications, error, isLoading } = useSWR('/api/v1/notifications', fetcher);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Notifications</h2>
      
      {isLoading && <p className="text-gray-300">Loading notifications...</p>}
      {error && <p className="text-red-400">Failed to load notifications.</p>}
      
      {!isLoading && !error && (!notifications || notifications.length === 0) && (
        <p className="text-gray-300">No new notifications.</p>
      )}

      {!isLoading && !error && notifications?.length > 0 && (
        <ul className="space-y-3">
          {notifications.map((notification: any) => (
            <li key={notification._id} className={`p-3 rounded-md ${notification.read ? 'bg-gray-700 opacity-75' : 'bg-indigo-900 border border-indigo-500'}`}>
              <p className="text-sm text-gray-200">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsList;
