import { Link, useLocation } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();
  
  const navItems = [
    { href: "/", label: "Home", icon: "ri-home-5-line" },
    { href: "/chat", label: "Chat", icon: "ri-chat-3-line" },
    { href: "/merch", label: "Merch", icon: "ri-t-shirt-line" },
    { href: "/unreleased", label: "Music", icon: "ri-music-2-line" },
    { href: "/leaderboard", label: "Ranks", icon: "ri-medal-line" }
  ];
  
  return (
    <div className="fixed bottom-0 inset-x-0 bg-card border-t py-2 px-6 flex justify-between md:hidden z-10 shadow-md">
      {navItems.map((item) => (
        <Link href={item.href} key={item.href}>
          <a className={`flex flex-col items-center ${location === item.href ? "text-primary" : "text-muted-foreground"}`}>
            <i className={`${item.icon} text-xl`}></i>
            <span className="text-xs mt-1">{item.label}</span>
          </a>
        </Link>
      ))}
    </div>
  );
}
