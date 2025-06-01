import { ScrollArea } from "@/components/ui/scroll-area";
import type { LeaderboardItem } from "@/lib/types";

interface LeaderboardCardProps {
  title: string;
  icon: string;
  iconColor: string;
  items: LeaderboardItem[];
  type: 'merch' | 'streams' | 'shows' | 'referrals';
}

export default function LeaderboardCard({ title, icon, iconColor, items, type }: LeaderboardCardProps) {
  // Helper function to get the formatted value based on the leaderboard type
  const getValueText = (item: LeaderboardItem) => {
    switch (type) {
      case 'merch':
        return `$${item.value} spent`;
      case 'streams':
        return `${item.value} hours streamed`;
      case 'shows':
        return `${item.value} shows attended`;
      case 'referrals':
        return `${item.value} fans referred`;
      default:
        return `${item.value}`;
    }
  };
  
  // Helper to get position text styling
  const getPositionClasses = (position: number) => {
    if (position === 0) {
      return 'text-black font-bold';
    } else if (position === 1) {
      return 'text-black';
    } else if (position === 2) {
      return 'text-black';
    } else {
      return 'text-gray-600';
    }
  };
  
  // Helper to get the badge/medal icon for the position
  const getPositionIcon = (position: number) => {
    if (position === 0) {
      return 'bg-black flex items-center justify-center ri-trophy-line text-white text-xs';
    } else {
      return 'bg-gray-200 flex items-center justify-center ri-medal-line text-black text-xs';
    }
  };
  
  return (
    <div className="bg-white border border-black rounded-md p-5 h-full">
      <h3 className="text-lg font-bold mb-4 flex items-center text-black uppercase tracking-wider">
        <i className={`${icon} mr-2 text-black`}></i>
        {title}
      </h3>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <span className={`text-xl font-bold ${getPositionClasses(index)}`}>{index + 1}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <span className="text-xs text-white font-medium">
                  {item.username.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-black">{item.username}</p>
                <p className="text-xs text-gray-600">{getValueText(item)}</p>
              </div>
              <div className={`w-6 h-6 rounded-full ${getPositionIcon(index)}`}>
                <i className={index === 0 ? 'ri-trophy-line text-white text-xs' : 'ri-medal-line text-black text-xs'}></i>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
