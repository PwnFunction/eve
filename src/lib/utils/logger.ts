import { CustomEvents } from "../constants/custom-events";

type LogLevel = "INFO" | "WARNING" | "ERROR" | "SUCCESS";

export const logger = {
  log: (message: string, details?: Record<string, any>) => {
    window.dispatchEvent(
      new CustomEvent(CustomEvents.Log, {
        detail: {
          level: "INFO",
          message,
          details,
        },
      }),
    );
  },

  warn: (message: string, details?: Record<string, any>) => {
    window.dispatchEvent(
      new CustomEvent(CustomEvents.Log, {
        detail: {
          level: "WARNING",
          message,
          details,
        },
      }),
    );
  },

  error: (message: string, details?: Record<string, any>) => {
    window.dispatchEvent(
      new CustomEvent(CustomEvents.Log, {
        detail: {
          level: "ERROR",
          message,
          details,
        },
      }),
    );
  },

  success: (message: string, details?: Record<string, any>) => {
    window.dispatchEvent(
      new CustomEvent(CustomEvents.Log, {
        detail: {
          level: "SUCCESS",
          message,
          details,
        },
      }),
    );
  },

  custom: (level: LogLevel, message: string, details?: Record<string, any>) => {
    window.dispatchEvent(
      new CustomEvent(CustomEvents.Log, {
        detail: {
          level,
          message,
          details,
        },
      }),
    );
  },
};
