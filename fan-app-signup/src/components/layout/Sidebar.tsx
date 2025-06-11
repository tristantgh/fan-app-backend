import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile, onClose }: SidebarProps) {
  const [location] = useLocation();
  
  // Fetch user data
  const { data: user, isLoading } = useQuery<{
    id: string;
    username: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
    membershipTier: string;
  }>({
    queryKey: ['/api/auth/user'],
    retry: false,
  });
  
  // Common navigation items
  const navItems = [
    { href: "/", label: "Home", icon: "ri-home-5-line" },
    { href: "/chat", label: "Fan Chat", icon: "ri-chat-3-line" },
    { href: "/announcements", label: "Announcements", icon: "ri-megaphone-line" },
    { href: "/merch", label: "Merch", icon: "ri-t-shirt-line" },
    { href: "/story", label: "The Story", icon: "ri-book-read-line" },
    { href: "/behind-scenes", label: "Behind The Scenes", icon: "ri-camera-line" },
    { href: "/shows", label: "Upcoming Shows", icon: "ri-calendar-event-line" },
    { href: "/unreleased", label: "Unreleased", icon: "ri-music-2-line" },

    { href: "/leaderboard", label: "Fan Leaderboard", icon: "ri-medal-line" },
    { href: "/support", label: "Support", icon: "ri-customer-service-2-line" },
    { href: "/perks", label: "Perks", icon: "ri-vip-crown-line" },
    { href: "/resources", label: "Fan Content", icon: "ri-folder-music-line" }
  ];
  
  // Call to action handler function
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Refresh the page to clear user state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <>
      {!mobile && (
        <div className="p-5 border-b">
          <span className="font-display text-2xl font-bold text-black">TRISTAN</span>
        </div>
      )}
      
      <nav className={mobile ? "px-8 py-4" : "flex-1 px-4 py-6"}>
        <ul className={mobile ? "space-y-6 text-lg" : "space-y-4"}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                onClick={onClose}
              >
                <a 
                  className={`
                    flex items-center space-x-3 
                    ${mobile ? "" : "p-2 rounded-lg hover:bg-warm-brown/10 transition"}
                    ${location === item.href 
                      ? mobile 
                        ? "text-warm-brown font-medium" 
                        : "bg-gray-200/70 text-warm-brown font-medium" 
                      : "text-black hover:text-warm-brown"
                    }
                  `}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {!mobile && (
        <div className="p-4 border-t">
          {!isLoading && user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-warm-brown text-white flex items-center justify-center overflow-hidden">
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.username || 'User'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="ri-user-line text-lg"></i>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-black">{user.username}</p>
                  <p className="text-xs text-black/70 capitalize">{user.membershipTier} Member</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Link href="/profile">
                  <a className="text-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-2 rounded-md transition">
                    <i className="ri-user-settings-line mr-1"></i>
                    <span>Profile</span>
                  </a>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-2 rounded-md transition"
                >
                  <i className="ri-logout-box-line mr-1"></i>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <i className="ri-user-line text-gray-400"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Guest User</p>
                  <p className="text-xs text-black/70">Not logged in</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login">
                  <a className="text-center text-xs bg-warm-brown hover:bg-warm-brown/90 text-white py-1.5 px-2 rounded-md transition">
                    <i className="ri-login-box-line mr-1"></i>
                    <span>Log In</span>
                  </a>
                </Link>
                <Link href="/register">
                  <a className="text-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1.5 px-2 rounded-md transition">
                    <i className="ri-user-add-line mr-1"></i>
                    <span>Sign Up</span>
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
