import { useEffect, useState } from "react";
import { getDashboardData } from "../api/dashboardApi";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getDashboardData();
      setData(result);
    };

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Total Users: {data.totalUsers}</h1>
      <h1>Active Users: {data.activeUsers}</h1>
    </div>
  );
}

export default Dashboard;