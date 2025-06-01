interface AudioEmbedProps {
  url: string;
  title: string;
  className?: string;
}

export function AudioEmbed({ url, title, className = "" }: AudioEmbedProps) {
  // Extract audio ID and platform from URL
  const getEmbedUrl = (url: string) => {
    // SoundCloud patterns
    const soundcloudRegex = /soundcloud\.com\/([^\/]+)\/([^\/\?]+)/;
    const soundcloudMatch = url.match(soundcloudRegex);
    
    if (soundcloudMatch) {
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23814923&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
    }
    
    // Spotify patterns  
    const spotifyRegex = /spotify\.com\/track\/([a-zA-Z0-9]+)/;
    const spotifyMatch = url.match(spotifyRegex);
    
    if (spotifyMatch) {
      return `https://open.spotify.com/embed/track/${spotifyMatch[1]}?utm_source=generator&theme=0`;
    }
    
    // YouTube patterns (for audio)
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1&showinfo=0`;
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg bg-black">
        <iframe
          src={embedUrl}
          title={title}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="absolute top-0 left-0 w-full h-full border-0"
        />
      </div>
    </div>
  );
}