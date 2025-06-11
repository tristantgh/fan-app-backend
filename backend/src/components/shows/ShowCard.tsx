import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import type { Show } from "@/lib/types";

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const formattedDate = new Date(show.date).toLocaleDateString('en-US', {
    month: 'long', 
    day: 'numeric', 
    year: 'numeric'
  });
  
  const formattedTime = new Date(show.date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const getTicketStatusColor = () => {
    switch (show.ticketStatus) {
      case 'Available':
        return 'bg-accent text-white';
      case 'Limited':
        return 'bg-secondary text-white';
      case 'Sold Out':
        return 'bg-destructive text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  return (
    <div className="bg-white border border-black rounded-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-40 md:h-auto">
          <img 
            src={show.imageUrl} 
            alt={`${show.venue} concert venue`} 
            className="object-cover h-full w-full"
          />
        </div>
        <div className="p-5 flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-bold text-lg text-black uppercase tracking-wider">{show.venue}</h3>
            <p className="text-black">{show.location}</p>
            <p className="text-sm text-black/70 mt-1">{formattedDate} | {formattedTime}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <Badge className="bg-black text-white rounded-sm px-2 py-0.5 text-xs uppercase font-normal tracking-wider">
              {show.ticketStatus === 'Available' ? 'Tickets Available' : 
               show.ticketStatus === 'Limited' ? 'Limited Tickets' : 
               'Sold Out'}
            </Badge>
            <Button
              variant="secondary"
              className="ml-4 px-4 py-2 bg-black text-white hover:bg-black/80 rounded-sm font-normal transition text-sm uppercase tracking-wider"
              disabled={show.ticketStatus === 'Sold Out'}
              onClick={() => window.open(show.ticketUrl, '_blank')}
            >
              Get Tickets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
