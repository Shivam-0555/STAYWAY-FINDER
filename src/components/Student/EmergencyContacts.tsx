import React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

const EmergencyContacts: React.FC = () => {
  const { data: contacts, error, isLoading } = useSWR('/api/v1/emergency-contacts', fetcher);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Emergency Contacts</h2>
      
      {isLoading && <p className="text-gray-300">Loading contacts...</p>}
      {error && <p className="text-red-400">Failed to load emergency contacts.</p>}
      
      {!isLoading && !error && (!contacts || contacts.length === 0) && (
        <p className="text-gray-300">No emergency contacts available.</p>
      )}

      {!isLoading && !error && contacts?.length > 0 && (
        <ul className="space-y-3">
          {contacts.map((contact: any) => (
            <li key={contact._id} className="p-3 bg-gray-700 rounded-md">
              <p className="font-medium text-white">{contact.name} ({contact.type})</p>
              <p className="text-sm text-gray-300">Phone: {contact.phone}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmergencyContacts;
