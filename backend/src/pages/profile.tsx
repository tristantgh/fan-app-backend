import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '@/components/user/UserProfile';
import { Helmet } from 'react-helmet';

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  
  // Check if user is logged in
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/login');
    }
  }, [user, isLoading, setLocation]);
  
  // Don't render profile if still checking authentication or if user is not logged in
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-[#814923] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If error or not authenticated, don't render profile
  if (isError || !user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>My Profile - Tristan Fan Hub</title>
        <meta name="description" content="Manage your Tristan Fan Hub profile settings, preferences, and personal information." />
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
        <UserProfile />
      </div>
    </>
  );
}