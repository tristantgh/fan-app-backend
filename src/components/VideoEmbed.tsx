interface VideoEmbedProps {
  url: string;
  title: string;
  className?: string;
}

export function VideoEmbed({ url, title, className = "" }: VideoEmbedProps) {
  // Extract video ID and platform from URL
  const getEmbedUrl = (url: string) => {
    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1&showinfo=0`;
    }
    
    // Vimeo patterns
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`;
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
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
        />
      </div>
    </div>
  );
}