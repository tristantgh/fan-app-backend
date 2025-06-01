import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  stepNumber: string;
  imageUrl?: string;
  images: string[];
}

export default function Story() {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);

  const timelineEvents: TimelineEvent[] = [
    {
      id: 1,
      year: "Birth",
      title: "Birth",
      description: "I was born in Charleston, South Carolina on November 2nd, 2000 to my parents Lauren and Peter Hulsebos. I can't say I remember all too much from this era, but I guess I had a pretty good time lol.",
      stepNumber: "",
      imageUrl: "https://i.imgur.com/E5CIltx.png",
      images: [
        "https://imgur.com/zLwTNG4.jpg",
        "https://imgur.com/miIq8tQ.jpg", 
        "https://imgur.com/0BjJlYC.jpg",
        "https://imgur.com/YsxxrWt.jpg",
        "https://imgur.com/nOBsJlv.jpg"
      ]
    },
    {
      id: 2,
      year: "Charleston",
      title: "Charleston",
      description: "I lived in Charleston until I was 8 years old. My parents divorced when I was 3, but I still remained close with both sides of my family - even if it was tough at times. I played a lot of basketball, video games, and ate a lot of Chick-Fil-A. Everyone in my family is pretty musical, so I was always immersed in it, but it hadn't really clicked yet. I had tried playing guitar, but ended up playing Guitar Hero way more and never practiced. Shortly before my mom and I moved to Atlanta though, I was in the car with my uncle and he played me this song - \"Ocean Breathes Salty\" by Modest Mouse. At this point I was probably 7 years old and I just remember in that moment knowing that music was going to be my life. I didn't know how yet, but I knew that the feeling that song gave me was something I would chase forever.",
      stepNumber: "",
      imageUrl: "https://i.imgur.com/Iif9b2x.png",
      images: [
        "https://imgur.com/dP5kEQq.jpg",
        "https://imgur.com/PXGzDkf.jpg",
        "https://imgur.com/LmEic9I.jpg",
        "https://imgur.com/xRD1xlR.jpg",
        "https://imgur.com/fgWHGTt.jpg",
        "https://imgur.com/QXgV5QA.jpg",
        "https://imgur.com/1OKs5R9.jpg",
        "https://imgur.com/1OKs5R9.jpg",
        "https://imgur.com/YkxXLYc.jpg"
      ]
    },
    {
      id: 3,
      year: "Atlanta",
      title: "Atlanta", 
      description: "When I was 8 years old, my mom and I moved to Atlanta for her to get remarried. She wanted a better upbringing for me and a big new city with some cousins and family friends already there seemed like the perfect place. This is when I reallyyyy fell in love with music. My stepdad had a drum kit and as soon as I sat down, I was hooked. I went to school the next day after playing for the first time and told all my new friends we should start a band. Also around this time, I started writing songs. I didn't really know what I was doing, but I would have melodies stuck in my head from the music I'd listen to on my way to school and I would just write new lyrics to those songs on my notes in class. Over the course of the next few years, I'd keep playing drums and writing songs for the bands I was in, eventually learning to produce and play guitar, bass, and piano as well. I always knew I wanted to sing my own songs too, but that didn't come until much later - once the singer of our band graduated. Aside from music though, I look back at this chapter of my life very fondly. Of course there were ups and downs, but the great community, friends, and immersion in music I gained during this time are so foundational to who I am.",
      stepNumber: "",
      imageUrl: "https://i.imgur.com/ETTrY6g.png",
      images: [
        "https://imgur.com/yeZaMUI.jpg",
        "https://imgur.com/hjWLkhU.jpg",
        "https://imgur.com/vUgPJCN.jpg",
        "https://imgur.com/GOZN5y6.jpg",
        "https://imgur.com/bS1nKyu.jpg",
        "https://imgur.com/gFfFTap.jpg",
        "https://imgur.com/OJZqGw2.jpg",
        "https://imgur.com/h6ebpT4.jpg",
        "https://imgur.com/8kxCGY2.jpg",
        "https://imgur.com/XSAwG8f.jpg",
        "https://imgur.com/GSXVmBO.jpg",
        "https://imgur.com/Wm2OHMN.jpg",
        "https://imgur.com/mgbMCPk.jpg",
        "https://imgur.com/ZMqi43q.jpg",
        "https://imgur.com/s2zBhUZ.jpg",
        "https://imgur.com/FrosX4x.jpg",
        "https://imgur.com/pr3OF9r.jpg"
      ]
    },
    {
      id: 4,
      year: "College/Covid",
      title: "College/Covid",
      description: "Fast forward to 2019 and I graduated high school. My mom had been wanting to move back to Charleston and with me going off to college, this seemed to be the perfect time. That summer we moved back to Charleston, it was really tough leaving my life in Atlanta behind, but I wanted my mom to be happy and close to our family and everyone was going off to college anyway. In the fall I moved up to Middle Tennessee State University to study Songwriting and Music Business. Before I even got there, I knew I didn't want to graduate. I was ready to start my career and I could hardly think about anything else. At first, school wasn't too bad. I finally was around a lot of people who seemingly wanted to also pursue music. Over time though, I found myself staying in the studio all night time and time again instead of hanging out with everyone. It was challenging knowing my friends from back home were all partying every weekend and my new friends at school didn't want to spend every second possible in the studio with me, but that's the sacrifices we have to make y'know.\n\nMarch 2020. It's spring break of my freshman year and I drove all the way from MTSU to Charleston to surprise my mom. What started as a surprise turned into me rushing back to my dorm to get all of my belongings and then rushing back to Charleston due to the pandemic. I remember being in the middle of nowhere Tennessee on the highway listening to the state of emergency being announced. I got back to my Mom's house and like most people, I just tried to take it day by day. I was fortunate to stay healthy and isolated during this time and ended up making a lot of music. The most important thing however, was a dream I had. One night in quarantine I had this dream where essentially I saw every chapter of my entire life flash by and I could see that in every single one, music was always there. Every time, without fail. I woke up knowing that now is the time. This is what I am truly meant to do and I will do everything I possibly can to make it happen.\n\nThat summer one of my best friends, Zach, and I went up to the University of Georgia to sublet his fraternity brother's apartment and spend a month making a ton of songs. I actually released all of these on Soundcloud under a different name, but eventually took them down (you'll never find them haha). Many new versions of these songs might find their way out into the world sometime soon though…\n\nAs quarantine started to become a bit less strict and summer was ending, I was headed back to school for a hybrid semester. I tried convincing my mom to let me go ahead and move to LA, but I had already signed a lease for my apartment in Tennessee and enrolled in school. The next few months after going back to Tennessee were extremely tough for me. I was on the brink of having a panic attack most days and just in a very low place. I was somewhere I didn't want to be, sort of still in quarantine, and wanting to do nothing else but fully pursue music. I was able to get out of this rut though, mainly by to talking to my grandma on the phone most days (she's the best), making as much music as possible between classes, and delivering Uber Eats for money - delivering food when there's barely other cars on the road and a lot of time to think and listen to music and watch the sunset was honestly pretty therapeutic.\n\nIn December I wrote a very long essay to my mom explaining why I wanted to \"take a semester off\" (I was totally dropping out lol) I explained I wanted to focus fully on music and that I wouldn't miss much anyway since school was going to be mainly online the next semester. Somehow she agreed and that same week I sold my very first beat to another artist at my school. At this point, I started really locking in - I was producing for every artist I could, messaging everyone who's contact info I could find in LA, teaching myself to sing, and delivering more Uber Eats to save up money for my eventual move to LA. I actually visited LA one time, April 2021, before moving there. I was fortunate enough to meet a great producer and a few of his friends on this trip, all of whom I'm still very close with. My apartment lease in Tennessee ended on July 31st, 2021 and that same day I hit the road.",
      stepNumber: "",
      imageUrl: "https://i.imgur.com/aptiZR0.png",
      images: [
        "https://imgur.com/LFOB9lt.jpg",
        "https://imgur.com/oyUDoSa.jpg",
        "https://imgur.com/9gKZ6hQ.jpg",
        "https://imgur.com/AnRpe5q.jpg",
        "https://imgur.com/IKJ2T7m.jpg",
        "https://imgur.com/y9OnAbA.jpg",
        "https://imgur.com/nvQYou8.jpg",
        "https://imgur.com/OINcR9O.jpg",
        "https://imgur.com/6k7WX7H.jpg",
        "https://imgur.com/U5Gpmpn.jpg",
        "https://imgur.com/PQiEaz0.jpg",
        "https://imgur.com/BCqMqhT.jpg",
        "https://imgur.com/UFubEAm.jpg",
        "https://imgur.com/l5WqkNH.jpg",
        "https://imgur.com/JUoKSjD.jpg",
        "https://imgur.com/oQFYmTS.jpg",
        "https://imgur.com/EPBRswE.jpg",
        "https://imgur.com/ijU0c1z.jpg",
        "https://imgur.com/3r4yJsf.jpg",
        "https://imgur.com/YVHUjVE.jpg",
        "https://imgur.com/9ERVOK1.jpg"
      ]
    },
    {
      id: 5,
      year: "Moving to LA",
      title: "Moving to LA",
      description: "I drove down from Tennessee to Atlanta with everything I owned in my car. One of my best friends was having her 21st birthday party and I got to see all of my friends from high school one last time before starting my journey to Los Angeles. One of my friends that night said to me, \"we all knew you were going to do this, it was just a matter of when\". The next morning, August 1st, 2021, I drove from Atlanta to New Orleans. Then New Orleans to Austin. Then Austin to Tucson. And finally, Tucson to Los Angeles. Would I drive across the country completely alone with all of my possessions in my car stopping as little as possible along the way again? Probably not. But it's without a doubt one of the best experiences of my life so far. I spent a lot of time reflecting on life, listening to early versions of Nomad and a bunch of the music I had made up until that point, podcasts, books, and talking to family and friends. I had a folder of beats I was going to play for everyone I could while I was still working on my voice once I got to LA - the initial plan was to produce for other artists first to get my foot in the door, and then start releasing my own music. This kinda happened…more on that later.\n\nAnyway, I arrived in Los Angeles on August 4th, 2021 knowing nobody except that producer I had met who I loosely kept in touch with over the past few months and one other artist I met on instagram. I had an Airbnb booked for a month and my plan was to take that month to figure out a more long-term living situation. Turns out the Airbnb was a bit of a scam - no AC and no fridge (mind you it was 104 degrees outside at this time). So my one month stay ended up being three days and fortunately that same producer allowed me to crash on his couch for a couple weeks.\n\nAs fate would have it, an artist he was producing for at the time had a room open up in the house he was renting. I went to visit the house and met the guys. They showed me around and then in the living room there was a drum kit setup. Everyone started jamming and I sat down on the drums. I basically auditioned for a place to live - very LA. When I later left to go back to sleeping on the couch they said, \"we'll text you, also we'll keep you in mind for tour.\" I moved in the next week.\n\nAfter moving into that house, I started to get a bit settled in LA. I had a decent friend group and was going out to shows, meeting people, working on Nomad, and trying to get my name out there as a producer first. Fast forward to November and while I was recording the vocals for \"She\", the first song I ever released actually, my mom called me to tell me my dad had passed away. We hadn't been close in years, but this of course devastated me. I wrote my song \"Father\" that night and flew back home to be with my family a couple days later. The rest of 2021 was spent back and forth between finishing Nomad in LA and seeing my family in Charleston.",
      stepNumber: "",
      imageUrl: "https://i.imgur.com/jYUQ9xw.png",
      images: [
        "https://imgur.com/ztYNOH7.jpg",
        "https://imgur.com/TLabQIB.jpg",
        "https://imgur.com/QMObfgg.jpg",
        "https://imgur.com/fTI2PDY.jpg",
        "https://imgur.com/bBJBXIG.jpg",
        "https://imgur.com/mWPg6em.jpg",
        "https://imgur.com/wD6PxZ9.jpg",
        "https://imgur.com/zXjdrOc.jpg",
        "https://imgur.com/R8FElsz.jpg",
        "https://imgur.com/JcTmE4B.jpg",
        "https://imgur.com/rNWCmCb.jpg",
        "https://imgur.com/hKFIJiH.jpg",
        "https://imgur.com/1A6bft8.jpg",
        "https://imgur.com/ayv5Cts.jpg",
        "https://imgur.com/dsEc10x.jpg",
        "https://imgur.com/OW8ZgNa.jpg",
        "https://imgur.com/INOsZws.jpg",
        "https://imgur.com/QeSm7gj.jpg",
        "https://imgur.com/MdwxvUI.jpg",
        "https://imgur.com/Agx9uEc.jpg"
      ]
    },
    {
      id: 6,
      year: "2022",
      title: "2022",
      description: "I started off this year seeing all of my friends in Atlanta for New Years. Right after that I went back to LA to finish Nomad, releasing my first official song ever, \"She\", on February 18th, 2022. Also, it turns out I actually was kept in mind for that tour with one of the artists I was living with. We hit the road in March and I was somehow trying to balance releasing singles for Nomad, working under a bigger producer whenever I was in LA, and touring consistently. We played some great festivals and even played a show at the University of Georgia where I got to show all my childhood friends I made the right choice by following my dream (given I was on stage performing for them) and I even got to open for that show and sing for literally anybody for the first time ever in my life. I was definitely terrified and I know I didn't sound that good, but it's a moment I will cherish forever. You just gotta push through sometimes.\n\nEventually, tour ended and I came back to LA full time. I was bouncing around subletting apartments and staying with friends for the summer while I looked for a new place. During this time, I released Nomad on June 24th, 2022. My first EP. I was selling T-shirts out of my trunk and mailing them to whoever would buy. I was doing everything I could to make my dreams a reality (still am by the way) and that summer is one I know I'll always look back on and smile.\n\nThe rest of this year was spent moving into a new place with some mutual friends from Atlanta, drumming and producing for others to stay afloat, putting out more music (Present, The Old You, Winter in Atlanta, Late Night Call) and figuring out what the next steps were going to be for me.",
      stepNumber: "",
      imageUrl: "https://i.imgur.com/KaG4sqd.png",
      images: [
        "https://imgur.com/3cDzHS6.jpg",
        "https://imgur.com/s5SWweV.jpg",
        "https://imgur.com/Hh4CWRD.jpg",
        "https://imgur.com/um4oqpK.jpg",
        "https://imgur.com/zEiWOuB.jpg",
        "https://imgur.com/VsSpheM.jpg",
        "https://imgur.com/R3Ffud6.jpg",
        "https://imgur.com/dR8MlIl.jpg",
        "https://imgur.com/DmWMY0g.jpg",
        "https://imgur.com/NS6qBm0.jpg",
        "https://imgur.com/o0sOnmJ.jpg",
        "https://imgur.com/C1QmIGK.jpg",
        "https://imgur.com/uTaWpH4.jpg",
        "https://imgur.com/jSX38og.jpg",
        "https://imgur.com/Ik9zXCs.jpg",
        "https://imgur.com/tncCeEC.jpg",
        "https://imgur.com/LgMt9R1.jpg",
        "https://imgur.com/Z6n9KyN.jpg",
        "https://imgur.com/hxfmHR4.jpg",
        "https://imgur.com/AbMmbyZ.jpg"
      ]
    },
    {
      id: 7,
      year: "2023",
      title: "2023",
      description: "The producer I was working for had sat me down shortly before the new year and gave me the advice I didn't want to hear but, knew I needed to. He told me. \"you're good at a lot of things, but if you want to be great at any of them, pick one.\" He could see that I was spreading myself way too thin, overworking constantly trying to drum and produce for others while also working on my own music and trying to make enough money just to scrape by and pay rent. This conversation changed the course of my life and let me know that it was absolutely without a doubt time to fully focus on my music - so that's what I did. I spent the entire year of 2023 just focusing on making a much music as I possibly could and getting better at my craft every single day.\n\nIn January I made \"Some Kind of Way\" and from there was all in on crafting my second EP \"Give Me Something Real\" - plus I was falling in love and wanted to make a bunch of really good songs to impress my girlfriend at the time. I spent the next few months writing, recording, and producing those songs and released the full EP on July 28th, 2023. The fans \"Some Kind of Way\" brought me showed me that I had made the right decision to pursue my music fully and was the fuel I needed to keep going. The rest of this year I spent making much of the music that ended up coming out in 2024. Almost all of the songs from \"Something I Can Feel\" were made in 2023, along with \"Feel You Breathe\" and \"Dive in Your Soul\". I even wrote the first versions of \"The Heart I Feel Beat\" and \"After Work\" during this time. I could feel myself getting better and that motivated me so much this entire year.",
      stepNumber: "",
      imageUrl: "https://i.imgur.com/RTGU0MJ.png",
      images: [
        "https://imgur.com/i1Kak5z.jpg",
        "https://imgur.com/QnHqx4b.jpg",
        "https://imgur.com/X3k0t98.jpg",
        "https://imgur.com/dRd4XbR.jpg",
        "https://imgur.com/77YcfcG.jpg",
        "https://imgur.com/P5rNlOo.jpg",
        "https://imgur.com/nXap6tq.jpg",
        "https://imgur.com/HkymBhb.jpg",
        "https://imgur.com/Rylw3KJ.jpg",
        "https://imgur.com/p2YTgkY.jpg",
        "https://imgur.com/q9ZHOAr.jpg",
        "https://imgur.com/YmEujtA.jpg",
        "https://imgur.com/NjJpUYW.jpg",
        "https://imgur.com/iFAS8UB.jpg",
        "https://imgur.com/98QqLKm.jpg",
        "https://imgur.com/A11MfYc.jpg",
        "https://imgur.com/2sE2fyf.jpg",
        "https://imgur.com/Jk4emc8.jpg",
        "https://imgur.com/jcJb093.jpg",
        "https://imgur.com/YcYGBCU.jpg",
        "https://imgur.com/NUlh7AL.jpg",
        "https://imgur.com/8F4hu3R.jpg",
        "https://imgur.com/KaogIKV.jpg",
        "https://imgur.com/KmiakKx.jpg",
        "https://imgur.com/0N1U0q0.jpg",
        "https://imgur.com/flXDW3v.jpg",
        "https://imgur.com/BLZAdsE.jpg",
        "https://imgur.com/ui8EZOp.jpg",
        "https://imgur.com/5J0G2nD.jpg",
        "https://imgur.com/5SZKniD.jpg"
      ]
    },
    {
      id: 8,
      year: "2024",
      title: "2024",
      description: "This year started off a little rough. I went to Charleston on New Year's day as there was a bit of a family emergency, however everyone ended up being okay thankfully. I flew back to LA a few days later and wrote all the lyrics to the final version of \"The Heart I Feel Beat\" on that flight.\n\nAbout a month later during some crazy storms in LA, the house I was living in flooded, ruining the majority of my belongings - fortunately with the exception of my clothes and music equipment. This is when I moved in with my good friend Brad, who has now become like a brother to me and who shot the artwork for \"The Heart I Feel Beat\" and all of the 2025 Singles.\n\nThe only downside to this move though (other than most of my possessions getting ruined) is that I didn't really have space to setup most of my recording equipment anymore. Instead of getting upset about this though, I realized this is exactly what I needed. I truly was just shy about posting my music and really did everything I could to avoid it and just keep making music. Not being able to record every day was a sign to me that now is the time to start posting my music and finding my people and my community - and here we are. A lot of you found me around this time. I spent the rest of this year posting all the time, performing on TikTok live constantly, recording whenever I could, and releasing the summer singles (Right Here, We Don't Have to Talk, Dive in Your Soul, Feel You Breathe) and later in the year \"The Heart I Feel Beat\" EP. I also started modeling and acting during this year. LA is full of side quests lol.\n\n2024 was all about growth for me as a man and an artist.",
      stepNumber: "",
      imageUrl: "https://i.imgur.com/uhPzGNU.png",
      images: [
        "https://imgur.com/3tnQb1t.jpg",
        "https://imgur.com/U9Mn9tO.jpg",
        "https://imgur.com/OpE077e.jpg",
        "https://imgur.com/YBv9WX6.jpg",
        "https://imgur.com/g3i2eJY.jpg",
        "https://imgur.com/AXNPJBB.jpg",
        "https://imgur.com/WDnIa0g.jpg",
        "https://imgur.com/iBtmjeG.jpg",
        "https://imgur.com/scjL8vn.jpg",
        "https://imgur.com/QUBX8Je.jpg",
        "https://imgur.com/gsMI4JN.jpg",
        "https://imgur.com/fijOhhj.jpg",
        "https://imgur.com/JeN7dBW.jpg",
        "https://imgur.com/BGlVYpK.jpg",
        "https://imgur.com/YEffyUj.jpg",
        "https://imgur.com/sal7I0W.jpg",
        "https://imgur.com/pCkVaWS.jpg",
        "https://imgur.com/5szrPJT.jpg",
        "https://imgur.com/CHXi7We.jpg",
        "https://imgur.com/SfBM9LD.jpg",
        "https://imgur.com/5EZDKQ2.jpg",
        "https://imgur.com/BiYusz5.jpg",
        "https://imgur.com/lOckk5E.jpg",
        "https://imgur.com/vWkVjVT.jpg",
        "https://imgur.com/KHmJdrD.jpg",
        "https://imgur.com/UmV3Oql.jpg",
        "https://imgur.com/bQIBNrW.jpg",
        "https://imgur.com/b3kBs05.jpg",
        "https://imgur.com/41ls6oM.jpg",
        "https://imgur.com/sauot8r.jpg",
        "https://imgur.com/MiPsGpa.jpg",
        "https://imgur.com/FR5hH5r.jpg",
        "https://imgur.com/Ny8fhO1.jpg",
        "https://imgur.com/4SSsAtv.jpg",
        "https://imgur.com/meGqlAn.jpg",
        "https://imgur.com/usH5maw.jpg",
        "https://imgur.com/ITPYjQk.jpg",
        "https://imgur.com/3e3NndP.jpg",
        "https://imgur.com/DF8GtbJ.jpg"
      ]
    },
    {
      id: 9,
      year: "2025",
      title: "2025",
      description: "And now here we are. If you're reading this you're probably up to date with everything this year. The New York show/trip was one of the absolute best weeks of my life. I'm so happy so many of you have found me and all of the new songs I've released so far. I'm so excited to share everything else I've got planned for this year, and of course I can't wait to perform for all of you as soon as possible.\n\nIf you've read this far - you are without a doubt a real Tristie. I thank you from the bottom of my heart. You are making someone's dreams come true just by being here and being a part of this community. I hope you know that my goal in life is to positively impact as many people as I possibly can through my music, words, ideas, and actions. I hope that I can inspire you to do the same, just as others have done for me. I hope you know that you truly can do anything you set your mind to, and I hope that my story thus far and everything the future has in store for us serve as a reminder of that.\n\nThank you for everything <3\n\nT",
      stepNumber: "",
      imageUrl: "https://i.imgur.com/3qyDlum.jpg",
      images: [
        "https://imgur.com/oIKNDgr.jpg",
        "https://imgur.com/Ssl0cPv.jpg",
        "https://imgur.com/nl2tQaf.jpg",
        "https://imgur.com/tFXYVkR.jpg",
        "https://imgur.com/gAyNMvd.jpg",
        "https://imgur.com/GCOZFqb.jpg",
        "https://imgur.com/3a81pf2.jpg",
        "https://imgur.com/90BZxLi.jpg",
        "https://imgur.com/2PVV5jA.jpg",
        "https://imgur.com/b1YXFH4.jpg",
        "https://imgur.com/87Wmm5v.jpg"
      ]
    }
  ];

  const openEventDetails = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setCurrentImageIndex(0);
    setOpen(true);
  };

  const nextImage = () => {
    if (selectedEvent && currentImageIndex < selectedEvent.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const openImagePopup = () => {
    setImagePopupOpen(true);
  };

  const closeImagePopup = () => {
    setImagePopupOpen(false);
  };

  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
      <Helmet>
        <title>The Story | Tristan Community</title>
        <meta name="description" content="Explore Tristan's musical journey from his early beginnings to worldwide success through this interactive timeline." />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6">The Story</h1>
        
        <div className="bg-card border rounded-lg p-6 mb-8 shadow-sm">
          <p className="text-muted-foreground mb-6">
            Explore Tristan's musical journey and career milestones. Click on any point in the timeline to learn more about key moments in his story.
          </p>
          
          {/* Timeline Container with scrollbar and indicators */}
          <div className="relative">
            {/* Left scroll indicator */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-white/80 rounded-r-lg shadow-md hidden md:flex items-center justify-center">
              <i className="ri-arrow-left-s-line text-warm-brown text-xl"></i>
            </div>
            
            {/* Right scroll indicator */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-white/80 rounded-l-lg shadow-md hidden md:flex items-center justify-center">
              <i className="ri-arrow-right-s-line text-warm-brown text-xl"></i>
            </div>
            
            {/* Scrollable timeline */}
            <div className="mt-12 relative overflow-x-auto pb-8" 
                 style={{
                   scrollbarWidth: 'thin',
                   scrollbarColor: '#814923 #f1f1f1'
                 }}>
              {/* Timeline Events */}
              <div className="flex min-w-max px-8 relative">
                {/* Timeline Line - spans full width of content */}
                <div className="absolute h-0.5 bg-gradient-to-r from-primary to-secondary top-[75px] left-8 right-8 z-0"></div>
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="relative flex flex-col items-center px-4" style={{ minWidth: '150px' }}>
                    {/* Timeline Circle with year */}
                    <button
                      onClick={() => openEventDetails(event)}
                      className="w-16 h-16 rounded-full border-4 border-muted bg-card overflow-hidden z-10 hover:border-primary transition-colors duration-300 cursor-pointer shadow-sm"
                    >
                      {event.imageUrl ? (
                        <img 
                          src={event.imageUrl} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-foreground text-xs">{event.year}</span>
                      )}
                    </button>
                    
                    {/* Content - Title */}
                    <div className="text-sm mt-3 text-center">
                      <h4 className="font-semibold text-foreground">{event.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Scroll instruction with icon indicators */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <i className="ri-arrow-left-line text-warm-brown"></i>
            <p className="text-center text-sm text-muted-foreground">
              Scroll horizontally to view the complete timeline
            </p>
            <i className="ri-arrow-right-line text-warm-brown"></i>
          </div>
        </div>
      </div>
      
      {/* Event Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border shadow-md max-w-6xl max-h-[95vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl flex items-center">
                  <span className="bg-warm-brown/20 text-warm-brown py-2 px-4 rounded-full mr-4 font-bold text-lg">
                    {selectedEvent.year}
                  </span>
                  {selectedEvent.year !== selectedEvent.title ? selectedEvent.title : ''}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-8">
                {/* Story Description - Full Width with better formatting */}
                <div className="prose prose-lg max-w-none">
                  {selectedEvent.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-foreground mb-6 leading-relaxed text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                {/* Image Gallery - Full Width Below Text */}
                <div className="space-y-6 border-t pt-8">
                  <h4 className="text-xl font-semibold text-warm-brown mb-4">Photo Gallery</h4>
                  {selectedEvent.images.length > 0 && (
                    <>
                      <div className="relative">
                        <img 
                          src={selectedEvent.images[currentImageIndex]}
                          alt={`${selectedEvent.title} - Image ${currentImageIndex + 1}`}
                          className="w-full h-96 object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={openImagePopup}
                        />
                        
                        {/* Image Navigation */}
                        {selectedEvent.images.length > 1 && (
                          <>
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={prevImage}
                              disabled={currentImageIndex === 0}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 text-black border border-white/30 backdrop-blur-sm"
                            >
                              <ChevronLeft className="h-6 w-6" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={nextImage}
                              disabled={currentImageIndex === selectedEvent.images.length - 1}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white/70 text-black border border-white/30 backdrop-blur-sm"
                            >
                              <ChevronRight className="h-6 w-6" />
                            </Button>
                          </>
                        )}
                      </div>
                      
                      {/* Image Counter */}
                      {selectedEvent.images.length > 1 && (
                        <div className="text-center text-lg text-muted-foreground font-medium">
                          {currentImageIndex + 1} of {selectedEvent.images.length} photos
                        </div>
                      )}
                      
                      {/* Image Dots */}
                      {selectedEvent.images.length > 1 && (
                        <div className="flex justify-center space-x-3 pb-4">
                          {selectedEvent.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-4 h-4 rounded-full transition-colors ${
                                index === currentImageIndex 
                                  ? 'bg-warm-brown' 
                                  : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Full-Size Image Popup */}
      <Dialog open={imagePopupOpen} onOpenChange={setImagePopupOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-2 bg-black/95 border-none">
          {selectedEvent && selectedEvent.images.length > 0 && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={selectedEvent.images[currentImageIndex]}
                alt={`${selectedEvent.title} - Full Size Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              
              {/* Navigation for full-size images */}
              {selectedEvent.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white border border-white/20 backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={nextImage}
                    disabled={currentImageIndex === selectedEvent.images.length - 1}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white border border-white/20 backdrop-blur-sm"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              
              {/* Close button */}
              <Button
                variant="outline"
                size="sm"
                onClick={closeImagePopup}
                className="absolute top-4 right-4 bg-white/30 hover:bg-white/50 text-white border border-white/20 backdrop-blur-sm"
              >
                ✕
              </Button>
              
              {/* Image counter for full-size view */}
              {selectedEvent.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} of {selectedEvent.images.length}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}