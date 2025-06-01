import { Helmet } from 'react-helmet';
import { Check } from "lucide-react";

export default function Perks() {
  const membershipPerks = [
    {
      title: "FREE Meet & Greet FOR LIFE",
      description: "Get exclusive access to meet and greets at every show, completely free for members"
    },
    {
      title: "Exclusive Zoom Hangs ONLY for Members",
      description: "Member Only zoom hangs with live performances, Q&As and more!"
    },
    {
      title: "Access to New Music EARLY",
      description: "Upcoming music will be released exclusively on the app before it's on Spotify, Apple, etc :)"
    },
    {
      title: "Unreleased Music",
      description: "Access to exclusive tracks, demos, and unreleased content not available anywhere else"
    },
    {
      title: "EXCLUSIVE Tristies Only Merch",
      description: "Special merchandise available only for members here"
    },
    {
      title: "Discount on ALL Merch",
      description: "Get special pricing on all merchandise in the store"
    },
    {
      title: "Announcements",
      description: "Posted in the app first before Instagram, TikTok, etc."
    },
    {
      title: "Exclusive Behind-The-Scenes Content",
      description: "Get access to exclusive content showing Tristan's creative process"
    },
    {
      title: "Leaderboard System",
      description: "Win prizes for streaming the most, coming to the most shows, or purchasing the most merch"
    },
    {
      title: "GROUP CHAT",
      description: "No separation by state or country. Everyone from everywhere can get to know each other in the chat and I'm in it too!"
    },
    {
      title: "Special Thank You Recognition",
      description: "All members will have their name included in a special Thank You section in the description on ALL of my YouTube videos/songs/content"
    },
    {
      title: "Direct Message Access to Me",
      description: "The more people that join our community overall, the harder it is for me to keep up with messages, but if you're a member here you're guaranteed that I'll see and get to your message as soon as I can :)"
    }
  ];
  
  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
      <Helmet>
        <title>Membership Perks | Tristan Community</title>
        <meta name="description" content="Here's a list of all the perks included with your $5/month membership to Tristan's fan community." />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-2">MEMBERSHIP PERKS</h1>
        <p className="text-black mb-8">Here's a list of all the perks included with your membership :)</p>
        
        {/* Membership perks list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {membershipPerks.map((perk, index) => (
            <div key={index} className="bg-white border border-black rounded-lg p-6">
              <div className="flex items-start">
                <div className="mr-3 flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-warm-brown" />
                </div>
                <div>
                  <h3 className="font-bold text-black mb-2 uppercase tracking-wider">{perk.title}</h3>
                  <p className="text-black text-sm">{perk.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Support section */}
        <div className="bg-white rounded-lg p-6 border border-black">
          <p className="text-black text-center">
            Any additional questions, just submit a support ticket or message me on Instagram!
          </p>
        </div>
      </div>
    </div>
  );
}
