import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoFeedProps {
  isActive: boolean;
  onFrameCapture?: (videoElement: HTMLVideoElement) => void;
  className?: string;
}

export function VideoFeed({ isActive, onFrameCapture, className = "" }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (isActive && !stream) {
      startCamera();
    } else if (!isActive && stream) {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      setStream(mediaStream);
      setHasPermission(true);
      setError("");

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Start frame capture loop
      captureFrames();
    } catch (err) {
      console.error("Camera access error:", err);
      setHasPermission(false);
      setError("Unable to access camera. Please grant camera permissions.");
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFrames = () => {
    if (videoRef.current && onFrameCapture && isActive) {
      onFrameCapture(videoRef.current);
      animationFrameRef.current = requestAnimationFrame(captureFrames);
    }
  };

  const requestPermission = () => {
    setError("");
    startCamera();
  };

  return (
    <div className={className}>
      <Card className="relative overflow-hidden bg-card border-card-border">
        <div className="aspect-video relative bg-black">
          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-background/95 backdrop-blur-sm z-10">
              <div className="text-center space-y-4 max-w-md">
                <div className="flex justify-center">
                  <div className="rounded-full bg-destructive/10 p-4">
                    <CameraOff className="h-8 w-8 text-destructive" />
                  </div>
                </div>
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={requestPermission} data-testid="button-enable-camera">
                  Enable Camera
                </Button>
              </div>
            </div>
          )}

          {!isActive && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="rounded-full bg-muted p-4">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Camera inactive</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            data-testid="video-webcam-feed"
          />

          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            data-testid="canvas-hand-overlay"
          />

          {isActive && stream && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-chart-2/20 border border-chart-2/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" data-testid="indicator-camera-active" />
              <span className="text-xs font-medium text-chart-2">Live</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
