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
import { Calendar as CalendarIcon, PlusCircle, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthGuard from "@/contexts/AuthGuardContext";

const MenuManagement = () => {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [dateField, setDateField] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "veg", "non-veg"
  const navigate = useNavigate();
  const { user } = useAuthGuard();

  // List of common non-vegetarian ingredients
  const nonVegIngredients = [
    "chicken", "beef", "pork", "mutton", "fish", "shrimp", "prawn", "seafood", 
    "meat", "lamb", "bacon", "ham", "sausage", "egg", "eggs", "turkey", "duck",
    "crab", "lobster", "oyster", "squid", "anchovies", "salami", "pepperoni"
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const menuData = await menuManagementService.getAllMenus();
      if (menuData) {
        console.log(menuData);
        setMenu(menuData);
        setFilteredMenu(menuData); // Initialize filtered menu with all items
      }
    } catch (error) {
      console.error("Failed to fetch menu data:", error);
      toast.error("Failed to load menu data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if an item is vegetarian based on its ingredients
  const isVegetarian = (item) => {
    if (!item.ingredients) return true; // If no ingredients listed, assume vegetarian
    
    const ingredientsLower = item.ingredients.toLowerCase();
    return !nonVegIngredients.some(ingredient => 
      ingredientsLower.includes(ingredient.toLowerCase())
    );
  };

  // Apply filter based on vegetarian status
  const applyFilter = (filter) => {
    setActiveFilter(filter);
    
    if (filter === "all") {
      setFilteredMenu(menu);
    } else if (filter === "veg") {
      setFilteredMenu(menu.filter(item => isVegetarian(item)));
    } else if (filter === "non-veg") {
      setFilteredMenu(menu.filter(item => !isVegetarian(item)));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update filtered menu when menu changes
  useEffect(() => {
    applyFilter(activeFilter);
  }, [menu]);

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
          date: new Date(),
          is_available: true, // Added is_available field with default value
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

  // Toggle availability function
  const toggleAvailability = (item) => {
    const updatedItem = { ...item, is_available: !item.is_available };
    handleUpdateData(updatedItem, item._id);
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
      key: "veg_status",
      label: "Type",
      render: (_, item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isVegetarian(item) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isVegetarian(item) ? 'Veg' : 'Non-Veg'}
        </span>
      ),
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
    {
      key: "is_available",
      label: "Available",
      render: (value, item) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={value ?? false}
            onChange={() => toggleAvailability(item)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white"
          />
          <span className="ml-2">{value ? "Yes" : "No"}</span>
        </div>
      ),
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
          <span className="text-gray-400">Auto-detected</span>
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
                selected={formData.date ? new Date(formData.date) : new Date()}
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register("is_available")}
              defaultChecked={true}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2">Available</span>
          </div>
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
              Menu Management - {`${user?.first_name} ${user?.last_name}`}
            </h1>
          </div>
          
          {/* Filter Controls */}
          <div className="px-6 pt-4 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            <span className="mr-4 font-medium">Filter:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => applyFilter("all")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  activeFilter === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => applyFilter("veg")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  activeFilter === "veg"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Vegetarian
              </button>
              <button
                onClick={() => applyFilter("non-veg")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  activeFilter === "non-veg"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Non-Vegetarian
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredMenu}
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