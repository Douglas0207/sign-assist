import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SensorData } from "@shared/schema";

interface SensorDashboardProps {
  sensorData: SensorData | null;
  className?: string;
}

const SENSOR_MAX = 1023; // Arduino analog read max value
const FINGER_NAMES = ["Thumb", "Index", "Middle", "Ring", "Pinky"] as const;

export function SensorDashboard({ sensorData, className = "" }: SensorDashboardProps) {
  const getSensorValue = (finger: string): number => {
    if (!sensorData) return 0;
    return sensorData[finger.toLowerCase() as keyof Omit<SensorData, "timestamp">] || 0;
  };

  const getSensorPercentage = (value: number): number => {
    return Math.round((value / SENSOR_MAX) * 100);
  };

  const getSensorColor = (percentage: number): string => {
    if (percentage < 30) return "bg-chart-1";
    if (percentage < 60) return "bg-chart-3";
    return "bg-chart-2";
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Flex Sensors
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Simulated Arduino sensor values (0-1023)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {FINGER_NAMES.map((finger) => {
          const value = getSensorValue(finger);
          const percentage = getSensorPercentage(value);
          
          return (
            <div key={finger} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{finger}</span>
                <span className="text-sm font-mono text-muted-foreground" data-testid={`text-sensor-${finger.toLowerCase()}`}>
                  {value}
                </span>
              </div>
              <Progress 
                value={percentage} 
                className="h-2"
                data-testid={`progress-sensor-${finger.toLowerCase()}`}
              />
            </div>
          );
        })}

        {!sensorData && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              No sensor data available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
