import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/shared/DataTable";
import { TableCell } from "@/components/ui/table";
import { busFleetService } from "@/services/busFleet.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BusFleetManagement = () => {
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const busData = await busFleetService.getAllFleet();
      if (busData) {
        console.log(busData);
        setBuses(busData);
      }
    } catch (error) {
      console.error("Failed to fetch fleet data:", error);
      toast.error("Failed to load bus fleet data. Please try again.");
    } finally {
      setIsLoading(false);
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
    try {
      if (_id) {
        // Editing existing bus
        const busData = await busFleetService.editFleet(_id, formData);
        console.log(busData);
        toast.success("Bus details updated successfully!");
      } else {
        // Adding new bus
        const busData = await busFleetService.createBusFleet(formData);
        console.log(busData);
        toast.success("New bus added to fleet successfully!");
      }
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update bus data. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async (_id) => {
    try {
      // Here you would call your API to delete the bus
      // For now we're just updating the UI
      setBuses(buses.filter((bus) => bus._id !== _id));
      toast.success("Bus removed from fleet successfully!");
    } catch (error) {
      console.error("Error deleting bus:", error);
      toast.error("Failed to delete bus. Please try again.");
    }
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
    // {
    //   key: "assigned_route",
    //   label: "Assigned Route",
    // },
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
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("make_model")}
            placeholder="Make and Model"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("year_of_manufacture")}
            type="number"
            placeholder="Year"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("seating_capacity")}
            type="number"
            placeholder="Number of seats"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("facility_details")}
            placeholder="AC, WiFi, etc."
            className="w-full bg-white"
          />
        </TableCell>
        {/* <TableCell>
          <Input
            {...register("assigned_route")}
            placeholder="Route name"
            className="w-full bg-white"
          />
        </TableCell> */}
        <TableCell>
          <Input
            {...register("driver_conductor_linked")}
            placeholder="Staff names"
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 relative">
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
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              Bus Fleet Management
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusFleetManagement;
