import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DataTable from "@/components/shared/DataTable";
import { TableCell } from "@/components/ui/table";
import { busStaffListingService } from "@/services/busStaff.service";

const BusStaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState([]);

  const fetchData = async () => {
    try {
      const busStaffData = await busStaffListingService.getAllStaff();
      if (busStaffData) {
        console.log(busStaffData);
        setStaffMembers(busStaffData);
      }
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Setup React Hook Form - moved outside of render functions
  const { register, handleSubmit, reset, setValue } = useForm();

  // Reset form with data - for editing
  const resetForm = useCallback(
    (data) => {
      reset(
        data || {
          staff_id: "",
          staff_name: "",
          role: "Conductor",
          contact_number: "",
          assigned_trip: "",
          assigned_bus_number: "",
        }
      );
    },
    [reset]
  );

  // Handle data update (both new and edit)
  const handleUpdateData = async (formData, _id = null) => {
    if (_id) {
      // Editing existing bus
      const staffData = await busStaffListingService.editStaff(_id, formData);

      console.log(staffData);

      fetchData();
    } else {
      // Adding new staff member
      const busData = await busStaffListingService.createBusStaff(formData);

      console.log(busData);

      fetchData();
    }
  };

  // Handle delete
  const handleDelete = (_id) => {
    setStaffMembers(staffMembers.filter((staff) => staff._id !== _id));
  };

  // Define columns for the reusable table
  const columns = [
    {
      key: "staff_id",
      label: "Staff ID",
    },
    {
      key: "staff_name",
      label: "Staff Name",
    },
    {
      key: "role",
      label: "Role",
    },
    {
      key: "contact_number",
      label: "Contact Information",
    },
    {
      key: "assigned_trip",
      label: "Assigned Trip",
    },
    {
      key: "assigned_bus_number",
      label: "Bus Number",
    },
  ];

  // Render the form row (for editing or adding)
  const renderFormRow = () => {
    return (
      <>
        <TableCell>
          <Input
            {...register("staff_id")}
            placeholder="Staff ID"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("staff_name")}
            placeholder="Staff Name"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Select
            onValueChange={(value) => setValue("role", value)}
            defaultValue="Conductor"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Conductor">Conductor</SelectItem>
              <SelectItem value="Driver">Driver</SelectItem>
              <SelectItem value="Supervisor">Supervisor</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            {...register("contact_number")}
            placeholder="Contact Number"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("assigned_trip")}
            placeholder="Trip Code (assigned trip)"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("assigned_bus_number")}
            placeholder="Bus Number"
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
            Bus Staff Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={staffMembers}
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
                  Add New Staff
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

export default BusStaffManagement;
