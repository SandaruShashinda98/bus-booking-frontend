import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PlusCircle } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BusStaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const busStaffData = await busStaffListingService.getAllStaff();
      if (busStaffData) {
        console.log(busStaffData);
        setStaffMembers(busStaffData);
      }
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
      toast.error("Failed to load staff data. Please try again.");
    } finally {
      setIsLoading(false);
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
    try {
      if (_id) {
        // Editing existing bus
        const staffData = await busStaffListingService.editStaff(_id, formData);
        console.log(staffData);
        toast.success("Staff member updated successfully!");
      } else {
        // Adding new staff member
        const busData = await busStaffListingService.createBusStaff(formData);
        console.log(busData);
        toast.success("New staff member added successfully!");
      }
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update staff data. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async (_id) => {
    try {
      // Here you would call your API to delete the staff
      // For now we're just updating the UI
      setStaffMembers(staffMembers.filter((staff) => staff._id !== _id));
      toast.success("Staff member removed successfully!");
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff member. Please try again.");
    }
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
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("staff_name")}
            placeholder="Staff Name"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Select
            onValueChange={(value) => setValue("role", value)}
            defaultValue="Conductor"
          >
            <SelectTrigger className="w-full bg-white">
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
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("assigned_trip")}
            placeholder="Trip Code (assigned trip)"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("assigned_bus_number")}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Bus Staff Management
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusStaffManagement;
