import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/authService";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DriverDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await authService.getCurrentUser();
        console.log(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }

    fetchData();
  }, []);

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-500 flex flex-col items-center justify-center relative p-4">
      {/* Log Out Button */}
      <Button
        onClick={() => navigateTo("/login")}
        variant="secondary"
        className="absolute top-4 right-4 bg-gray-800 text-white hover:bg-gray-700"
      >
        Log Out
      </Button>

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {/* Header Card */}
        <Card className="w-full bg-gray-300 border-none">
          <CardHeader className="pb-2 pt-6">
            <CardTitle className="text-4xl font-bold text-center text-gray-800">
              Bus Staff
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Menu Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Button
            onClick={() => navigateTo("/user-account")}
            variant="outline"
            className="w-full py-6 text-lg bg-gray-300 border-none text-gray-700 hover:bg-gray-400 hover:text-gray-800"
          >
            User Account
          </Button>

          <Button
            onClick={() => navigateTo("/assigned-trips")}
            variant="outline"
            className="w-full py-6 text-lg bg-gray-300 border-none text-gray-700 hover:bg-gray-400 hover:text-gray-800"
          >
            Assigned Trips
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
