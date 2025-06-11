import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessageType & { isPrivate?: boolean };
}

// Function to determine background color based on username
const getUserColor = (username: string) => {
  // Simple hash function to get a consistent color for each user
  const hash = username.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const colors = [
    "bg-black/10", "bg-black/20", "bg-black/10", 
    "bg-black/15", "bg-black/5"
  ];
  const textColors = [
    "text-black", "text-black", "text-black", 
    "text-black", "text-black"
  ];
  
  // Special case for Safety Bot
  if (username === "SafetyBot") {
    return { bg: "bg-[#814923]/20", text: "text-[#814923]" };
  }
  
  const index = hash % colors.length;
  return { bg: colors[index], text: textColors[index] };
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const { bg, text } = getUserColor(message.username);
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
  
  // Special styling for private messages from SafetyBot
  const isPrivateMessage = message.isPrivate === true;
  const isSafetyBot = message.username === "SafetyBot";
  
  return (
    <div className="flex items-start space-x-3">
      <Avatar className={`w-8 h-8 ${bg} flex items-center justify-center flex-shrink-0 border ${isSafetyBot ? 'border-[#814923]' : 'border-black'}`}>
        <AvatarFallback className={`text-xs ${text} font-medium uppercase tracking-wider`}>
          {message.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className={`font-medium ${isSafetyBot ? 'text-[#814923]' : 'text-black'} uppercase tracking-wider`}>{message.username}</span>
          <span className="text-xs text-black/70">{formattedTime}</span>
          {message.isModerator && (
            <Badge variant="destructive" className={`${isSafetyBot ? 'bg-[#814923]' : 'bg-black'} text-white text-xs px-2 py-0.5 rounded-sm uppercase tracking-wider`}>
              Mod
            </Badge>
          )}
          {isPrivateMessage && (
            <Badge className="bg-gray-200 text-black text-xs px-2 py-0.5 rounded-sm uppercase tracking-wider">
              Private
            </Badge>
          )}
        </div>
        <div className={`${isPrivateMessage ? 'bg-gray-50' : 'bg-white'} ${isSafetyBot ? 'border-[#814923]/50' : 'border-black'} border rounded-md p-3 text-sm text-black`}>
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  );
}
