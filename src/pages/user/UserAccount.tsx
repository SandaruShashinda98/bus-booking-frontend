import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserAccount = () => {
  const [userId, setUserId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      dob: "",
      employee_id: "",
      nic: "",
      contact_number: "",
      username: "",
      created_on: "",
      email: "",
    },
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUserId(userData._id);
        setValue("first_name", userData.first_name);
        setValue("last_name", userData.last_name);
        setValue("dob", userData.dob);
        setValue("employee_id", userData.employee_id);
        setValue("nic", userData.nic);
        setValue("contact_number", userData.contact_number);
        setValue("username", userData.username);
        setValue("created_on", userData.created_on);
        setValue("email", userData.email);
      }
      console.log(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load user profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await authService.editCurrentUser(userId, data);
      console.log(response);
      toast.success("Profile updated successfully!");
      // Navigate back to search after successful update
      // setTimeout(() => {
      //   navigate("/search");
      // }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleBackToSearch = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br bg-slate-500 relative">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start pt-8 px-4 md:px-8">
        {/* Back Button */}
        <div className="w-full max-w-2xl mb-4 flex justify-start">
          <button
            onClick={handleBackToSearch}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
              <span className="bg-blue-600 text-white p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </span>
              User Account Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your personal information and account settings
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-4">
                {/* first name and last name */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="w-full space-y-1">
                    <Label htmlFor="first_name" className="text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="first_name"
                      {...register("first_name", {
                        required: "First Name is required",
                      })}
                      className="h-10 bg-white"
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-xs">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full space-y-1">
                    <Label htmlFor="last_name" className="text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="last_name"
                      {...register("last_name")}
                      className="h-10 bg-white"
                    />
                  </div>
                </div>

                {/* date of birth */}
                <div className="space-y-1">
                  <Label htmlFor="dob" className="text-gray-700">
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    {...register("dob")}
                    className="h-10 bg-white"
                  />
                </div>

                {/* employee id */}
                <div className="space-y-1">
                  <Label htmlFor="employee_id" className="text-gray-700">
                    Employee ID
                  </Label>
                  <Input
                    id="employee_id"
                    {...register("employee_id")}
                    className="h-10 bg-white"
                  />
                </div>

                {/* nic */}
                <div className="space-y-1">
                  <Label htmlFor="nic" className="text-gray-700">
                    National ID/License Number
                  </Label>
                  <Input
                    id="nic"
                    {...register("nic")}
                    className="h-10 bg-white"
                  />
                </div>

                {/* contact number and email */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="w-full space-y-1">
                    <Label htmlFor="contact_number" className="text-gray-700">
                      Contact Number
                    </Label>
                    <Input
                      id="contact_number"
                      {...register("contact_number")}
                      className="h-10 bg-white"
                    />
                  </div>

                  <div className="w-full space-y-1">
                    <Label htmlFor="email" className="text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      disabled={true}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid Email",
                        },
                      })}
                      className="h-10 bg-gray-100"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* username */}
                <div className="space-y-1">
                  <Label htmlFor="username" className="text-gray-700">
                    Username
                  </Label>
                  <Input
                    id="username"
                    {...register("username")}
                    className="h-10 bg-white"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* date of Joining */}
                <div className="space-y-1">
                  <Label htmlFor="created_on" className="text-gray-700">
                    Date of Joining
                  </Label>
                  <Input
                    id="created_on"
                    type="date"
                    {...register("created_on")}
                    disabled={true}
                    className="h-10 bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleBackToSearch}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
