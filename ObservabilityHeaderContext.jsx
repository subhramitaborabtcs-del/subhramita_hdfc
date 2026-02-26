import { createContext, useContext, useState } from "react";

const ObservabilityHeaderContext = createContext(null);

export function ObservabilityHeaderProvider({ children }) {
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [timeFilter, setTimeFilter] = useState("Last 24h");

  return (
    <ObservabilityHeaderContext.Provider
      value={{ selectedTab, setSelectedTab, timeFilter, setTimeFilter }}
    >
      {children}
    </ObservabilityHeaderContext.Provider>
  );
}

export function useObservabilityHeader() {
  const context = useContext(ObservabilityHeaderContext);
  if (!context) {
    throw new Error("useObservabilityHeader must be used within ObservabilityHeaderProvider");
  }
  return context;
}