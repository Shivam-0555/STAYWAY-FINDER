import React from 'react';
import { useSession } from 'next-auth/react';

const ProfileCard: React.FC = () => {
  const { data: session } = useSession();
  const name = session?.user?.name ?? 'Student';
  const email = session?.user?.email ?? 'example@example.com';

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 shadow-lg flex items-center space-x-4">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600">
        {name.charAt(0).toUpperCase()}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">{name}</h2>
        <p className="text-sm opacity-80 text-white">{email}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
