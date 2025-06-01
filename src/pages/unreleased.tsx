import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Unreleased() {
  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
      <Helmet>
        <title>Unreleased Music | Tristan Community</title>
        <meta name="description" content="Listen to exclusive unreleased tracks, demos, and snippets from Tristan's upcoming projects." />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Unreleased Music</h1>
        
        <Card className="bg-white border-black mb-8">
          <CardHeader>
            <CardTitle className="text-black uppercase tracking-wider">Exclusive Content</CardTitle>
            <CardDescription className="text-black">
              These tracks are exclusively available to fan community members. Please don't share outside this platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
              All unreleased music is provided as previews and may differ from final released versions. 
              Release dates are subject to change.
            </p>
          </CardContent>
        </Card>
        
        {/* Early Access Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">Early Access</h2>
          
          <Card className="bg-white border-black">
            <CardHeader>
              <CardTitle className="text-black uppercase tracking-wider">Coming Soon</CardTitle>
              <CardDescription className="text-black">
                New music that will be released soon - available here first before anywhere else!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <i className="ri-music-2-line text-4xl text-warm-brown mb-4"></i>
                <p className="text-black">
                  Early access playlist will be added here soon with upcoming releases.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* YouTube Playlist Embed */}
        <Card className="bg-white border-black">
          <CardHeader>
            <CardTitle className="text-black uppercase tracking-wider">Unreleased Music Playlist</CardTitle>
            <CardDescription className="text-black">
              Listen to all of Tristan's unreleased tracks and demos in this exclusive playlist.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              This playlist contains exclusive unreleased content for fan community members only.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
