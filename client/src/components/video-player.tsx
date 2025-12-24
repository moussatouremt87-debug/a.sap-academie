import { useEffect, useRef, useState, useCallback } from "react";
import { Progress } from "@/components/ui/progress";

interface VideoPlayerProps {
  videoUrl: string;
  videoProvider: "youtube" | "vimeo" | "custom";
  title: string;
  initialPosition?: number;
  onProgress?: (watchedPercent: number, lastPositionSeconds: number) => void;
  onComplete?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    Vimeo: any;
  }
}

export function VideoPlayer({ 
  videoUrl, 
  videoProvider, 
  title,
  initialPosition = 0,
  onProgress,
  onComplete 
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const lastReportedRef = useRef<{ percent: number; time: number }>({ percent: 0, time: 0 });

  const extractVideoId = useCallback((url: string, provider: string): string => {
    if (provider === "youtube" || url.includes("youtube.com") || url.includes("youtu.be")) {
      if (url.includes("youtu.be")) {
        return url.split("/").pop()?.split("?")[0] || "";
      }
      const match = url.match(/[?&]v=([^&]+)/);
      return match ? match[1] : "";
    }
    if (provider === "vimeo" || url.includes("vimeo.com")) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : url.split("/").pop() || "";
    }
    return "";
  }, []);

  const reportProgress = useCallback((percent: number, timeSeconds: number) => {
    if (Math.abs(percent - lastReportedRef.current.percent) >= 5 || 
        Math.abs(timeSeconds - lastReportedRef.current.time) >= 10) {
      lastReportedRef.current = { percent, time: timeSeconds };
      onProgress?.(Math.round(percent), Math.round(timeSeconds));
    }
  }, [onProgress]);

  useEffect(() => {
    if (progress >= 90 && !hasCompleted && duration > 0) {
      setHasCompleted(true);
      onComplete?.();
    }
  }, [progress, hasCompleted, duration, onComplete]);

  useEffect(() => {
    const provider = videoProvider || (videoUrl.includes("vimeo") ? "vimeo" : "youtube");
    const videoId = extractVideoId(videoUrl, provider);
    
    if (!videoId || !containerRef.current) return;

    if (provider === "youtube" || videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      const loadYouTubeAPI = () => {
        if (!document.getElementById("youtube-api")) {
          const script = document.createElement("script");
          script.id = "youtube-api";
          script.src = "https://www.youtube.com/iframe_api";
          document.body.appendChild(script);
        }
      };

      const initPlayer = () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div id="yt-player-${videoId}"></div>`;
          
          playerRef.current = new window.YT.Player(`yt-player-${videoId}`, {
            videoId,
            playerVars: {
              autoplay: 0,
              rel: 0,
              modestbranding: 1,
              start: Math.floor(initialPosition)
            },
            events: {
              onReady: (event: any) => {
                setDuration(event.target.getDuration());
              },
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  const interval = setInterval(() => {
                    if (playerRef.current && playerRef.current.getCurrentTime) {
                      const time = playerRef.current.getCurrentTime();
                      const dur = playerRef.current.getDuration();
                      if (dur > 0) {
                        const pct = (time / dur) * 100;
                        setCurrentTime(time);
                        setProgress(pct);
                        reportProgress(pct, time);
                      }
                    }
                  }, 2000);
                  
                  (playerRef.current as any)._progressInterval = interval;
                } else if ((playerRef.current as any)?._progressInterval) {
                  clearInterval((playerRef.current as any)._progressInterval);
                }
              }
            }
          });
        }
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        loadYouTubeAPI();
        window.onYouTubeIframeAPIReady = initPlayer;
      }
    } else if (provider === "vimeo" || videoUrl.includes("vimeo.com")) {
      const loadVimeoAPI = () => {
        if (!document.getElementById("vimeo-api")) {
          const script = document.createElement("script");
          script.id = "vimeo-api";
          script.src = "https://player.vimeo.com/api/player.js";
          script.onload = initVimeoPlayer;
          document.body.appendChild(script);
        } else if (window.Vimeo) {
          initVimeoPlayer();
        }
      };

      const initVimeoPlayer = () => {
        if (containerRef.current && window.Vimeo) {
          containerRef.current.innerHTML = "";
          
          const iframe = document.createElement("iframe");
          iframe.src = `https://player.vimeo.com/video/${videoId}?api=1`;
          iframe.className = "w-full h-full";
          iframe.allow = "autoplay; fullscreen; picture-in-picture";
          iframe.allowFullscreen = true;
          containerRef.current.appendChild(iframe);

          playerRef.current = new window.Vimeo.Player(iframe);
          
          playerRef.current.getDuration().then((dur: number) => {
            setDuration(dur);
          });

          if (initialPosition > 0) {
            playerRef.current.setCurrentTime(initialPosition);
          }

          playerRef.current.on("timeupdate", (data: { seconds: number; percent: number; duration: number }) => {
            const pct = data.percent * 100;
            setCurrentTime(data.seconds);
            setProgress(pct);
            setDuration(data.duration);
            reportProgress(pct, data.seconds);
          });
        }
      };

      loadVimeoAPI();
    } else {
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <iframe 
            src="${videoUrl}" 
            class="w-full h-full" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            title="${title}"
          ></iframe>
        `;
      }
    }

    return () => {
      if ((playerRef.current as any)?._progressInterval) {
        clearInterval((playerRef.current as any)._progressInterval);
      }
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoUrl, videoProvider, initialPosition, extractVideoId, reportProgress, title]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-2">
      <div 
        ref={containerRef}
        className="aspect-video bg-black rounded-lg overflow-hidden"
      />
      
      {duration > 0 && (
        <div className="flex items-center gap-2">
          <Progress value={progress} className="flex-1" />
          <span className="text-xs text-muted-foreground min-w-[5rem] text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      )}
    </div>
  );
}
