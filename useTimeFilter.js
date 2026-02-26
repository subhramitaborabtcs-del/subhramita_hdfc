import { useCallback } from "react";
import { useObservabilityHeader } from "../context/ObservabilityHeaderContext";

/**
 * Custom hook to access and manage time filter state
 * across the application
 *
 * Usage:
 * const { timeFilter, setTimeFilter, getTimeRange } = useTimeFilter();
 */
export function useTimeFilter() {
  const { timeFilter, setTimeFilter } = useObservabilityHeader();

  // This function calculates exact Start and End timestamps based on the current selection
  const getTimeRange = useCallback(() => {
    const now = new Date();
    let startTime = new Date();
    let endTime = new Date(now); // Default end time is right now

    if (timeFilter === "Last 1h") {
      startTime = new Date(now.getTime() - 60 * 60 * 1000);
    } else if (timeFilter === "Last 24h") {
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (timeFilter === "Last 7d") {
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeFilter && timeFilter.includes("to")) {
      // It's a custom range string like "2026-02-01 to 2026-02-28"
      const [startStr, endStr] = timeFilter.split(" to ");
      
      startTime = new Date(startStr);
      // We set the start time to the very beginning of that day (00:00:00)
      startTime.setHours(0, 0, 0, 0);

      endTime = new Date(endStr);
      // We set the end time to the very end of that day (23:59:59)
      endTime.setHours(23, 59, 59, 999);
    } else {
      // Fallback default (Last 24h)
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    return {
      startTime: startTime.toISOString(), // e.g., "2026-02-26T00:00:00.000Z"
      endTime: endTime.toISOString(),     // e.g., "2026-02-28T23:59:59.999Z"
      // We also calculate the total milliseconds just in case your old logic still needs it!
      durationMs: endTime.getTime() - startTime.getTime() 
    };
  }, [timeFilter]);

  return {
    timeFilter,
    setTimeFilter,
    getTimeRange, 
  };
}