import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomEvents } from "@/lib/constants/custom-events";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";

const LogLevel = {
  INFO: "INFO",
  WARNING: "WARNING",
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
} as const;

type LogEntry = {
  timestamp: string;
  level: keyof typeof LogLevel;
  message: string;
  details?: Record<string, any>;
};

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const createLogEntry = (
    level: keyof typeof LogLevel,
    message: string,
    details?: Record<string, any>,
  ): LogEntry => ({
    timestamp: new Date().toISOString(),
    level,
    message,
    details,
  });

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent;
    const eventType = event.type as CustomEvents;
    const details = customEvent.detail;

    let logEntry: LogEntry;

    // Special handling for direct log events
    if (eventType === CustomEvents.Log) {
      logEntry = createLogEntry(
        details.level || "INFO",
        details.message,
        details.details,
      );
    } else {
      // Handle other custom events
      switch (eventType) {
        case CustomEvents.CreateNode:
          logEntry = createLogEntry(
            "SUCCESS",
            `Created node of type: ${details.type}`,
            details,
          );
          break;
        case CustomEvents.DeleteNode:
          logEntry = createLogEntry(
            "INFO",
            `Deleted node: ${details.nodeId}`,
            details,
          );
          break;
        case CustomEvents.FocusNode:
          logEntry = createLogEntry(
            "INFO",
            `Focused node: ${details.nodeId}`,
            details,
          );
          break;
        case CustomEvents.RemoveConnections:
          logEntry = createLogEntry(
            "INFO",
            `Removed connections for node: ${details.nodeId}`,
            details,
          );
          break;
        default:
          logEntry = createLogEntry("INFO", `Event: ${eventType}`, details);
      }
    }

    setLogs((prevLogs) => [...prevLogs, logEntry]);
  };

  useEffect(() => {
    // Add listeners for all custom events
    Object.values(CustomEvents).forEach((eventName) => {
      window.addEventListener(eventName, handleCustomEvent);
    });

    // Initial log entry
    setLogs([createLogEntry("SUCCESS", "Logger initialized")]);

    return () => {
      // Clean up listeners
      Object.values(CustomEvents).forEach((eventName) => {
        window.removeEventListener(eventName, handleCustomEvent);
      });
    };
  }, []);

  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs, autoScroll]);

  const getLevelColor = (level: keyof typeof LogLevel) => {
    switch (level) {
      case "ERROR":
        return "bg-red-600/20 hover:bg-red-600/30 text-red-600 hover:border-red-600/60";
      case "WARNING":
        return "bg-amber-600/20 hover:bg-amber-600/30 text-amber-600 hover:border-amber-600/60";
      case "SUCCESS":
        return "bg-green-600/20 hover:bg-green-600/30 text-green-600 hover:border-green-600/60";
      default:
        return "bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:border-neutral-200";
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <span className="text-sm text-neutral-500">Auto-scroll</span>
            <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
          </label>
        </div>

        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <button
                onClick={clearLogs}
                className="px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
              >
                clear
              </button>
            </TooltipTrigger>
            <TooltipContent>Clear logs</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ScrollArea
        ref={scrollAreaRef}
        className="h-[342px] w-full cursor-default font-mono text-sm"
      >
        {logs.map((log, index) => (
          <div
            key={index}
            className={`whitespace-pre-wrap px-1 py-0.5 ${getLevelColor(log.level)} border-y border-transparent`}
          >
            [{log.timestamp}] {log.level}: {log.message}
            {log.details && Object.keys(log.details).length > 0 && (
              <>
                {"\n"}
                {JSON.stringify(log.details, null, 2)}
              </>
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default Logs;
