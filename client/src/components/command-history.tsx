import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommandExecution, CommandStatus } from "@shared/schema";
import { CheckCircle2, Clock, XCircle, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CommandHistoryProps {
  commands: CommandExecution[];
  className?: string;
}

const STATUS_ICONS = {
  processing: Clock,
  recognized: ChevronRight,
  executed: CheckCircle2,
  failed: XCircle,
};

const STATUS_COLORS = {
  processing: "text-chart-3 bg-chart-3/10",
  recognized: "text-primary bg-primary/10",
  executed: "text-chart-2 bg-chart-2/10",
  failed: "text-destructive bg-destructive/10",
};

export function CommandHistory({ commands, className = "" }: CommandHistoryProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Command History</CardTitle>
        <p className="text-xs text-muted-foreground">
          Recent gesture interpretations and actions
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {commands.length > 0 ? (
            <div className="space-y-3">
              {commands.map((cmd) => {
                const StatusIcon = STATUS_ICONS[cmd.status];
                const statusColor = STATUS_COLORS[cmd.status];

                return (
                  <div
                    key={cmd.id}
                    className="flex gap-3 p-3 rounded-lg border bg-card hover-elevate"
                    data-testid={`history-item-${cmd.id}`}
                  >
                    <div className={`rounded-full p-2 ${statusColor} shrink-0 mt-0.5`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">
                          {cmd.interpretedText}
                        </p>
                        <span className="text-xs text-muted-foreground font-mono shrink-0">
                          {format(new Date(cmd.timestamp), "HH:mm:ss")}
                        </span>
                      </div>
                      {cmd.command && (
                        <Badge variant="secondary" className="text-xs font-mono">
                          {cmd.command}
                        </Badge>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          Confidence: {cmd.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-3">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No commands yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start recognition to see gesture history
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
