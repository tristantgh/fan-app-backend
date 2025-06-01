import { Helmet } from 'react-helmet';
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BehindScenes() {
  const [category, setCategory] = useState("projects");
  
  const projects = [
    {
      title: "2025 SINGLES",
      playlistId: "PL7AtSG8hGFEpPnlWQD8gHP1ODDHNAn30e"
    },
    {
      title: "THE HEART I FEEL BEAT",
      playlistId: "PL7AtSG8hGFEqfc4vtZ2ATnGNJe1z_Y0dh"
    },
    {
      title: "SUMMER '24 SINGLES",
      playlistId: "PL7AtSG8hGFEpeoBqwMR2VnkUSpBU8ZLaI"
    },
    {
      title: "SOMETHING I CAN FEEL",
      playlistId: "PL7AtSG8hGFEp1WvNMmB9O9CEEgQzAjnYE"
    },
    {
      title: "GIVE ME SOMETHING REAL",
      playlistId: "PL7AtSG8hGFErLdH2O1-jlo8Baz_Wyrexm"
    },
    {
      title: "NOMAD",
      playlistId: "PL7AtSG8hGFEpIC3KQakDTRrSh8O5tMRiz"
    }
  ];

  const shows = [
    {
      title: "NEW YORK POP-UP (2025)",
      videoId: "AvqdqmmvtwE",
      type: "video"
    },
    {
      title: "LA SHOWCASE (2023)",
      playlistId: "PL7AtSG8hGFEpJF73elksEe8yGMXIeZd5L",
      type: "playlist"
    },
    {
      title: "FINDING MY WAY (2022)",
      playlistId: "PL7AtSG8hGFEq6nqyw_443lQoU_6FXWqlb",
      type: "playlist"
    },
    {
      title: "WE HAD A POOL PARTY LOL",
      playlistId: "PL7AtSG8hGFEqHpEHOXP6hwF4JD4i3AkWi",
      type: "playlist"
    },
    {
      title: "NOMAD RELEASE SHOW",
      playlistId: "PL7AtSG8hGFEo0qf3aDZdL2lp31ukwVUbl",
      type: "playlist"
    },
    {
      title: "DRUMMING/OPENING ON TOUR (2022)",
      playlistId: "PL7AtSG8hGFEpUtJL90iuC3le06bHaduFv",
      type: "playlist"
    }
  ];
  
  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
      <Helmet>
        <title>Behind The Scenes | Tristan Community</title>
        <meta name="description" content="Get exclusive behind-the-scenes content from Tristan's recording sessions, tour preparation, and more." />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Behind The Scenes</h1>
        
        <Tabs defaultValue="projects" className="w-full" onValueChange={setCategory}>
          <TabsList className="bg-transparent border border-black mb-6">
            <TabsTrigger 
              value="projects"
              className="data-[state=active]:bg-black data-[state=active]:text-white font-medium text-black uppercase text-xs tracking-wider"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="shows"
              className="data-[state=active]:bg-black data-[state=active]:text-white font-medium text-black uppercase text-xs tracking-wider"
            >
              Live Shows
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="mt-0">
            <div className="space-y-8">
              {projects.map((project, index) => (
                <Card key={index} className="bg-white border-black">
                  <CardHeader>
                    <CardTitle className="text-black uppercase tracking-wider">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/videoseries?list=${project.playlistId}`}
                        title={`${project.title} Behind The Scenes`}
                        className="absolute top-0 left-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shows" className="mt-0">
            <div className="space-y-8">
              {shows.map((show, index) => (
                <Card key={index} className="bg-white border-black">
                  <CardHeader>
                    <CardTitle className="text-black uppercase tracking-wider">{show.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
                      {show.type === "video" ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${show.videoId}`}
                          title={`${show.title} Behind The Scenes`}
                          className="absolute top-0 left-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <iframe
                          src={`https://www.youtube.com/embed/videoseries?list=${show.playlistId}`}
                          title={`${show.title} Behind The Scenes`}
                          className="absolute top-0 left-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}