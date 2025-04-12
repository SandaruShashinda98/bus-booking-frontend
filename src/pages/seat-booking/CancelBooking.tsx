import { bookingService } from "@/services/booking.service";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BookingCancellation = () => {
  // In a real application, you would need to install react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await bookingService.cancelBooking(data);

      setSubmitted(true);
      toast.info(" Your booking has been successfully cancelled.");
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
                Booking ID
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-200 rounded-md"
                {...register("booking_id", {
                  required: "Booking ID is required",
                })}
              />
              {errors.booking_id && (
                <p className="mt-1 text-red-300">{errors.booking_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-white text-xl mb-2">
                Seat Number
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-200 rounded-md"
                {...register("seat_number", {
                  required: "Seat number is required",
                  pattern: {
                    value: /^[A-Z0-9]{1,3}$/,
                    message: "Please enter a valid seat number",
                  },
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
                Passenger NIC / Passport Number
              </label>
              <input
                type="text"
                className="w-full p-3 bg-gray-200 rounded-md"
                {...register("nic", {
                  required: "Passenger ID is required",
                  pattern: {
                    value: /^[A-Z0-9]{6,12}$/i,
                    message: "Please enter a valid ID number",
                  },
                })}
              />
              {errors.nic && (
                <p className="mt-1 text-red-300">{errors.nic.message}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="block w-64 mx-auto bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-md transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingCancellation;
