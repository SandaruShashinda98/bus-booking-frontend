import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/shared/DataTable";
import { TableCell } from "@/components/ui/table";
import { userService } from "@/services/user.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const userData = await userService.filerUsers();
      if (userData) {
        console.log(userData);
        setUsers(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load user data. Please try again.");
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
          first_name: "",
          last_name: "",
          email: "",
          username: "",
          user_role: "User",
        }
      );
    },
    [reset]
  );

  // Handle data update (both new and edit)
  const handleUpdateData = async (formData, _id = null) => {
    try {
      if (_id) {
        // Editing existing user
        const userData = await userService.editUser(_id, formData);
        console.log(userData);
        toast.success("User details updated successfully!");
      } else {
        // Adding new user
        const userData = await userService.createUser(formData);
        console.log(userData);
        toast.success("New user added successfully!");
      }
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update user data. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async (_id) => {
    try {
      await userService.deleteUser(_id);
      setUsers(users.filter((user) => user._id !== _id));
      toast.success("User removed successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  // Define columns for the reusable table
  const columns = [
    {
      key: "first_name",
      label: "First Name",
    },
    {
      key: "last_name",
      label: "Last Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "username",
      label: "Username",
    },
    {
      key: "user_role",
      label: "Role",
    },
  ];

  // Filter users based on name and user_role filters
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const nameMatch =
      nameFilter === "" || fullName.includes(nameFilter.toLowerCase());
    const roleMatch =
      roleFilter === "" ||
      user.user_role.toLowerCase() === roleFilter.toLowerCase();

    return nameMatch && roleMatch;
  });

  // Render the form row (for editing or adding)
  const renderFormRow = () => {
    return (
      <>
        <TableCell>
          <Input
            {...register("first_name")}
            placeholder="First Name"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("last_name")}
            placeholder="Last Name"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("email")}
            placeholder="Email"
            type="email"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <Input
            {...register("username")}
            placeholder="Username"
            className="w-full bg-white"
          />
        </TableCell>
        <TableCell>
          <select
            {...register("user_role")}
            className="w-full h-10 bg-white border border-gray-300 rounded-md px-3"
          >
            {/* <option value="ADMIN">Admin</option> */}
            <option value="BUS_OWNER">Bus Owner</option>
            <option value="DRIVER">Driver</option>
            <option value="CONDUCTOR">Conductor</option>
            <option value="RESTAURANT">Restaurant</option>
          </select>
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              User Management
            </h1>
          </div>

          {/* Filters Section */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    placeholder="Filter by name..."
                    className="pl-10"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Filter className="h-4 w-4 text-gray-500" />
                  </div>
                  <select
                    className="w-full h-10 bg-white border border-gray-300 rounded-md pl-10 pr-4"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="BUS_OWNER">Bus Owner</option>
                    <option value="DRIVER">Driver</option>
                    <option value="CONDUCTOR">Conductor</option>
                    <option value="RESTAURANT">Restaurant</option>
                  </select>
                </div>
              </div>
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
                data={filteredUsers}
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
                      Add New User
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

export default UserManagement;
