import React, { useState, useCallback } from "react";
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

const BusStaffManagement = () => {
  // Sample staff data
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      staffId: "123456",
      staffName: "Mr ABC XYZ",
      role: "Conductor",
      contactInformation: "00000000",
      assignedTrip: "A01",
      busNumber: "123",
    },
    {
      id: 2,
      staffId: "234567",
      staffName: "Ms Jane Doe",
      role: "Driver",
      contactInformation: "11111111",
      assignedTrip: "B02",
      busNumber: "456",
    },
    {
      id: 3,
      staffId: "345678",
      staffName: "Mr John Smith",
      role: "Conductor",
      contactInformation: "22222222",
      assignedTrip: "C03",
      busNumber: "789",
    },
  ]);

  // Setup React Hook Form - moved outside of render functions
  const { register, handleSubmit, reset, setValue } = useForm();

  // Reset form with data - for editing
  const resetForm = useCallback(
    (data) => {
      reset(
        data || {
          staffId: "",
          staffName: "",
          role: "Conductor",
          contactInformation: "",
          assignedTrip: "",
          busNumber: "",
        }
      );
    },
    [reset]
  );

  // Handle data update (both new and edit)
  const handleUpdateData = (formData, id = null) => {
    if (id) {
      // Editing existing staff member
      setStaffMembers(
        staffMembers.map((staff) =>
          staff.id === id ? { ...staff, ...formData } : staff
        )
      );
    } else {
      // Adding new staff member
      const newStaff = {
        id: Math.max(0, ...staffMembers.map((s) => s.id)) + 1,
        ...formData,
      };
      setStaffMembers([...staffMembers, newStaff]);
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    setStaffMembers(staffMembers.filter((staff) => staff.id !== id));
  };

  // Define columns for the reusable table
  const columns = [
    {
      key: "staffId",
      label: "Staff ID",
    },
    {
      key: "staffName",
      label: "Staff Name",
    },
    {
      key: "role",
      label: "Role",
    },
    {
      key: "contactInformation",
      label: "Contact Information",
    },
    {
      key: "assignedTrip",
      label: "Assigned Trip",
    },
    {
      key: "busNumber",
      label: "Bus Number",
    },
  ];

  // Render the form row (for editing or adding)
  const renderFormRow = () => {
    return (
      <>
        <TableCell>
          <Input
            {...register("staffId")}
            placeholder="Staff ID"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("staffName")}
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
            {...register("contactInformation")}
            placeholder="Contact Number"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("assignedTrip")}
            placeholder="Trip Code"
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("busNumber")}
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
