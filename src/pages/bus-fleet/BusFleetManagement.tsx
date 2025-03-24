import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/shared/DataTable";
import { TableCell } from "@/components/ui/table";
import { busFleetService } from "@/services/busFleet.service";

const BusFleetManagement = () => {
  const [buses, setBuses] = useState([]);

  const fetchData = async () => {
    try {
      const busData = await busFleetService.getAllFleet();
      if (busData) {
        console.log(busData);
        setBuses(busData);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Setup React Hook Form
  const { register, handleSubmit, reset } = useForm();

  // Reset form with data - for editing
  const resetForm = useCallback(
    (data) => {
      reset(
        data || {
          bus_number: "",
          make_model: "",
          year_of_manufacture: new Date().getFullYear(),
          seating_capacity: 40,
          facility_details: "",
          assigned_route: "",
          driver_conductor_linked: "",
        }
      );
    },
    [reset]
  );

  // Handle data update (both new and edit)
  const handleUpdateData = async (formData, _id = null) => {
    if (_id) {
      // Editing existing bus
      const busData = await busFleetService.editFleet(_id, formData);

      console.log(busData);

      fetchData();
    } else {
      // Adding new bus
      const busData = await busFleetService.createBusFleet(formData);

      console.log(busData);

      fetchData();
    }
  };

  // Handle delete
  const handleDelete = (_id) => {
    setBuses(buses.filter((bus) => bus._id !== _id));
  };

  // Define columns for the reusable table
  const columns = [
    {
      key: "bus_number",
      label: "Bus Number/License Plate",
    },
    {
      key: "make_model",
      label: "Make/Model",
    },
    {
      key: "year_of_manufacture",
      label: "Year of Manufacture",
    },
    {
      key: "seating_capacity",
      label: "Seating Capacity",
    },
    {
      key: "facility_details",
      label: "Facility Details",
    },
    {
      key: "assigned_route",
      label: "Assigned Route",
    },
    {
      key: "driver_conductor_linked",
      label: "Driver/Conductor Linked",
    },
  ];

  // Render the form row (for editing or adding)
  const renderFormRow = () => {
    return (
      <>
        <TableCell>
          <Input
            {...register("bus_number")}
            placeholder="KL-00-XX-0000"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("make_model")}
            placeholder="Make and Model"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("year_of_manufacture")}
            type="number"
            placeholder="Year"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("seating_capacity")}
            type="number"
            placeholder="Number of seats"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("facility_details")}
            placeholder="AC, WiFi, etc."
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("assigned_route")}
            placeholder="Route name"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("driver_conductor_linked")}
            placeholder="Staff names"
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
          <CardTitle className="text-center text-3xl">Bus Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={buses}
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
                  Add New Bus
                </>
              ),
              renderForm: () => renderFormRow(),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BusFleetManagement;
