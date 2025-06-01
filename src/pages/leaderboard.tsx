import { Helmet } from 'react-helmet';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LeaderboardCard from "@/components/leaderboard/LeaderboardCard";
import type { LeaderboardItem } from "@/lib/types";

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState("all-time");
  
  const { data: merchLeaderboard = [] } = useQuery<LeaderboardItem[]>({
    queryKey: ['/api/leaderboard/merch', timeframe],
  });
  
  const { data: streamsLeaderboard = [] } = useQuery<LeaderboardItem[]>({
    queryKey: ['/api/leaderboard/streams', timeframe],
  });
  
  const { data: showsLeaderboard = [] } = useQuery<LeaderboardItem[]>({
    queryKey: ['/api/leaderboard/shows', timeframe],
  });
  
  const { data: referralsLeaderboard = [] } = useQuery<LeaderboardItem[]>({
    queryKey: ['/api/leaderboard/referrals', timeframe],
  });
  
  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
      <Helmet>
        <title>Fan Leaderboard | Tristan Community</title>
        <meta name="description" content="See who's topping the leaderboards for merchandise purchases, music streaming, and concert attendance in Tristan's fan community." />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Fan Leaderboard</h1>
        
        <Card className="bg-white border-black mb-8">
          <CardHeader>
            <CardTitle className="uppercase tracking-wider text-black">Earn Your Spot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
              The leaderboard updates every 24 hours. Top fans may qualify for exclusive perks, meet & greets, and more! Keep supporting Tristan to move up the ranks.
            </p>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all-time" className="w-full" onValueChange={setTimeframe}>
          <TabsList className="bg-transparent border border-black mb-6">
            <TabsTrigger 
              value="all-time"
              className="data-[state=active]:bg-black data-[state=active]:text-white font-medium text-black uppercase text-xs tracking-wider"
            >
              All Time
            </TabsTrigger>
            <TabsTrigger 
              value="this-month"
              className="data-[state=active]:bg-black data-[state=active]:text-white font-medium text-black uppercase text-xs tracking-wider"
            >
              This Month
            </TabsTrigger>
            <TabsTrigger 
              value="this-week"
              className="data-[state=active]:bg-black data-[state=active]:text-white font-medium text-black uppercase text-xs tracking-wider"
            >
              This Week
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={timeframe} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <LeaderboardCard
                title="Top Merch Buyers"
                icon="ri-t-shirt-line"
                iconColor="text-primary"
                items={merchLeaderboard}
                type="merch"
              />
              
              <LeaderboardCard
                title="Top Streamers"
                icon="ri-headphone-line"
                iconColor="text-secondary"
                items={streamsLeaderboard}
                type="streams"
              />
              
              <LeaderboardCard
                title="Most Shows Attended"
                icon="ri-calendar-event-line"
                iconColor="text-accent"
                items={showsLeaderboard}
                type="shows"
              />
              
              <LeaderboardCard
                title="Top Fan Referrals"
                icon="ri-user-add-line"
                iconColor="text-accent2"
                items={referralsLeaderboard}
                type="referrals"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Hall of Fame</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((_, index) => (
              <Card key={index} className="bg-white border-black">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg uppercase tracking-wider">
                    <i className={`${index === 0 ? "ri-t-shirt-line text-black" : 
                                     index === 1 ? "ri-headphone-line text-black" : 
                                     index === 2 ? "ri-calendar-event-line text-black" :
                                     "ri-user-add-line text-black"} mr-2`}></i>
                    {index === 0 ? "Merch Legend" : 
                     index === 1 ? "Streaming Champion" : 
                     index === 2 ? "Ultimate Fan" :
                     "Referral Master"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                      <span className="text-sm text-white font-medium">
                        {index === 0 ? "SB" : index === 1 ? "TR" : index === 2 ? "MS" : "JD"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-black">
                        {index === 0 ? "SoundBreaker" : 
                         index === 1 ? "TristanRhythm" : 
                         index === 2 ? "MusicSoul99" :
                         "JazzDreamer"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {index === 0 ? "Over $10,000 spent on merch" : 
                         index === 1 ? "15,000+ hours streamed" : 
                         index === 2 ? "Attended 100+ shows" :
                         "Brought in 500+ new fans"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
