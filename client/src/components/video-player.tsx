import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VideoPlayerProps {
  videoUrl: string;
  videoProvider: "youtube" | "vimeo" | "custom";
  title: string;
  initialPosition?: number;
  onProgress?: (percent: number, position: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ 
  videoUrl, 
  videoProvider, 
  title,
  initialPosition = 0,
  onProgress,
  onComplete 
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  const getEmbedUrl = useCallback((url: string, provider: string) => {
    if (provider === "youtube" || url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtu.be")) {
        videoId = url.split("/").pop() || "";
      } else if (url.includes("youtube.com")) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get("v") || "";
      }
      const startTime = initialPosition > 0 ? `&start=${Math.floor(initialPosition)}` : "";
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0${startTime}`;
    }
    
    if (provider === "vimeo" || url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      return `https://player.vimeo.com/video/${videoId}?api=1`;
    }
    
    return url;
  }, [initialPosition]);

  const embedUrl = getEmbedUrl(videoUrl, videoProvider);

  useEffect(() => {
    if (progress >= 90 && !hasCompleted) {
      setHasCompleted(true);
      onComplete?.();
    }
    
    if (onProgress && progress > 0) {
      onProgress(progress, progress);
    }
  }, [progress, hasCompleted, onComplete, onProgress]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && progress < 100) {
        setProgress(prev => Math.min(prev + 1, 100));
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  return (
    <div className="space-y-2">
      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={title}
          onLoad={() => setIsPlaying(true)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Progress value={progress} className="flex-1" />
        <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
