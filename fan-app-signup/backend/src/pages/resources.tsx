import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function Resources() {
  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
      <Helmet>
        <title>Fan Content | Tristan Community</title>
        <meta name="description" content="Access all official resources - artwork, photos, lyrics and more to make your own art and content!" />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-2">Fan Content</h1>
        <p className="text-black mb-8">Access official assets and materials for fan creations</p>
        
        <Card className="bg-white border-black mb-8">
          <CardHeader>
            <CardTitle className="text-black uppercase tracking-wider">Usage Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black mb-4">
              These resources are provided for fan and community use. You may use them for personal creative projects, 
              social media posts, and fan works. Please credit "Tristan" when sharing.
            </p>
            <p className="text-sm text-black">
              Commercial use is not permitted without explicit permission from Tristan's management team.
            </p>
          </CardContent>
        </Card>
        
        {/* Resource Library with Google Drive */}
        <h2 className="text-xl font-bold mb-4 uppercase tracking-wider">RESOURCE LIBRARY</h2>
        
        <Card className="bg-white border-black">
          <CardContent className="pt-6 text-center">
            <div className="mb-6">
              <i className="ri-folder-music-line text-5xl text-warm-brown mb-4"></i>
              <p className="text-black mb-6">
                Click this Google Drive link to access all official resources - artwork, photos, lyrics and more to make your own art and content!
              </p>
              
              <Button 
                className="bg-warm-brown text-white hover:bg-warm-brown/90 rounded-sm uppercase tracking-wider px-6 py-3 mb-4"
                onClick={() => window.open('https://drive.google.com/drive/folders/1wUQWZM4VDE-bi8Vb8Di9Yj_RTNfMX-8P?usp=share_link', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Click Here
              </Button>
              
              <p className="text-xs text-black/70">
                Click to access all official photos, lyrics, artwork and more!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
