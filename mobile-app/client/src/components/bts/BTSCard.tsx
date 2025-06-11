import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { VideoEmbed } from "@/components/VideoEmbed";
import type { BTSContent } from "@/lib/types";

interface BTSCardProps {
  content: BTSContent;
}

export default function BTSCard({ content }: BTSCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const formattedDate = formatDistanceToNow(new Date(content.date), { addSuffix: true });
  
  return (
    <Card className="bg-white border border-black rounded-md overflow-hidden group hover:shadow-md transition">
      <div 
        className="h-56 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {content.videoUrl ? (
          <VideoEmbed 
            url={content.videoUrl} 
            title={content.title}
            className="h-full"
          />
        ) : (
          <img 
            src={content.imageUrl} 
            alt={content.title} 
            className={`object-cover h-full w-full object-center transition duration-500 ${isHovered ? 'scale-105' : ''}`}
          />
        )}
      </div>
      <CardContent className="p-4">
        <Badge 
          variant="outline" 
          className="inline-block px-2 py-0.5 bg-black text-white text-xs uppercase tracking-wider rounded-sm mb-2"
        >
          {content.category}
        </Badge>
        <h3 className="font-medium text-black uppercase tracking-wider mb-1">{content.title}</h3>
        <p className="text-sm text-black/70">{content.description}</p>
        <div className="flex items-center mt-3 text-sm text-black/70">
          <i className="ri-time-line mr-1"></i>
          <span>{formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
