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
import { useNavigate, useParams } from "react-router-dom";

const SeatBookingPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [bookedSeats, setBookedSeats] = useState([]);
  const [tripData, setTripData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const form = useForm({
    defaultValues: {
      passenger_name: "",
      pick_up_location: "",
      drop_location: "",
      contact_no: "",
      email: "",
      guardian_contact: "",
      special_instructions: "",
      nic: "",
    },
  });

  const nic = form.watch("nic");

  const fetchData = async () => {
    try {
      const tripData = await tripListingService.getSingleTrip(params?.tripID);
      console.log(tripData)
      setTripData(tripData);
      if (tripData) {
        const seatNumbers = tripData.booked_seats?.map(
          (seat) => seat?.seat_number
        );
        setBookedSeats(seatNumbers);
        // form.reset(tripData?.booked_seats[0]);
      }
    } catch (error) {
      console.error("Failed to fetch trip data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(selectedSeats)

  const onSubmit = async (data) => {
    if (selectedSeats?.length === 0) {
      //   toast({
      //     title: "Seat selection required",
      //     description: "Please select at least one seat before proceeding.",
      //     variant: "destructive"
      //   });
      return;
    }

    const seats = selectedSeats?.map((seat) => {
      return {
        ...data,
        seat_number: seat,
      };
    });


    const formData = {
      ...data,
      selected_seats: selectedSeats,
      booked_seats: seats,
      total_ticket_price: tripData.price * selectedSeats.length,
    };
    const _tripData = await tripListingService.editTrip(
      params?.tripID,
      formData
    );

    fetchData();
    navigate(`/meal-pre-order/${params?.tripID}/${nic}/${_tripData.booking_id}`);
    // Show success message
    // toast({
    //   title: "Booking Successful",
    //   description: `You have booked seats: ${selectedSeats.join(', ')}`,
    // });
  };

  const toggleSeatSelection = (seat) => {
    if (bookedSeats?.includes(seat)) return; // Prevent selection of already booked seats

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
    const isBooked = bookedSeats?.includes(seat);

    return (
      <div
        key={seat}
        onClick={() => !isBooked && toggleSeatSelection(seat)}
        className={`
          w-16 h-16 flex items-center justify-center 
          ${
            isBooked
              ? "bg-red-600 cursor-not-allowed opacity-70"
              : "cursor-pointer hover:opacity-90"
          } 
          ${
            isSelected
              ? "bg-green-600"
              : isBooked
              ? "bg-red-600"
              : "bg-blue-600"
          } 
          text-white transition-all duration-200
          ${
            !isBooked && !isSelected ? "hover:bg-blue-800 hover:opacity-80" : ""
          }
        `}
      >
        <span className="text-lg">{String(seat).padStart(2, "0")}</span>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-slate-500 min-h-screen">
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-4xl font-bold text-blue-900 mb-8">Booking</h1>

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
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-600"></div>
                <span>Booked</span>
              </div>
            </div>

            {selectedSeats.length > 0 ? (
              <Alert className="bg-blue-50 border-blue-200 mb-4">
                <AlertDescription>
                  You've selected {selectedSeats.length} seat(s):
                  {selectedSeats.map((seat) => (
                    <Badge
                      key={seat}
                      variant="secondary"
                      className="ml-1 bg-blue-100"
                    >
                      {seat}
                    </Badge>
                  ))}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-amber-50 border-amber-200 mb-4">
                <AlertDescription>
                  Please select at least one seat to continue.
                </AlertDescription>
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end mt-24">
                    <Button
                      type="submit"
                      className="mt-4 bg-black text-white text-lg py-2 px-12 rounded-md hover:opacity-90"
                      disabled={selectedSeats.length === 0}
                    >
                      Next
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

export default SeatBookingPage;