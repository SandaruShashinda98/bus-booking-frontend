import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const TripListing = () => {
  // Sample initial data
  const [trips, setTrips] = useState([
    {
      id: 1,
      destination: "Paris",
      startDate: new Date(2025, 3, 15),
      endDate: new Date(2025, 3, 22),
      status: "Planned",
      budget: 2500,
    },
    {
      id: 2,
      destination: "Tokyo",
      startDate: new Date(2025, 5, 10),
      endDate: new Date(2025, 5, 20),
      status: "Confirmed",
      budget: 3800,
    },
    {
      id: 3,
      destination: "New York",
      startDate: new Date(2025, 7, 5),
      endDate: new Date(2025, 7, 12),
      status: "Completed",
      budget: 3000,
    },
  ]);

  // State for date pickers
  const [dateField, setDateField] = useState(null);

  // Setup React Hook Form - moved outside of render functions
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  // Reset form with data - for editing
  const resetForm = useCallback(
    (data) => {
      reset(
        data || {
          destination: "",
          startDate: new Date(),
          endDate: new Date(),
          status: "Planned",
          budget: 0,
        }
      );
    },
    [reset]
  );

  // Handle data update (both new and edit)
  const handleUpdateData = (formData, id = null) => {
    if (id) {
      // Editing existing trip
      setTrips(
        trips.map((trip) => (trip.id === id ? { ...trip, ...formData } : trip))
      );
    } else {
      // Adding new trip
      const newTrip = {
        id: Math.max(0, ...trips.map((t) => t.id)) + 1,
        ...formData,
      };
      setTrips([...trips, newTrip]);
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    setTrips(trips.filter((trip) => trip.id !== id));
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
      key: "destination",
      label: "Destination",
    },
    {
      key: "startDate",
      label: "Start Date",
      render: (value) => format(new Date(value), "PP"),
    },
    {
      key: "endDate",
      label: "End Date",
      render: (value) => format(new Date(value), "PP"),
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
      key: "budget",
      label: "Budget ($)",
      render: (value) => `$${value.toLocaleString()}`,
    },
  ];

  // Render the form row (for editing or adding)
  const renderFormRow = (trip) => {
    const formData = watch();

    return (
      <>
        <TableCell>
          <Input
            {...register("destination")}
            placeholder="Destination"
            disabled={true}
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setDateField("startDate")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate
                  ? format(new Date(formData.startDate), "PP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.startDate)}
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
                className="w-full justify-start text-left font-normal"
                onClick={() => setDateField("endDate")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate
                  ? format(new Date(formData.endDate), "PP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.endDate)}
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
            <SelectTrigger>
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
            {...register("budget")}
            type="number"
            placeholder="Budget"
            className="w-full"
          />
        </TableCell>
      </>
    );
  };

  return (
    <div className="flex mx-auto p-8 m-8">
      <Card className="w-full">
        <CardHeader className="bg-slate-700 text-white py-6">
          <CardTitle className="text-center text-3xl">
            Trips Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
              renderForm: () => renderFormRow(null),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TripListing;
