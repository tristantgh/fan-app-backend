import { Helmet } from 'react-helmet';
import ChatWindow from "@/components/chat/ChatWindow";

export default function Chat() {
  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
      <Helmet>
        <title>Fan Chat | Tristan Community</title>
        <meta name="description" content="Chat with other Tristan fans, discuss upcoming shows, and connect with the community." />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Fan Chat</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChatWindow />
          </div>
          
          <div className="bg-white border border-black rounded-md p-5 shadow">
            <h2 className="text-xl font-bold mb-4 text-black uppercase tracking-wider">Chat Guidelines</h2>
            <ul className="space-y-3 text-black">
              <li className="flex items-start">
                <span className="flex-shrink-0 text-black mr-2">•</span>
                <span>Be respectful to other fans and moderators.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 text-black mr-2">•</span>
                <span>No spamming, excessive self-promotion, or harassment.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 text-black mr-2">•</span>
                <span>Keep discussions related to Tristan, music, and the community.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 text-black mr-2">•</span>
                <span>Report any inappropriate behavior via the support page.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 text-black mr-2">•</span>
                <span>Have fun and build connections with fellow fans!</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-black/5 border border-black rounded-md">
              <h3 className="font-bold text-black uppercase tracking-wider mb-2">Chat Commands</h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <code className="text-black font-mono">/help</code>
                  <span className="text-black">Go to support ticket page</span>
                </p>
                <p className="flex justify-between">
                  <code className="text-black font-mono">@username</code>
                  <span className="text-black">Mention someone in the chat</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
