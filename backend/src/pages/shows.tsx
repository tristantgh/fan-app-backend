import { Helmet } from 'react-helmet';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ShowCard from "@/components/shows/ShowCard";
import type { Show } from "@/lib/types";

export default function Shows() {
  const [region, setRegion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: shows = [] } = useQuery<Show[]>({
    queryKey: ['/api/shows'],
  });
  
  // Filter shows by region and search query
  const filteredShows = shows.filter(show => {
    const matchesRegion = region === "all" || show.region === region;
    const matchesSearch = show.venue.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         show.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });
  
  // Sort shows by date (earliest first)
  const sortedShows = [...filteredShows].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Group shows by month/year
  const groupedShows: Record<string, Show[]> = {};
  
  sortedShows.forEach(show => {
    const date = new Date(show.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!groupedShows[monthYear]) {
      groupedShows[monthYear] = [];
    }
    
    groupedShows[monthYear].push(show);
  });
  
  // Available regions for filter
  const regions = ["all", "north-america", "europe", "asia", "australia", "south-america"];
  const regionLabels: Record<string, string> = {
    "all": "All Regions",
    "north-america": "North America",
    "europe": "Europe",
    "asia": "Asia",
    "australia": "Australia & New Zealand",
    "south-america": "South America"
  };
  
  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
      <Helmet>
        <title>Upcoming Shows | Tristan Community</title>
        <meta name="description" content="View all upcoming Tristan concert dates, venues, and ticket information." />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Upcoming Shows</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Input
            placeholder="Search by venue or location..."
            className="w-full sm:w-64 bg-transparent border border-black focus:ring-0 focus:border-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full sm:w-[180px] bg-transparent border border-black focus:ring-0 text-xs uppercase tracking-wider">
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(r => (
                <SelectItem key={r} value={r}>{regionLabels[r]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {Object.keys(groupedShows).length > 0 ? (
          Object.entries(groupedShows).map(([monthYear, shows]) => (
            <div key={monthYear} className="mb-10">
              <h2 className="text-xl font-semibold mb-4 text-black uppercase tracking-wider">{monthYear}</h2>
              <div className="space-y-4">
                {shows.map(show => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center bg-white border border-black rounded-md">
            <i className="ri-calendar-event-line text-4xl text-black mb-3"></i>
            <p className="text-black">No upcoming shows found. Check back soon for new tour dates!</p>
          </div>
        )}
      </div>
    </div>
  );
}
