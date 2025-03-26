import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
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
import { menuManagementService } from "@/services/menuManagement.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [dateField, setDateField] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const orderData = await menuManagementService.getAllOrders();
      if (orderData) {
        console.log("Orders:", orderData);
        setOrders(orderData);
      }
    } catch (error) {
      console.error("Failed to fetch order data:", error);
      toast.error("Failed to load order data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const menuData = await menuManagementService.getAllMenus();
      if (menuData) {
        console.log("Menu items:", menuData);
        setMenuItems(menuData);
      }
    } catch (error) {
      console.error("Failed to fetch menu data:", error);
      toast.error("Failed to load menu items for selection. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  // Setup React Hook Form
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  // Reset form with data - for editing
  const resetForm = useCallback(
    (data) => {
      reset(
        data || {
          food_id: "",
          order_by_nic: "",
          qty: 1,
          orderDate: new Date(),
          status: "Pending",
        }
      );
    },
    [reset]
  );

  // Handle data update (both new and edit)
  const handleUpdateData = async (formData, _id = null) => {
    try {
      // Format the data
      const orderData = {
        ...formData,
        food:
          menuItems.find((item) => item._id === formData.food_id)?.food || "",
        price:
          menuItems.find((item) => item._id === formData.food_id)?.price || 0,
        date: formData.orderDate,
      };

      if (_id) {
        // Editing existing order
        const result = await orderManagementService.updateOrder(_id, orderData);
        console.log(result);
        toast.success("Order updated successfully!");
      } else {
        // Adding new order
        const result = await orderManagementService.createOrder(orderData);
        console.log(result);
        toast.success("New order added successfully!");
      }
      fetchOrders();
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update order data. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async (_id) => {
    try {
      await orderManagementService.deleteOrder(_id);
      setOrders(orders.filter((order) => order._id !== _id));
      toast.success("Order removed successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order. Please try again.");
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
      key: "food",
      label: "Food Item",
    },
    {
      key: "order_by_nic",
      label: "Customer NIC",
    },
    {
      key: "qty",
      label: "Quantity",
    },
    {
      key: "price",
      label: "Price",
      render: (value) => `Rs. ${value ?? 0}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium
          ${value === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
          ${value === "Processing" ? "bg-blue-100 text-blue-800" : ""}
          ${value === "Completed" ? "bg-green-100 text-green-800" : ""}
          ${value === "Cancelled" ? "bg-red-100 text-red-800" : ""}
        `}
        >
          {value}
        </span>
      ),
    },
    {
      key: "date",
      label: "Order Date",
      render: (value) => format(new Date(value), "PP"),
    },
  ];

  // Render the form row (for editing or adding)
  const renderFormRow = () => {
    const formData = watch();
    return (
      <>
        <TableCell>
          <Select
            onValueChange={(value) => setValue("food_id", value)}
            defaultValue={formData.food_id}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Food Item" />
            </SelectTrigger>
            <SelectContent>
              {menuItems.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.food} - Rs. {item.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            {...register("order_by_nic")}
            placeholder="Customer NIC"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("qty")}
            type="number"
            placeholder="Quantity"
            min="1"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          {/* Price is calculated automatically based on selected food */}
          <div className="py-2 px-3 border border-gray-200 rounded-md bg-gray-50">
            Rs.{" "}
            {menuItems.find((item) => item._id === formData.food_id)?.price ||
              0}
          </div>
        </TableCell>
        <TableCell>
          <Select
            onValueChange={(value) => setValue("status", value)}
            defaultValue={formData.status || "Pending"}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white"
                onClick={() => setDateField("orderDate")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.orderDate
                  ? format(new Date(formData.orderDate), "PP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  formData.orderDate ? new Date(formData.orderDate) : new Date()
                }
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Order Management
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
                data={orders}
                onUpdate={handleUpdateData}
                onDelete={handleDelete}
                renderFormRow={renderFormRow}
                formProviders={{
                  handleSubmit,
                  resetForm,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
