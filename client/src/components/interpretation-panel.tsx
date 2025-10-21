import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GestureInterpretResponse, CommandStatus } from "@shared/schema";
import { Brain, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface InterpretationPanelProps {
  interpretation: GestureInterpretResponse | null;
  status: CommandStatus;
  className?: string;
}

const STATUS_CONFIG = {
  processing: {
    label: "Processing",
    icon: Clock,
    color: "bg-chart-3 text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  recognized: {
    label: "Recognized",
    icon: Brain,
    color: "bg-primary text-primary",
    bgColor: "bg-primary/10",
  },
  executed: {
    label: "Executed",
    icon: CheckCircle2,
    color: "bg-chart-2 text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  failed: {
    label: "Failed",
    icon: AlertCircle,
    color: "bg-destructive text-destructive",
    bgColor: "bg-destructive/10",
  },
};

export function InterpretationPanel({ interpretation, status, className = "" }: InterpretationPanelProps) {
  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            AI Interpretation
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`${config.bgColor} border-transparent`}
            data-testid="badge-status"
          >
            <StatusIcon className={`h-3 w-3 mr-1 ${config.color}`} />
            <span className={config.color}>{config.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {interpretation ? (
          <>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Detected Gesture
              </label>
              <p 
                className="text-lg font-medium leading-relaxed min-h-[3rem]" 
                data-testid="text-interpretation"
              >
                {interpretation.interpretedText}
              </p>
            </div>

            {interpretation.command && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Command
                </label>
                <Badge variant="secondary" className="font-mono text-xs" data-testid="badge-command">
                  {interpretation.command}
                </Badge>
              </div>
            )}

            {interpretation.actionDescription && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Action
                </label>
                <p className="text-sm text-muted-foreground" data-testid="text-action">
                  {interpretation.actionDescription}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Confidence
                </label>
                <span className="text-sm font-mono font-medium" data-testid="text-confidence">
                  {interpretation.confidence}%
                </span>
              </div>
              <Progress value={interpretation.confidence} className="h-2" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-4 mb-3">
              <Brain className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Waiting for gesture input...
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Enable camera and perform a gesture to start
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
