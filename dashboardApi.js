export const fetchDashboard = async () => {
  
  const response = await fetch("/dashboard.json");

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
};