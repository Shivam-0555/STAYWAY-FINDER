import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function AdminDashboard() {
  // Fetch all hostels (including pending)
  const { data: hostels, error, isLoading } = useSWR('/api/v1/hostels', fetcher);
  
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="p-6 bg-slate-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Manage Hostels</h2>
            <p className="text-gray-400 mb-4">Review pending listings and manage approved properties.</p>
            
            {isLoading && <p>Loading hostels...</p>}
            {error && <p className="text-red-400">Failed to load hostels.</p>}
            {!isLoading && !error && (!hostels || hostels.length === 0) && (
              <p className="text-gray-400">No hostels found.</p>
            )}
            
            {!isLoading && !error && hostels?.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Owner ID</th>
                      <th className="py-3 px-4 text-left">City</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hostels.map((hostel: any) => (
                      <tr key={hostel._id} className="border-b border-gray-600">
                        <td className="py-3 px-4">{hostel.name}</td>
                        <td className="py-3 px-4 text-sm font-mono text-gray-400">{hostel.owner}</td>
                        <td className="py-3 px-4">{hostel.city?.name || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            hostel.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            hostel.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {hostel.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {hostel.status === 'pending' && (
                            <div className="flex gap-2">
                              <button className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs">Approve</button>
                              <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Reject</button>
                            </div>
                          )}
                          {hostel.status !== 'pending' && (
                            <button className="bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs">Review</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
