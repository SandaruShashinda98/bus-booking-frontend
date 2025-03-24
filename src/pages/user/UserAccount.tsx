import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";

const UserAccount = () => {
  const [userId, setUserId] = useState(0);

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

  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });

  const fetchData = async () => {
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
    }
  };

  useEffect(() => {
    fetchData();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await authService.editCurrentUser(userId, data);
      console.log(response);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message: "Failed to update profile. Please try again.",
      });
    }
  };

  return (
    <div className="bg-slate-800">
      <div className="w-full max-w-2xl mx-auto p-6 min-h-screen">
        <Card className="w-full">
          <CardHeader className="bg-slate-200 pb-4">
            <CardTitle className="text-3xl font-bold text-slate-800">
              User Account Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Display Alert if there is a message */}
            {submitStatus.message && (
              <Alert
                className={`mb-6 ${
                  submitStatus.success
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                <AlertDescription>{submitStatus.message}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4">
                {/* first name and last name */}
                <div className="flex justify-between gap-2">
                  <div className="w-full">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      {...register("first_name", {
                        required: "First Name is required",
                      })}
                      className="h-10"
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-sm">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      {...register("last_name")}
                      className="h-10"
                    />
                  </div>
                </div>

                {/* date of birth */}
                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    {...register("dob")}
                    className="h-10"
                  />
                </div>

                {/* employee id */}
                <div className="grid gap-2">
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input
                    id="employee_id"
                    {...register("employee_id")}
                    className="h-10"
                  />
                </div>

                {/* nic */}
                <div className="grid gap-2">
                  <Label htmlFor="nic">National ID/License Number</Label>
                  <Input id="nic" {...register("nic")} className="h-10" />
                </div>

                {/* contact number and email */}
                <div className="flex justify-between gap-2">
                  <div className="w-full">
                    <Label htmlFor="contact_number">Contact Number</Label>
                    <Input
                      id="contact_number"
                      {...register("contact_number")}
                      className="h-10"
                    />
                  </div>

                  <div className="w-full">
                    <Label htmlFor="email">Email</Label>
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
                      className="h-10"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* username */}
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    {...register("username")}
                    className="h-10"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* date of Joining */}
                <div className="grid gap-2">
                  <Label htmlFor="created_on">Date of Joining</Label>
                  <Input
                    id="created_on"
                    type="date"
                    {...register("created_on")}
                    disabled={true}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="px-8 border-slate-300"
                  onClick={() => window.history.back()}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-700 hover:bg-slate-800 px-8"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAccount;
