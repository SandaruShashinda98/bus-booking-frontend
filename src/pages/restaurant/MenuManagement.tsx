import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/shared/DataTable";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { TableCell } from "@/components/ui/table";
import { menuManagementService } from "@/services/menuManagement.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MenuManagement = () => {
  const [menu, setMenu] = useState([]);
  const [dateField, setDateField] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const menuData = await menuManagementService.getAllMenus();
      if (menuData) {
        console.log(menuData);
        setMenu(menuData);
      }
    } catch (error) {
      console.error("Failed to fetch menu data:", error);
      toast.error("Failed to load menu data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Setup React Hook Form
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  // Reset form with data - for editing
  const resetForm = useCallback(
    (data) => {
      reset(
        data || {
          food: "",
          ingredients: "",
          price: 40,
          date: new Date().getFullYear(),
        }
      );
    },
    [reset]
  );

  // Handle data update (both new and edit)
  const handleUpdateData = async (formData, _id = null) => {
    try {
      if (_id) {
        // Editing existing menu
        const menuData = await menuManagementService.editMenu(_id, formData);
        console.log(menuData);
        toast.success("Menu item updated successfully!");
      } else {
        // Adding new menu
        const menuData = await menuManagementService.createMenu(formData);
        console.log(menuData);
        toast.success("New menu item added successfully!");
      }
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update menu data. Please try again.");
    }
  };

  const handleDateSelect = (date) => {
    if (dateField) {
      setValue(dateField, date);
      setDateField(null);
    }
  };

  // Handle delete
  const handleDelete = async (_id) => {
    try {
      // Here you would call your API to delete the menu item
      // For now we're just updating the UI
      setMenu(menu.filter((food) => food._id !== _id));
      toast.success("Menu item removed successfully!");
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item. Please try again.");
    }
  };

  // Define columns for the reusable table
  const columns = [
    {
      key: "food",
      label: "Food",
    },
    {
      key: "ingredients",
      label: "Ingredients",
    },
    {
      key: "price",
      label: "Price",
      render: (value) => `Rs. ${value ?? 0}`,
    },
    {
      key: "date",
      label: "Date",
      render: (value) => format(new Date(value), "PP"),
    },
  ];

  // Render the form row (for editing or adding)
  const renderFormRow = () => {
    const formData = watch();
    return (
      <>
        <TableCell>
          <Input
            {...register("food")}
            placeholder="Food name"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("ingredients")}
            placeholder="Ingredients"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("price")}
            type="number"
            placeholder="Price"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white"
                onClick={() => setDateField("date")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date
                  ? format(new Date(formData.date), "PP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.date)}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </TableCell>
      </>
    );
  };

  const handleBackToDashboard = () => {
    navigate("/restaurant-dashboard");
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Menu Management
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
                data={menu}
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
                      Add New Food Item
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

export default MenuManagement;
