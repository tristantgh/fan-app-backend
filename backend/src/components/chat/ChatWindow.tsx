import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import ChatMessage from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

export default function ChatWindow() {
  const { messages, sendMessage, connectedUsers } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };
  
  // Extract avatars for currently active users
  const activeUserAvatars = connectedUsers.slice(0, 3);
  
  return (
    <div className="bg-white border border-black rounded-md p-5 shadow h-[600px] flex flex-col">
      {/* Active users */}
      <div className="mb-5 flex items-center space-x-3">
        <div className="flex -space-x-2">
          {activeUserAvatars.map((user, index) => (
            <Avatar key={index} className="w-8 h-8 border-2 border-white">
              <AvatarFallback className="bg-black text-white text-xs uppercase tracking-wider">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="text-sm text-black/70">
          <span className="text-black font-medium uppercase tracking-wider">{connectedUsers.length} fans</span> active now
        </div>
      </div>
      
      {/* Chat messages */}
      <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message: ChatMessageType) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="mt-6 relative">
        <Input
          type="text"
          placeholder="Type a message..."
          className="w-full bg-transparent border border-black text-black rounded-full py-3 px-5 pr-12 focus:ring-0 focus:border-black"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button 
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 h-auto w-auto hover:bg-transparent"
        >
          <Send className="h-5 w-5 text-warm-brown" />
        </Button>
      </form>
    </div>
  );
}
