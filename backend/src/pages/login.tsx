import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const [, setLocation] = useLocation();
  
  // Check if user is already logged in
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      setLocation('/');
    }
  }, [user, isLoading, setLocation]);
  
  return (
    <>
      <Helmet>
        <title>Log In - Tristan Fan Hub</title>
        <meta name="description" content="Log in to your Tristan Fan Hub account to access exclusive content, connect with other fans, and more." />
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome Back</h1>
              <p className="text-gray-600 mb-6">
                Log in to access your Tristan Fan Hub account and all the exclusive content, community features, and perks that come with it.
              </p>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl font-medium mb-3">Community Benefits</h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <i className="ri-check-line text-[#814923] mr-2"></i>
                    <span>Access to exclusive behind-the-scenes content</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line text-[#814923] mr-2"></i>
                    <span>Connect with other fans through the community chat</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line text-[#814923] mr-2"></i>
                    <span>Early access to merchandise and show tickets</span>
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line text-[#814923] mr-2"></i>
                    <span>Exclusive discount codes and special offers</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}