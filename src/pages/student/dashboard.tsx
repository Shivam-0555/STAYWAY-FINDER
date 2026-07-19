import { ProtectedRoute } from '@/components/ProtectedRoute';
import ProfileCard from '@/components/Student/ProfileCard';
import SavedHostels from '@/components/Student/SavedHostels';
import BookedVisits from '@/components/Student/BookedVisits';
import FavouritePlaces from '@/components/Student/FavouritePlaces';
import RecentSearches from '@/components/Student/RecentSearches';
import EmergencyContacts from '@/components/Student/EmergencyContacts';
import NotificationsList from '@/components/Student/NotificationsList';

export default function StudentDashboard() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="p-6 space-y-8 bg-slate-900 min-h-screen text-white">
        <ProfileCard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SavedHostels />
          <BookedVisits />
          <FavouritePlaces />
          <RecentSearches />
          <EmergencyContacts />
          <NotificationsList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
