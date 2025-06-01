import { useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
  subscription_status: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasActiveSubscription: boolean;
  token: string | null;
}

export function useSpotifyAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    hasActiveSubscription: false,
    token: null
  });

  // Check subscription status with the Spotify-style backend
  const checkAccess = async (token: string) => {
    try {
      // For testing with the demo account, allow access
      if (token.includes('test@tristies.com')) {
        return {
          hasAccess: true,
          subscriptionStatus: 'active'
        };
      }

      const response = await fetch('http://localhost:5001/api/check-access', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        return {
          hasAccess: result.access === 'granted',
          subscriptionStatus: result.subscription_status
        };
      } else {
        throw new Error(result.error || 'Access check failed');
      }
    } catch (error) {
      console.error('Access check error:', error);
      // For testing purposes, allow access if it's the test account
      if (token.includes('test@tristies.com')) {
        return {
          hasAccess: true,
          subscriptionStatus: 'active'
        };
      }
      return {
        hasAccess: false,
        subscriptionStatus: 'inactive'
      };
    }
  };

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('fanAppToken');
      
      if (!token) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          hasActiveSubscription: false
        }));
        return;
      }

      try {
        // Decode token to get user info (basic JWT decode)
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        
        // For test account, always grant access
        if (tokenPayload.email === 'test@tristies.com') {
          setAuthState({
            user: {
              id: tokenPayload.user_id,
              email: tokenPayload.email,
              subscription_status: 'active'
            },
            isLoading: false,
            isAuthenticated: true,
            hasActiveSubscription: true,
            token: token
          });
          return;
        }

        // For other accounts, verify with backend
        const accessResult = await checkAccess(token);
        
        setAuthState({
          user: {
            id: tokenPayload.user_id,
            email: tokenPayload.email,
            subscription_status: accessResult.subscriptionStatus
          },
          isLoading: false,
          isAuthenticated: true,
          hasActiveSubscription: accessResult.hasAccess,
          token: token
        });

      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid token
        localStorage.removeItem('fanAppToken');
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          hasActiveSubscription: false
        }));
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (token: string) => {
    try {
      localStorage.setItem('fanAppToken', token);
      
      const accessResult = await checkAccess(token);
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      
      setAuthState({
        user: {
          id: tokenPayload.user_id,
          email: tokenPayload.email,
          subscription_status: accessResult.subscriptionStatus
        },
        isLoading: false,
        isAuthenticated: true,
        hasActiveSubscription: accessResult.hasAccess,
        token: token
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('fanAppToken');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      hasActiveSubscription: false,
      token: null
    });
  };

  // Refresh subscription status
  const refreshSubscriptionStatus = async () => {
    if (!authState.token) return false;

    try {
      const accessResult = await checkAccess(authState.token);
      setAuthState(prev => ({
        ...prev,
        hasActiveSubscription: accessResult.hasAccess,
        user: prev.user ? {
          ...prev.user,
          subscription_status: accessResult.subscriptionStatus
        } : null
      }));
      
      return accessResult.hasAccess;
    } catch (error) {
      console.error('Subscription refresh error:', error);
      return false;
    }
  };

  return {
    ...authState,
    login,
    logout,
    refreshSubscriptionStatus,
    checkAccess: () => authState.token ? checkAccess(authState.token) : Promise.resolve({ hasAccess: false, subscriptionStatus: 'inactive' })
  };
}