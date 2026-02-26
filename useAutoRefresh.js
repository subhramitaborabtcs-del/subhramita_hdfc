import { useEffect, useState, useRef } from "react";

export function useAutoRefresh(fetchCallback, intervalMs = 300000, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  // We use a ref for the callback to prevent the interval from 
  // resetting if the component re-renders
  const savedCallback = useRef(fetchCallback);
  useEffect(() => {
    savedCallback.current = fetchCallback;
  }, [fetchCallback]);

  useEffect(() => {
    let alive = true;
    let intervalId = null;

    const load = async (isInitial = false) => {
      if (isInitial) setLoading(true); // Only show spinner on first load
      
      try {
        const result = await savedCallback.current();
        if (!alive) return;
        setData(result);
        setError(null);
        setLastRefreshTime(new Date()); // ✅ AC1: Track refresh timestamp
      } catch (err) {
        if (!alive) return;
        setError(err.message || "Failed to load data");
      } finally {
        if (alive && isInitial) setLoading(false);
      }
    };

    load(true); // Initial load
    
    // ✅ AC1: Auto-refresh every 300 seconds (5 mins)
    intervalId = setInterval(() => load(false), intervalMs);

    return () => {
      alive = false;
      clearInterval(intervalId);
    };
  }, [intervalMs, ...dependencies]); // Include dependencies for time filter

  return { data, loading, error, lastRefreshTime };
}