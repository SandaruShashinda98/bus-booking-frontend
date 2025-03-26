import React from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchTrips = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    navigate(`/available?from=${data.from}&to=${data.to}&date=${data.date}`);
  };

  const cancelBooking = () => {
    navigate(`/cancel-booking`);
  };

  const login = () => {
    navigate(`/login`);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Top right buttons container */}
      <div className="absolute top-4 right-4 flex space-x-4">
        <button
          onClick={cancelBooking}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Cancel Booking
        </button>
        <button
          onClick={login}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </div>

      {/* Main content - centered card */}
      <div className="flex-1 flex items-center justify-center bg-slate-500 p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800  rounded-xl text-white">
            <CardTitle className="text-2xl font-bold">Bus Buddy</CardTitle>
            <CardDescription className="text-blue-100">
              Journey In Style
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from" className="font-medium">
                  From Destination
                </Label>
                <Input
                  id="from"
                  placeholder="Enter starting point"
                  className="h-10"
                  {...register("from")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="to" className="font-medium">
                  To Destination
                </Label>
                <Input
                  id="to"
                  placeholder="Enter destination"
                  className="h-10"
                  {...register("to")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="font-medium">
                  Date
                </Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    className="h-10 pl-4"
                    {...register("date")}
                  />
                  <Calendar
                    className="absolute right-3 top-2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Search
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-gray-50 px-6 py-3 flex justify-between items-center rounded-xl">
            <p className="text-sm text-gray-500">
              Find the best bus routes for your journey
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SearchTrips;
