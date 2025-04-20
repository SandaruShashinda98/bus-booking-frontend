import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { tripListingService } from "@/services/tripListing.service";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const SeatBookingFromEmail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [passengerBooking, setPassengerBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("booking_id");
  const nicFromQuery = queryParams.get("nic");
  const tripId = queryParams.get("trip_id") || params?.tripID;

  const form = useForm({
    defaultValues: {
      passenger_name: "",
      pick_up_location: "",
      drop_location: "",
      contact_no: "",
      email: "",
      guardian_contact: "",
      special_instructions: "",
      nic: nicFromQuery || "",
    },
  });

  // const nic = form.watch("nic");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // If tripId is available (either from params or query)
      if (tripId) {
        const data = await tripListingService.getSingleTrip(tripId);
        setTripData(data);

        if (data) {
          // Get all currently booked seats
          const seatNumbers = data.booked_seats?.map(
            (seat) => seat?.seat_number
          );
          setBookedSeats(seatNumbers || []);

          // If we have a nicFromQuery, we're in edit mode
          if (nicFromQuery) {
            setIsEditMode(true);

            // Find the booking(s) for this NIC
            const userBookings = data.booked_seats?.filter(
              (booking) => booking.nic === nicFromQuery
            );

            if (userBookings && userBookings.length > 0) {
              // Set the form values from the first booking
              const bookingData = userBookings[0];
              setPassengerBooking(bookingData);

              // Extract just the seat numbers for this user
              const userSeats = userBookings.map(
                (booking) => booking.seat_number
              );
              setSelectedSeats(userSeats);

              // Pre-fill the form with user data
              form.reset({
                passenger_name: bookingData.passenger_name || "",
                pick_up_location: bookingData.pick_up_location || "",
                drop_location: bookingData.drop_location || "",
                contact_no: bookingData.contact_no || "",
                email: bookingData.email || "",
                guardian_contact: bookingData.guardian_contact || "",
                special_instructions: bookingData.special_instructions || "",
                nic: bookingData.nic || nicFromQuery || "",
              });
            } else {
              setError("No booking found matching the provided information.");
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch trip data:", error);
      setError("Failed to load trip data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tripId, nicFromQuery]);

  const onSubmit = async (data) => {
    if (selectedSeats?.length === 0 && isEditMode) {
      // If in edit mode and no seats selected, show confirmation for canceling booking
      if (
        window.confirm(
          "You haven't selected any seats. Do you want to cancel your booking?"
        )
      ) {
        try {
          // Remove all user's bookings
          const updatedBookedSeats = tripData.booked_seats.filter(
            (seat) => seat.nic !== nicFromQuery
          );

          const formData = {
            booked_seats: updatedBookedSeats,
          };

          await tripListingService.editTrip(tripId, formData);

          // Show success message
          alert("Your booking has been cancelled successfully.");

          // Navigate back
          navigate(`/bookings`);
        } catch (error) {
          console.error("Error cancelling booking:", error);
          setError("Failed to cancel your booking. Please try again.");
        }
      }
      return;
    } else if (selectedSeats?.length === 0) {
      // For new bookings, just show an error
      alert("Please select at least one seat to continue.");
      return;
    }

    try {
      if (isEditMode) {
        // Handle edit case
        // First, get all bookings except those belonging to this user
        const otherBookings = tripData.booked_seats.filter(
          (seat) => seat.nic !== nicFromQuery
        );

        // Check for any seat conflicts (should not happen with UI restrictions, but good to verify)
        const otherBookedSeatNumbers = otherBookings.map(
          (booking) => booking.seat_number
        );
        const conflictingSeats = selectedSeats.filter((seat) =>
          otherBookedSeatNumbers.includes(seat)
        );

        if (conflictingSeats.length > 0) {
          alert(
            `Seats ${conflictingSeats.join(
              ", "
            )} have been booked by someone else. Please select different seats.`
          );
          return;
        }

        // Then add the new selections - create only one entry per seat to avoid duplicates
        const newSeats = selectedSeats.map((seat) => {
          return {
            passenger_name: data.passenger_name,
            pick_up_location: data.pick_up_location,
            drop_location: data.drop_location,
            contact_no: data.contact_no,
            email: data.email,
            guardian_contact: data.guardian_contact,
            special_instructions: data.special_instructions,
            nic: data.nic,
            seat_number: seat,
          };
        });

        const formData = {
          booked_seats: [...otherBookings, ...newSeats],
          booking_id: bookingId,
          special_instruction: data.special_instructions,
          pick_up_location: data.pick_up_location,
          drop_location: data.drop_location,
          total_ticket_price: tripData.price * selectedSeats.length,
        };

       const updateResult = await tripListingService.editTrip(tripId, formData);

        // Show success message (you can use a toast notification)
        alert("Booking updated successfully!");

        // Navigate back or to a confirmation page
        navigate(
          `/edit-pre-order/${tripId}/${data.nic}/${updateResult.booking_id}`
        );
      } else {
        // Original booking flow
        // Make sure we create unique entries for each seat with clean data
        const seats = selectedSeats.map((seat) => {
          return {
            passenger_name: data.passenger_name,
            pick_up_location: data.pick_up_location,
            drop_location: data.drop_location,
            contact_no: data.contact_no,
            email: data.email,
            guardian_contact: data.guardian_contact,
            special_instructions: data.special_instructions,
            nic: data.nic,
            seat_number: seat,
          };
        });

        const formData = {
          ...data,
          selected_seats: selectedSeats,
          booked_seats: seats,
        };

        const updateResult = await tripListingService.editTrip(
          tripId,
          formData
        );

        navigate(
          `/edit-pre-order/${tripId}/${data.nic}/${updateResult.booking_id}`
        );
      }
    } catch (error) {
      console.error("Error processing booking:", error);
      setError("Failed to process your booking. Please try again.");
    }
  };

  const toggleSeatSelection = (seat) => {
    // For edit mode, we need special handling
    if (isEditMode) {
      // If the seat is booked by someone else, prevent selection
      const isBookedByOther = tripData.booked_seats.some(
        (booking) =>
          booking.seat_number === seat && booking.nic !== nicFromQuery
      );

      if (isBookedByOther) return;
    } else {
      // In normal mode, prevent selection of any booked seat
      if (bookedSeats?.includes(seat)) return;
    }

    setSelectedSeats((prev) => {
      if (prev?.includes(seat)) {
        return prev?.filter((s) => s !== seat);
      } else {
        return [...prev, seat].sort((a, b) => a - b);
      }
    });
  };

  // Create our seat rows
  const rowOneSeats = [1, 7, 9, 13, 17, 21, 25, 29, 37, 39, 43, 47];
  const rowTwoSeats = [2, 8, 10, 14, 18, 22, 26, 30, 38, 40, 44, 48];
  const rowThreeSeats = [4, 6, 12, 16, 20, 24, 28, 32, 34, 36, 42, 46];
  const rowFourSeats = [3, 5, 11, 15, 19, 23, 27, 31, 33, 35, 41, 45];

  const renderSeat = (seat) => {
    const isSelected = selectedSeats.includes(seat);

    // In edit mode, we need to distinguish between user's seats and others' seats
    let isBookedByOther = false;
    let isBookedByUser = false;

    if (isEditMode && tripData) {
      isBookedByOther = tripData.booked_seats.some(
        (booking) =>
          booking.seat_number === seat && booking.nic !== nicFromQuery
      );

      isBookedByUser = tripData.booked_seats.some(
        (booking) =>
          booking.seat_number === seat &&
          booking.nic === nicFromQuery &&
          !isSelected
      );
    } else {
      isBookedByOther = bookedSeats?.includes(seat);
    }

    return (
      <div
        key={seat}
        onClick={() =>
          !(isBookedByOther || isLoading) && toggleSeatSelection(seat)
        }
        className={`
            w-16 h-16 flex items-center justify-center 
            ${
              isBookedByOther
                ? "bg-red-600 cursor-not-allowed opacity-70"
                : isBookedByUser
                ? "bg-orange-400 cursor-pointer"
                : "cursor-pointer hover:opacity-90"
            } 
            ${
              isSelected
                ? "bg-green-600"
                : isBookedByOther
                ? "bg-red-600"
                : isBookedByUser
                ? "bg-orange-400"
                : "bg-blue-600"
            } 
            text-white transition-all duration-200
            ${
              !(isBookedByOther || isSelected || isBookedByUser)
                ? "hover:bg-blue-800 hover:opacity-80"
                : ""
            }
          `}
      >
        <span className="text-lg">{String(seat).padStart(2, "0")}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 bg-slate-100 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 bg-slate-100 min-h-screen">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Alert className="bg-red-50 border-red-200 mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={() => navigate(-1)}
              className="mt-4 bg-blue-600 text-white"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-slate-500 min-h-screen">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-4xl font-bold text-blue-900 mb-8">
            {isEditMode ? "Edit Booking" : "Booking"}
          </h1>

          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600"></div>
                <span>Selected</span>
              </div>
              {isEditMode && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-400"></div>
                  <span>Your Current Seats</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600"></div>
                <span>Booked by Others</span>
              </div>
            </div>

            {selectedSeats.length > 0 ? (
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription className="flex flex-col gap-2">
                  <div>
                    You've selected {selectedSeats.length} seat(s):
                    {selectedSeats.map((seat) => (
                      <Badge
                        key={seat}
                        variant="secondary"
                        className="ml-1 bg-blue-100 cursor-pointer"
                        onClick={() => toggleSeatSelection(seat)}
                      >
                        {seat} ✕
                      </Badge>
                    ))}
                  </div>
                  {selectedSeats.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="self-start text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => setSelectedSeats([])}
                    >
                      Clear All Selections
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert
                className={`${
                  isEditMode
                    ? "bg-red-50 border-red-200"
                    : "bg-amber-50 border-amber-200"
                } mb-4`}
              >
                <AlertDescription>
                  {isEditMode
                    ? "You haven't selected any seats. Submitting without seats will cancel your booking."
                    : "Please select at least one seat to continue."}
                </AlertDescription>
              </Alert>
            )}

            {/* Trip information summary */}
            {tripData && (
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <strong>From:</strong> {tripData.start_location}
                  </div>
                  <div>
                    <strong>To:</strong> {tripData.destination}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {new Date(tripData.start_date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Time:</strong>{" "}
                    {new Date(tripData.start_date).toLocaleTimeString()}
                  </div>
                  <div>
                    <strong>Bus No:</strong> {tripData.bus_number}
                  </div>
                  <div>
                    <strong>Price:</strong> Rs. {tripData.price}
                  </div>
                </div>
              </Alert>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Seat Selection UI */}

              <div className="flex">
                <div className="my-auto mx-4 bg-gray-400">
                  <p className="m-4">Front</p>
                </div>

                <div className="mb-6">
                  <div className="flex justify-center bg-gray-400">
                    <p>Window</p>
                  </div>
                  <div className="grid grid-flow-row gap-4">
                    <div className="flex justify-between space-x-4">
                      {rowOneSeats.map((seat) => renderSeat(seat))}
                    </div>

                    <div className="flex justify-between space-x-4">
                      {rowTwoSeats.map((seat) => renderSeat(seat))}
                    </div>

                    <div className="mt-4 flex justify-between space-x-4">
                      {rowThreeSeats.map((seat) => renderSeat(seat))}
                    </div>

                    <div className="flex justify-between space-x-4">
                      {rowFourSeats.map((seat) => renderSeat(seat))}
                    </div>
                  </div>
                  <div className="flex justify-center bg-gray-400">
                    <p>Window</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="passenger_name"
                    rules={{ required: "Passenger name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Passenger Name"
                            className="rounded-full border border-gray-300 p-4"
                            disabled={isEditMode}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <FormField
                        control={form.control}
                        name="pick_up_location"
                        rules={{ required: "Pickup location is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Pick up Location"
                                  className="rounded-full border border-gray-300 p-4 pr-10"
                                  // disabled={isEditMode}
                                  {...field}
                                />
                                <MapPin
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  size={20}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="relative flex-1">
                      <FormField
                        control={form.control}
                        name="drop_location"
                        rules={{ required: "Drop-off location is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Drop off Location"
                                  className="rounded-full border border-gray-300 p-4 pr-10"
                                  // disabled={isEditMode}
                                  {...field}
                                />
                                <MapPin
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  size={20}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="contact_no"
                    rules={{
                      required: "Contact number is required",
                      pattern: {
                        value: /^[0-9+\-\s]+$/,
                        message: "Please enter a valid phone number",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Passenger Contact Number"
                            className="rounded-full border border-gray-300 p-4"
                            disabled={isEditMode}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Email Address"
                            type="email"
                            className="rounded-full border border-gray-300 p-4"
                            disabled={isEditMode}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guardian_contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Guardian Contact Number"
                            className="rounded-full border border-gray-300 p-4"
                            disabled={isEditMode}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="special_instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Enter Special Instructions"
                            className="rounded-lg border border-gray-300 p-4 h-32 resize-none"
                            // disabled={isEditMode}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nic"
                    rules={{ required: "ID/Passport number is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Passenger NIC / Passport Number"
                            className="rounded-full border border-gray-300 p-4 mt-4"
                            {...field}
                            disabled={isEditMode} // Make NIC field read-only in edit mode
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between mt-24">
                    {isEditMode && (
                      <Button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mt-4 bg-gray-500 text-white text-lg py-2 px-6 rounded-md hover:opacity-90"
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      type="submit"
                      className="mt-4 bg-black text-white text-lg py-2 px-12 rounded-md hover:opacity-90"
                      disabled={selectedSeats.length === 0}
                    >
                      {isEditMode ? "Update Booking" : "Next"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default SeatBookingFromEmail;
