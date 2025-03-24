import React, { useCallback, useEffect, useState } from "react";
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
import { tripListingService } from "@/services/tripListing.service";

const TripListing = () => {
  const [trips, setTrips] = useState([]);

  const fetchData = async () => {
    try {
      const tripData = await tripListingService.getAllTrips();
      if (tripData) {
        console.log(tripData);
        setTrips(tripData);
      }
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [dateField, setDateField] = useState(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm();

  // Reset form with data - for editing
  const resetForm = useCallback(
    (data) => {
      reset(
        data || {
          destination: "",
          start_date: new Date(),
          end_date: new Date(),
          status: "Planned",
          budget: 0,
        }
      );
    },
    [reset]
  );

  // Handle data update (both new and edit)
  const handleUpdateData = async (formData, id = null) => {
    if (id) {
      // Editing existing trip
      const tripData = await tripListingService.editTrip(_id, formData);

      console.log(tripData);

      fetchData();
    } else {
      // Adding new trip
      const tripData = await tripListingService.createTrip(formData);

      console.log(tripData);

      fetchData();
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
      key: "start_date",
      label: "Start Date",
      render: (value) => format(new Date(value), "PP"),
    },
    {
      key: "end_date",
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
      render: (value) => `$${value ?? ""}`,
    },
  ];

  // Render the form row (for editing or adding)
  const renderFormRow = () => {
    const formData = watch();

    return (
      <>
        <TableCell>
          <Input
            {...register("destination")}
            placeholder="Destination"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
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
                className="w-full justify-start text-left font-normal"
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
