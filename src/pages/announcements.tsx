import { Helmet } from 'react-helmet';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  isPinned: boolean;
}

export default function Announcements() {
  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ['/api/announcements'],
  });
  
  // Sort announcements - pinned first, then by date
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tour':
        return 'bg-secondary text-white';
      case 'release':
        return 'bg-primary text-white';
      case 'merch':
        return 'bg-accent text-white';
      case 'media':
        return 'bg-accent2 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };
  
  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
      <Helmet>
        <title>Announcements | Tristan Community</title>
        <meta name="description" content="Stay updated with the latest announcements from Tristan including new releases, tour dates, and exclusive content." />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Announcements</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {sortedAnnouncements.map(announcement => (
            <Card key={announcement.id} className="bg-white border-black">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-black uppercase tracking-wider">
                      {announcement.title}
                      {announcement.isPinned && (
                        <Badge className="ml-2 bg-black text-white rounded-sm px-2 py-0.5 text-xs uppercase font-normal tracking-wider">Pinned</Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge className="bg-black text-white rounded-sm px-2 py-0.5 text-xs uppercase font-normal tracking-wider">
                        {announcement.category}
                      </Badge>
                      <span className="text-xs text-black">
                        {formatDistanceToNow(new Date(announcement.date), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <Separator className="bg-black/20" />
              <CardContent className="pt-4">
                <div 
                  className="text-black prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
              </CardContent>
              <CardFooter className="text-xs text-black">
                Posted by Team Tristan
              </CardFooter>
            </Card>
          ))}
          
          {announcements.length === 0 && (
            <Card className="bg-white border-black">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <i className="ri-megaphone-line text-4xl text-black mb-3"></i>
                <p className="text-black">No announcements available yet. Check back soon!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
