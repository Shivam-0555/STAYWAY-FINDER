import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useSession } from 'next-auth/react';

export default function OwnerDashboard() {
  const { data: session } = useSession();
  const { data: hostels, error, isLoading } = useSWR('/api/v1/hostels', fetcher);
  const ownerHostels = hostels?.filter((h: { owner?: string | null }) => h.owner === session?.user?.id) || [];

  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <div className="p-6 bg-slate-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Hostels</h2>
            {isLoading && <p>Loading hostels...</p>}
            {error && <p className="text-red-400">Failed to load hostels.</p>}
            {!isLoading && !error && ownerHostels.length === 0 && (
              <p className="text-gray-400">You haven't listed any hostels yet.</p>
            )}
            {!isLoading && !error && ownerHostels.length > 0 && (
              <ul className="space-y-4">
                {ownerHostels.map((hostel: any) => (
                  <li key={hostel._id} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-bold">{hostel.name}</p>
                      <p className="text-sm text-gray-300">Status: <span className={hostel.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}>{hostel.status}</span></p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm">Edit</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Add New Hostel</h2>
            <p className="text-gray-300 mb-4">List a new property on StayWay Finder.</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors">
              Create Listing
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
