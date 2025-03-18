import { authService } from "@/services/authService";
import React, { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    async function fetchData() {
      const user = await authService.getCurrentUser();
      console.log(user);
    }

    fetchData();
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
