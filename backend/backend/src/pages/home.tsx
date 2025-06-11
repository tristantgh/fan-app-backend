import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import AudioPlayer from "@/components/audio/AudioPlayer";
import MerchCard from "@/components/merch/MerchCard";
import ShowCard from "@/components/shows/ShowCard";
import BTSCard from "@/components/bts/BTSCard";
import ChatWindow from "@/components/chat/ChatWindow";
import LeaderboardCard from "@/components/leaderboard/LeaderboardCard";
import performanceImage from "@assets/DSC04290 4.jpg";
import studioImage from "@assets/IMG_3772 3.jpg";
import type { MerchItem, Show, BTSContent, LeaderboardItem, UnreleasedTrack } from "@/lib/types";
import TristanBanner from "../assets/tristan-banner.png";

export default function Home() {
  // Fetch featured content
  const { data: merchItems = [] } = useQuery<MerchItem[]>({
    queryKey: ['/api/merch/featured'],
  });
  
  const { data: shows = [] } = useQuery<Show[]>({
    queryKey: ['/api/shows/upcoming'],
  });
  
  const { data: btsContent = [] } = useQuery<BTSContent[]>({
    queryKey: ['/api/bts/featured'],
  });
  
  const { data: merchLeaderboard = [] } = useQuery<LeaderboardItem[]>({
    queryKey: ['/api/leaderboard/merch'],
  });
  
  const { data: streamsLeaderboard = [] } = useQuery<LeaderboardItem[]>({
    queryKey: ['/api/leaderboard/streams'],
  });
  
  const { data: showsLeaderboard = [] } = useQuery<LeaderboardItem[]>({
    queryKey: ['/api/leaderboard/shows'],
  });
  
  const { data: unreleased = [] } = useQuery<UnreleasedTrack[]>({
    queryKey: ['/api/music/unreleased'],
  });
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        <img 
          src={TristanBanner} 
          alt="Tristan photo collage" 
          className="object-cover h-full w-full object-center"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-4">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4">TRISTAN</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl">Welcome to the official fan community</p>

        </div>
      </section>

      <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
        {/* Featured Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Announcements Card */}
            <div className="bg-white border border-black rounded-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://i.imgur.com/hRHq86b.jpg" 
                  alt="Latest announcements from Tristan" 
                  className="object-cover h-full w-full object-top transform hover:scale-105 transition duration-700"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wider">Latest Announcements</h3>
                <p className="text-black text-sm mb-4">Stay updated with the latest news and announcements from Tristan.</p>
                <Link href="/announcements">
                  <a className="text-black hover:text-gray-600 flex items-center font-medium uppercase text-xs tracking-wider">
                    View all announcements
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Link>
              </div>
            </div>
            
            {/* Upcoming Shows Card */}
            <div className="bg-white border border-black rounded-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 overflow-hidden">
                <img 
                  src={performanceImage} 
                  alt="Tristan performing live on stage" 
                  className="object-cover h-full w-full object-center transform hover:scale-105 transition duration-700"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wider">Upcoming Shows</h3>
                <p className="text-black text-sm mb-4">
                  {shows.length > 0 
                    ? `Next show: ${shows[0].venue}, ${shows[0].location} - ${new Date(shows[0].date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`
                    : "Check out Tristan's upcoming concert dates and venues."}
                </p>
                <Link href="/shows">
                  <a className="text-black hover:text-gray-600 flex items-center font-medium uppercase text-xs tracking-wider">
                    View all shows
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Link>
              </div>
            </div>
            
            {/* Behind The Scenes Card */}
            <div className="bg-white border border-black rounded-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 overflow-hidden">
                <img 
                  src={studioImage} 
                  alt="Behind the scenes in a recording studio" 
                  className="object-cover h-full w-full object-center transform hover:scale-105 transition duration-700"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wider">Behind The Scenes</h3>
                <p className="text-black text-sm mb-4">Exclusive content from recording sessions, performing, and more.</p>
                <Link href="/behind-scenes">
                  <a className="text-black hover:text-gray-600 flex items-center font-medium uppercase text-xs tracking-wider">
                    View all content
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Unreleased Music Section */}
        <section className="mb-12" id="unreleased">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Unreleased Music</h2>
            <Link href="/unreleased">
              <a className="text-black hover:text-gray-600 text-xs font-medium uppercase tracking-wider">View all</a>
            </Link>
          </div>
          
          <div className="bg-white border border-black rounded-lg p-6">
            <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/videoseries?list=PL7AtSG8hGFErRtSWC2XtMwAVCa3yE0rqS"
                title="Tristan Unreleased Music Playlist"
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-xs text-black/70 mt-4 text-center">
              Exclusive unreleased content for fan community members only.
            </p>
          </div>
        </section>
        
        {/* Merch Section */}
        <section className="mb-12" id="merch">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Merchandise</h2>
            <Link href="/merch">
              <a className="text-black hover:text-gray-600 text-xs font-medium uppercase tracking-wider">View all</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {merchItems.slice(0, 4).map(item => (
              <MerchCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Upcoming Shows Section */}
        <section className="mb-12" id="shows">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Upcoming Shows</h2>
            <Link href="/shows">
              <a className="text-black hover:text-gray-600 text-xs font-medium uppercase tracking-wider">View all</a>
            </Link>
          </div>
          
          <div className="space-y-4">
            {shows.slice(0, 3).map(show => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </section>

        {/* Behind The Scenes Section */}
        <section className="mb-12" id="behind-scenes">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Behind The Scenes</h2>
            <Link href="/behind-scenes">
              <a className="text-black hover:text-gray-600 text-xs font-medium uppercase tracking-wider">View all</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {btsContent.slice(0, 3).map(content => (
              <BTSCard key={content.id} content={content} />
            ))}
          </div>
        </section>
      
        {/* Chat Preview Section */}
        <section className="mb-12" id="chat">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Fan Chat</h2>
            <Link href="/chat">
              <a className="text-black hover:text-gray-600 text-xs font-medium uppercase tracking-wider">Join the conversation</a>
            </Link>
          </div>
          
          <ChatWindow />
        </section>
        
        {/* Leaderboard Section */}
        <section className="mb-12" id="leaderboard">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Fan Leaderboard</h2>
            <Link href="/leaderboard">
              <a className="text-black hover:text-gray-600 text-xs font-medium uppercase tracking-wider">View full leaderboard</a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LeaderboardCard
              title="Top Merch Buyers"
              icon="ri-t-shirt-line"
              iconColor="text-primary"
              items={merchLeaderboard.slice(0, 5)}
              type="merch"
            />
            
            <LeaderboardCard
              title="Top Streamers This Week"
              icon="ri-headphone-line"
              iconColor="text-secondary"
              items={streamsLeaderboard.slice(0, 5)}
              type="streams"
            />
            
            <LeaderboardCard
              title="Most Shows Attended"
              icon="ri-calendar-event-line"
              iconColor="text-accent"
              items={showsLeaderboard.slice(0, 5)}
              type="shows"
            />
          </div>
        </section>
      </div>
    </>
  );
}
