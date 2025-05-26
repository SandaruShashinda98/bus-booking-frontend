import { bookingService } from "@/services/booking.service";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BookingCancellation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange" // Enable real-time validation
  });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await bookingService.cancelBooking(data);

      setSubmitted(true);
      toast.info("Your booking has been successfully cancelled.");
    } catch {
      toast.error("Data not found. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-500 p-6 text-white">
        <div className="max-w-md w-full bg-white bg-opacity-10 rounded-lg p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Booking Cancelled
          </h2>
          <p className="text-center mb-6">
            Your booking has been successfully cancelled.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-500">
      {/* Booking cancellation form */}
      <div className="relative w-full max-w-md px-6 z-10">
        <div className="w-full">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Booking Cancellation
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-white text-xl mb-2">
                Booking ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-200 rounded-md"
                placeholder="Enter your booking ID"
                {...register("booking_id", {
                  required: "Booking ID is required",
                  minLength: {
                    value: 1,
                    message: "Booking ID cannot be empty"
                  },
                  validate: value => value.trim() !== "" || "Booking ID cannot be empty"
                })}
              />
              {errors.booking_id && (
                <p className="mt-1 text-red-300">{errors.booking_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white text-xl mb-2">
                Seat Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-200 rounded-md"
                placeholder="e.g: 12"
                {...register("seat_number", {
                  required: "Seat number is required",
                  minLength: {
                    value: 1,
                    message: "Seat number cannot be empty"
                  },
                  pattern: {
                    value: /^[A-Z0-9]{1,3}$/i,
                    message: "Please enter a valid seat number (1-3 characters, letters and numbers only)",
                  },
                  validate: value => value.trim() !== "" || "Seat number cannot be empty"
                })}
              />
              {errors.seat_number && (
                <p className="mt-1 text-red-300">
                  {errors.seat_number.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-white text-xl mb-2">
                Passenger NIC / Passport Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-200 rounded-md"
                placeholder="Enter NIC or Passport number"
                {...register("nic", {
                  required: "Passenger ID is required",
                  minLength: {
                    value: 1,
                    message: "ID must be at least 6 characters long"
                  },
                  maxLength: {
                    value: 12,
                    message: "ID must be no more than 12 characters long"
                  },
                  validate: value => value.trim() !== "" || "Passenger ID cannot be empty"
                })}
              />
              {errors.nic && (
                <p className="mt-1 text-red-300">{errors.nic.message}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="block w-64 mx-auto bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-white text-sm opacity-75">
              <span className="text-red-400">*</span> All fields are required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCancellation;