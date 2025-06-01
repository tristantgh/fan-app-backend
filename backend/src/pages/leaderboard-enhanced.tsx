import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Crown, Trophy, Medal, Star, ShoppingBag, Music, Calendar, Users } from "lucide-react";

interface LeaderboardItem {
  id: number;
  username: string;
  profileImageUrl?: string;
  score: number;
  rank: number;
  city?: string;
  state?: string;
  country?: string;
}

interface FanOfTheMonth {
  username: string;
  profileImageUrl?: string;
  totalScore: number;
  achievements: string[];
  month: string;
  year: number;
}

export default function EnhancedLeaderboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");

  const { data: merchLeaders } = useQuery({
    queryKey: ["/api/leaderboard/merch", selectedTimeframe],
  });

  const { data: streamingLeaders } = useQuery({
    queryKey: ["/api/leaderboard/streaming", selectedTimeframe],
  });

  const { data: showLeaders } = useQuery({
    queryKey: ["/api/leaderboard/shows", selectedTimeframe],
  });

  const { data: referralLeaders } = useQuery({
    queryKey: ["/api/leaderboard/referrals", selectedTimeframe],
  });

  const { data: fanOfTheMonth } = useQuery({
    queryKey: ["/api/leaderboard/fan-of-month"],
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-4 w-4 text-gray-300" />;
    }
  };

  const LeaderboardCard = ({ 
    title, 
    icon, 
    leaders, 
    scoreLabel, 
    emptyMessage 
  }: {
    title: string;
    icon: React.ReactNode;
    leaders: LeaderboardItem[];
    scoreLabel: string;
    emptyMessage: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-warm-brown">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaders && leaders.length > 0 ? (
          <div className="space-y-3">
            {leaders.slice(0, 10).map((leader, index) => (
              <div key={leader.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index + 1)}
                    <span className="font-semibold text-sm">#{index + 1}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {leader.profileImageUrl ? (
                      <img 
                        src={leader.profileImageUrl} 
                        alt={leader.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-warm-brown text-white flex items-center justify-center text-sm font-semibold">
                        {leader.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <div>
                      <p className="font-medium text-black">{leader.username}</p>
                      {leader.city && leader.state && (
                        <p className="text-xs text-gray-500">{leader.city}, {leader.state}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Badge variant="secondary" className="bg-warm-brown text-white">
                  {leader.score} {scoreLabel}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Fan Leaderboard</h1>
          <p className="text-gray-600">See who the top Tristies are across different categories</p>
        </div>

        {/* Fan of the Month */}
        {fanOfTheMonth && (
          <Card className="mb-8 bg-gradient-to-r from-warm-brown to-amber-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Crown className="h-6 w-6" />
                Fan of the Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {fanOfTheMonth.profileImageUrl ? (
                  <img 
                    src={fanOfTheMonth.profileImageUrl} 
                    alt={fanOfTheMonth.username}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white text-warm-brown flex items-center justify-center text-2xl font-bold border-4 border-white">
                    {fanOfTheMonth.username.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div>
                  <h3 className="text-2xl font-bold text-white">{fanOfTheMonth.username}</h3>
                  <p className="text-white/80 mb-2">Total Score: {fanOfTheMonth.totalScore} points</p>
                  <div className="flex flex-wrap gap-2">
                    {fanOfTheMonth.achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeframe Selection */}
        <div className="mb-6">
          <Tabs value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <TabsList>
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
              <TabsTrigger value="yearly">This Year</TabsTrigger>
              <TabsTrigger value="alltime">All Time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Leaderboard Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeaderboardCard
            title="Merch Legend"
            icon={<ShoppingBag className="h-5 w-5" />}
            leaders={merchLeaders || []}
            scoreLabel="purchases"
            emptyMessage="No merch purchases yet. Be the first to support Tristan!"
          />

          <LeaderboardCard
            title="Streaming Champion"
            icon={<Music className="h-5 w-5" />}
            leaders={streamingLeaders || []}
            scoreLabel="streams"
            emptyMessage="Connect your Airbuds account to start tracking streams!"
          />

          <LeaderboardCard
            title="Most Shows Attended"
            icon={<Calendar className="h-5 w-5" />}
            leaders={showLeaders || []}
            scoreLabel="shows"
            emptyMessage="Show tracking will begin when Tristan starts touring!"
          />

          <LeaderboardCard
            title="Top Fan Referrals"
            icon={<Users className="h-5 w-5" />}
            leaders={referralLeaders || []}
            scoreLabel="referrals"
            emptyMessage="Share your referral code to start climbing this leaderboard!"
          />
        </div>

        {/* Integration Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-warm-brown">How Leaderboards Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-warm-brown" />
                  Merch Legend
                </h4>
                <p className="text-sm text-gray-600">
                  Automatically tracks purchases from Tristan's Squarespace store via Zapier integration.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <Music className="h-4 w-4 text-warm-brown" />
                  Streaming Champion
                </h4>
                <p className="text-sm text-gray-600">
                  Connect your Airbuds account to automatically track your listening habits and streams.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-warm-brown" />
                  Most Shows Attended
                </h4>
                <p className="text-sm text-gray-600">
                  Show attendance will be tracked automatically through ticket purchases once touring begins.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-warm-brown" />
                  Top Fan Referrals
                </h4>
                <p className="text-sm text-gray-600">
                  Share your unique referral code to invite friends and climb the referral leaderboard!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}