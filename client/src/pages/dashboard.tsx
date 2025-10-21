import { useState, useEffect, useCallback, useRef } from "react";
import { VideoFeed } from "@/components/video-feed";
import { InterpretationPanel } from "@/components/interpretation-panel";
import { SensorDashboard } from "@/components/sensor-dashboard";
import { ControlPanel } from "@/components/control-panel";
import { CommandHistory } from "@/components/command-history";
import { ThemeToggle } from "@/components/theme-toggle";
import { Hand, Brain } from "lucide-react";
import { SensorData, GestureInterpretResponse, CommandExecution, CommandStatus } from "@shared/schema";
import { useWebSocket } from "@/hooks/use-websocket";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Dashboard() {
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentInterpretation, setCurrentInterpretation] = useState<GestureInterpretResponse | null>(null);
  const [currentStatus, setCurrentStatus] = useState<CommandStatus>("processing");
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [commandHistory, setCommandHistory] = useState<CommandExecution[]>([]);
  const interpretIntervalRef = useRef<NodeJS.Timeout>();
  
  const { toast } = useToast();
  const { isConnected, latestMessage } = useWebSocket(isRecognitionActive);
  const { speak } = useTextToSpeech(voiceEnabled);

  // Load command history from backend on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch('/api/gesture-history?limit=20');
        if (response.ok) {
          const data = await response.json();
          // Convert backend data to CommandExecution format
          const history: CommandExecution[] = data.map((item: any) => ({
            id: item.id,
            gestureType: "gesture",
            interpretedText: item.interpretedText,
            command: item.command,
            status: "executed" as CommandStatus,
            timestamp: item.timestamp,
            confidence: item.confidence,
          }));
          setCommandHistory(history);
        }
      } catch (error) {
        console.error("Failed to load command history:", error);
      }
    };
    loadHistory();
  }, []);

  // Handle WebSocket messages (sensor data)
  useEffect(() => {
    if (latestMessage?.type === "sensor_data" && latestMessage.data) {
      setSensorData(latestMessage.data);
    }
  }, [latestMessage]);

  // Automatically interpret gestures every 3 seconds when active
  useEffect(() => {
    if (isRecognitionActive) {
      interpretIntervalRef.current = setInterval(async () => {
        await interpretCurrentGesture();
      }, 3000);

      return () => {
        if (interpretIntervalRef.current) {
          clearInterval(interpretIntervalRef.current);
        }
      };
    } else {
      if (interpretIntervalRef.current) {
        clearInterval(interpretIntervalRef.current);
      }
    }
  }, [isRecognitionActive]);

  const interpretCurrentGesture = async () => {
    if (!sensorData) return;

    try {
      setCurrentStatus("processing");

      const response = await apiRequest<GestureInterpretResponse>(
        "POST",
        "/api/interpret-gesture",
        {
          sensorData,
          handLandmarks: [], // Will be populated when MediaPipe is integrated
          useSimulation: true, // Using sample interpretations for now
        }
      );

      setCurrentInterpretation(response);
      setCurrentStatus("recognized");

      // Speak the interpretation (invoke TTS)
      if (voiceEnabled && response.interpretedText) {
        speak(response.interpretedText);
      }

      // Add to command history
      const command: CommandExecution = {
        id: Date.now().toString(),
        gestureType: "gesture",
        interpretedText: response.interpretedText,
        command: response.command,
        status: "executed",
        timestamp: response.timestamp,
        confidence: response.confidence,
      };

      setCommandHistory((prev) => [command, ...prev].slice(0, 20));
      setCurrentStatus("executed");

      // Show success toast
      toast({
        title: "Gesture Recognized",
        description: response.interpretedText,
      });
    } catch (error) {
      console.error("Interpretation error:", error);
      setCurrentStatus("failed");
      toast({
        title: "Recognition Failed",
        description: "Unable to interpret gesture. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleRecognition = () => {
    setIsRecognitionActive((prev) => !prev);
    
    if (!isRecognitionActive) {
      setCurrentStatus("processing");
      toast({
        title: "Recognition Started",
        description: "Gesture recognition is now active",
      });
    } else {
      setCurrentInterpretation(null);
      setCurrentStatus("processing");
      setSensorData(null);
      if (interpretIntervalRef.current) {
        clearInterval(interpretIntervalRef.current);
      }
      toast({
        title: "Recognition Stopped",
        description: "Gesture recognition has been paused",
      });
    }
  };

  const handleCalibrate = () => {
    toast({
      title: "Calibration Started",
      description: "Please hold your hand in a neutral position...",
    });

    // Simulate calibration process
    setTimeout(() => {
      toast({
        title: "Calibration Complete",
        description: "Sensors have been calibrated successfully",
      });
    }, 2000);
  };

  const handleFrameCapture = useCallback((videoElement: HTMLVideoElement) => {
    // Hand detection logic with MediaPipe Hands
    // This will be implemented when MediaPipe library is integrated
    // For now, we're using the WebSocket sensor data
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Hand className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Sign Language AI Assistant</h1>
              <p className="text-xs text-muted-foreground">
                {isConnected ? "Connected" : "Offline"} • {commandHistory.length} gestures recognized
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Section - Video Feed */}
          <div className="lg:col-span-8 space-y-6">
            <VideoFeed
              isActive={isRecognitionActive}
              onFrameCapture={handleFrameCapture}
            />

            {/* Command History - Desktop */}
            <div className="hidden lg:block">
              <CommandHistory commands={commandHistory} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <InterpretationPanel
              interpretation={currentInterpretation}
              status={currentStatus}
            />

            <ControlPanel
              isRecognitionActive={isRecognitionActive}
              onToggleRecognition={handleToggleRecognition}
              voiceEnabled={voiceEnabled}
              onToggleVoice={() => setVoiceEnabled((prev) => !prev)}
              onCalibrate={handleCalibrate}
            />

            <SensorDashboard sensorData={sensorData} />
          </div>

          {/* Command History - Mobile */}
          <div className="lg:hidden lg:col-span-12">
            <CommandHistory commands={commandHistory} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4" />
              <span>Powered by OpenAI GPT-5</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Built for assistive communication technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
