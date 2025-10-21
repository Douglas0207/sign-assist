import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Play, Square, Sliders, Volume2, VolumeX } from "lucide-react";

interface ControlPanelProps {
  isRecognitionActive: boolean;
  onToggleRecognition: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onCalibrate: () => void;
  className?: string;
}

export function ControlPanel({
  isRecognitionActive,
  onToggleRecognition,
  voiceEnabled,
  onToggleVoice,
  onCalibrate,
  className = "",
}: ControlPanelProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button
            onClick={onToggleRecognition}
            className="w-full min-h-10"
            variant={isRecognitionActive ? "destructive" : "default"}
            data-testid={isRecognitionActive ? "button-stop-recognition" : "button-start-recognition"}
          >
            {isRecognitionActive ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Recognition
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Recognition
              </>
            )}
          </Button>

          <Button
            onClick={onCalibrate}
            variant="outline"
            className="w-full min-h-10"
            disabled={isRecognitionActive}
            data-testid="button-calibrate"
          >
            <Sliders className="h-4 w-4 mr-2" />
            Calibrate Sensors
          </Button>
        </div>

        <div className="pt-2 border-t space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-output" className="text-sm font-medium">
                Voice Output
              </Label>
              <p className="text-xs text-muted-foreground">
                Text-to-speech responses
              </p>
            </div>
            <div className="flex items-center gap-2">
              {voiceEnabled ? (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
              <Switch
                id="voice-output"
                checked={voiceEnabled}
                onCheckedChange={onToggleVoice}
                data-testid="switch-voice-output"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Hardware Status
            </p>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">Sensor Connection</span>
              <Badge variant="outline" className="bg-chart-2/10 border-chart-2/30">
                <div className="w-2 h-2 rounded-full bg-chart-2 mr-1.5" />
                <span className="text-chart-2">Simulated</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Badge({ children, className = "", variant = "default" }: { children: React.ReactNode; className?: string; variant?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </div>
  );
}
