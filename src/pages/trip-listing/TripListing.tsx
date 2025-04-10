import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { TableCell } from "@/components/ui/table";
import DataTable from "@/components/shared/DataTable";
import { tripListingService } from "@/services/tripListing.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TripListing = () => {
  const [trips, setTrips] = useState([]);
  const [dateField, setDateField] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const tripData = await tripListingService.getAllTrips();
      if (tripData) {
        console.log(tripData);
        setTrips(tripData);
      }
    } catch (error) {
      console.error("Failed to fetch trip data:", error);
      toast.error("Failed to load trip data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { register, handleSubmit, reset, setValue, watch } = useForm();

  // Reset form with data - for editing
  const resetForm = useCallback(
    (data) => {
      reset(
        data || {
          start_location: "",
          destination: "",
          start_date: new Date(),
          end_date: new Date(),
          status: "Planned",
          price: 0,
          bus_number: "",
        }
      );
    },
    [reset]
  );

  // Handle data update (both new and edit)
  const handleUpdateData = async (formData, _id = null) => {
    console.log(_id)
    try {
      if (_id) {
        // Editing existing trip
        const tripData = await tripListingService.editTrip(_id, formData);
        console.log(tripData);
        toast.success("Trip updated successfully!");
      } else {
        // Adding new trip
        const tripData = await tripListingService.createTrip(formData);
        console.log(tripData);
        toast.success("New trip added successfully!");
      }
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update trip data. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async (_id) => {
    try {
      // Here you would call your API to delete the trip
      // For now we're just updating the UI
      setTrips(trips.filter((trip) => trip._id !== _id));
      toast.success("Trip removed successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip. Please try again.");
    }
  };

  // Handle date selection in the calendar
  const handleDateSelect = (date) => {
    if (dateField) {
      setValue(dateField, date);
      setDateField(null);
    }
  };

  // Define columns for the reusable table
  const columns = [
    {
      key: "start_location",
      label: "Start Location",
    },
    {
      key: "destination",
      label: "Destination",
    },
    {
      key: "start_date",
      label: "Start Date",
      // render: (value) => format(new Date(value), "PP"),
    },
    {
      key: "end_date",
      label: "End Date",
      // render: (value) => format(new Date(value), "PP"),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium
          ${value === "Planned" ? "bg-blue-100 text-blue-800" : ""}
          ${value === "Confirmed" ? "bg-green-100 text-green-800" : ""}
          ${value === "Completed" ? "bg-purple-100 text-purple-800" : ""}
          ${value === "Cancelled" ? "bg-red-100 text-red-800" : ""}
        `}
        >
          {value}
        </span>
      ),
    },
    {
      key: "price",
      label: "Ticket Price (Rs)",
      render: (value) => `$${value ?? ""}`,
    },
    {
      key: "bus_number",
      label: "Bus Number",
    },
  ];

  // Render the form row (for editing or adding)
  const renderFormRow = () => {
    const formData = watch();

    return (
      <>
        <TableCell>
          <Input
            {...register("start_location")}
            placeholder="Start Location"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("destination")}
            placeholder="Destination"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white"
                onClick={() => setDateField("start_date")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.start_date
                  ? format(new Date(formData.start_date), "PP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.start_date)}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white"
                onClick={() => setDateField("end_date")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.end_date
                  ? format(new Date(formData.end_date), "PP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.end_date)}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </TableCell>
        <TableCell>
          <Select
            onValueChange={(value) => setValue("status", value)}
            defaultValue={formData.status}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            {...register("price")}
            type="number"
            placeholder="Ticket Price"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("bus_number")}
            type="text"
            placeholder="Bus Number"
            className="w-full bg-white"
          />
        </TableCell>
      </>
    );
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br bg-slate-500 relative">
      {/* Top nav buttons */}
      <div className="absolute top-4 right-4 flex space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start pt-16 px-4 md:px-8">
        {/* Back Button */}
        <div className="w-full max-w-6xl mb-4 flex justify-start">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl mb-8 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Trips Management
            </h1>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={trips}
                onUpdate={handleUpdateData}
                onDelete={handleDelete}
                renderFormRow={renderFormRow}
                formProviders={{
                  handleSubmit,
                  resetForm,
                }}
                addFormComponent={{
                  buttonLabel: (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Trip
                    </>
                  ),
                  renderForm: () => renderFormRow(),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripListing;
