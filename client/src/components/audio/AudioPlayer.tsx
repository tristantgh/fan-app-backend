import { useState, useRef, useEffect } from "react";
import { Howl } from "howler";
import { Play, Pause } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  title: string;
  description: string;
  audioUrl: string;
  iconBgColor?: "primary" | "secondary" | "accent" | "accent2";
}

export default function AudioPlayer({ 
  title, 
  description, 
  audioUrl,
  iconBgColor = "primary"
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const soundRef = useRef<Howl | null>(null);
  
  // Background color classes based on the prop
  const bgColorMap = {
    primary: "bg-black/10",
    secondary: "bg-black/10",
    accent: "bg-black/10",
    accent2: "bg-black/10"
  };
  
  const textColorMap = {
    primary: "text-black",
    secondary: "text-black",
    accent: "text-black",
    accent2: "text-black"
  };
  
  const buttonColorMap = {
    primary: "bg-black",
    secondary: "bg-black",
    accent: "bg-black",
    accent2: "bg-black"
  };
  
  useEffect(() => {
    // Initialize Howl
    soundRef.current = new Howl({
      src: [audioUrl],
      html5: true,
      onload: () => {
        setIsLoaded(true);
        setDuration(soundRef.current?.duration() || 0);
      },
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    });
    
    // Update time every 100ms while playing
    const interval = setInterval(() => {
      if (soundRef.current && isPlaying) {
        setCurrentTime(soundRef.current.seek());
      }
    }, 100);
    
    return () => {
      clearInterval(interval);
      soundRef.current?.unload();
    };
  }, [audioUrl]);
  
  const togglePlay = () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    if (!soundRef.current) return;
    
    const newPosition = value[0];
    soundRef.current.seek(newPosition);
    setCurrentTime(newPosition);
  };
  
  // Format time (seconds) to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-white border border-black rounded-md overflow-hidden p-4">
      <div className="flex items-center space-x-4">
        <div className={cn("w-16 h-16 rounded-sm flex-shrink-0 flex items-center justify-center", bgColorMap[iconBgColor])}>
          <i className={cn("ri-music-2-line text-2xl", textColorMap[iconBgColor])}></i>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-black uppercase tracking-wider">{title}</h3>
          <p className="text-sm text-black/70">{description}</p>
        </div>
        <div>
          <Button
            onClick={togglePlay}
            size="icon"
            className={cn("w-10 h-10 rounded-sm flex items-center justify-center", buttonColorMap[iconBgColor])}
            disabled={!isLoaded}
          >
            {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 ml-0.5 text-white" />}
          </Button>
        </div>
      </div>
      
      <div className="mt-4">
        <Slider
          value={[currentTime]}
          min={0}
          max={duration}
          step={0.1}
          onValueChange={handleSliderChange}
          className="h-1.5"
        />
        <div className="flex justify-between mt-1 text-xs text-black/70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
