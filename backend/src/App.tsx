import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import AppLogin from "@/pages/app-login";

// Pages
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import Announcements from "@/pages/announcements";
import Merch from "@/pages/merch";
import BehindScenes from "@/pages/behind-scenes";
import Shows from "@/pages/shows";
import Unreleased from "@/pages/unreleased";

import Leaderboard from "@/pages/leaderboard";
import Support from "@/pages/support";
import Perks from "@/pages/perks";
import Resources from "@/pages/resources";
import Story from "@/pages/story";
import NotFound from "@/pages/not-found";

// Auth & User Pages
import Login from "@/pages/login";
import Register from "@/pages/register"; 
import Profile from "@/pages/profile";
import Welcome from "@/pages/welcome";
import Signup from "@/pages/signup";

function Router() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, hasActiveSubscription, login } = useSpotifyAuth();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-warm-brown border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Show signup page if on signup route (before auth check)
  if (location === '/signup') {
    return <Signup />;
  }

  // Show login page if not authenticated or no active subscription
  if (!isAuthenticated || !hasActiveSubscription) {
    return <AppLogin onLoginSuccess={login} />;
  }

  return (
    <>
      <Helmet>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#814923" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Tristies" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </Helmet>
      
      <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Header */}
      <header className="md:hidden bg-card py-4 px-5 flex justify-between items-center sticky top-0 z-10 border-b">
        <div className="flex items-center">
          <span className="font-display text-xl font-bold text-primary">TRISTAN</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-muted-foreground"
        >
          <i className="ri-menu-line text-2xl"></i>
        </button>
      </header>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background bg-opacity-95 z-20 md:hidden">
          <div className="flex justify-end p-5">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-foreground"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
          <Sidebar mobile onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-card shadow-sm border-r">
        <Sidebar />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/chat" component={Chat} />
          <Route path="/announcements" component={Announcements} />
          <Route path="/merch" component={Merch} /> 
          <Route path="/behind-scenes" component={BehindScenes} />
          <Route path="/shows" component={Shows} />
          <Route path="/unreleased" component={Unreleased} />

          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/support" component={Support} />
          <Route path="/perks" component={Perks} />
          <Route path="/resources" component={Resources} />
          <Route path="/story" component={Story} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
        
        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </main>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
