import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, ShoppingCart, Check, AlertCircle } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { bookingService } from "@/services/booking.service";
import { toast } from "react-toastify";

const PaymentInterface = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Params:", params);

  // Parse query parameters (for editing from email)
  const queryParams = new URLSearchParams(location.search);
  const nicFromQuery =  params.nic;
  const bookingId =  params.bookingId;
  const tripId = params.tripID;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      card_holder_name: "",
      card_number: "",
      card_expiry_date: "",
      card_cvc: "",
    },
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const foundBooking = await bookingService.getBooking(bookingId);
      console.log("Booking details:", foundBooking);
      setBookingDetails(foundBooking);
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
      toast.error("Failed to load booking details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

    // Calculate subtotal, tax, and total
    const getOrderSummary = () => {
      if (!bookingDetails) {
        return {
          subtotal: 0,
          tax: 0,
          total: 0
        };
      }
  
      const ticketPrice = parseFloat(bookingDetails.total_ticket_price || 0);
      const mealPrice = parseFloat(bookingDetails.total_meal_price || 0);
      const subtotal = ticketPrice + mealPrice;
      const tax = 0; // No tax in this example
      const total = subtotal + tax;
  
      return {
        subtotal,
        tax,
        total,
        ticketPrice,
        mealPrice
      };
    };
  
    const { subtotal, tax, total, ticketPrice, mealPrice } = getOrderSummary();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await bookingService.editBooking(tripId, {
        card_holder_name: data.card_holder_name,
        card_number: data.card_number,
        card_expiry_date: data.card_expiry_date,
        card_cvc: data.card_cvc,
        payment_status: "completed",
        total_amount: total,
        booking_id: bookingId,
      });
      
      console.log("Payment response:", response);
      setIsSuccess(true);
      toast.success("Payment processed and booking confirmed successfully.");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnHome = () => {
    navigate("/search");
  };



  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto pt-16 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-700">Payment Successful</AlertTitle>
          <AlertDescription className="text-green-600">
            Your payment has been processed successfully. You will receive a
            confirmation email shortly.
          </AlertDescription>
        </Alert>
        <div className="mt-8 text-center">
          <Button
            onClick={handleReturnHome}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pt-16 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Complete your payment
              </CardTitle>
              <CardDescription>
                Please enter your payment details to complete your purchase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="h-5 w-5" />
                    <h3 className="font-semibold text-lg">Credit Card</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="card_holder_name">Name on card</Label>
                      <Input
                        id="card_holder_name"
                        placeholder="John Smith"
                        {...register("card_holder_name", {
                          required: "Card name is required",
                          minLength: {
                            value: 3,
                            message: "Name must be at least 3 characters",
                          },
                        })}
                        className={
                          errors.card_holder_name ? "border-red-500" : ""
                        }
                      />
                      {errors.card_holder_name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.card_holder_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="card_number">Card number</Label>
                      <Input
                        id="card_number"
                        placeholder="1234 5678 9012 3456"
                        {...register("card_number", {
                          required: "Card number is required",
                          pattern: {
                            value: /^[0-9\s]{13,19}$/,
                            message: "Please enter a valid card number",
                          },
                        })}
                        className={errors.card_number ? "border-red-500" : ""}
                      />
                      {errors.card_number && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.card_number.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="card_expiry_date">Expiry date</Label>
                        <Input
                          id="card_expiry_date"
                          placeholder="MM/YY"
                          {...register("card_expiry_date", {
                            required: "Expiry date is required",
                            pattern: {
                              value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                              message: "Please use MM/YY format",
                            },
                          })}
                          className={errors.card_expiry_date ? "border-red-500" : ""}
                        />
                        {errors.card_expiry_date && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.card_expiry_date.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="card_cvc">CVC</Label>
                        <Input
                          id="card_cvc"
                          placeholder="123"
                          {...register("card_cvc", {
                            required: "CVC is required",
                            pattern: {
                              value: /^[0-9]{3,4}$/,
                              message: "Please enter a valid CVC code",
                            },
                          })}
                          className={errors.card_cvc ? "border-red-500" : ""}
                        />
                        {errors.card_cvc && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.card_cvc.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-8 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Pay Now"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingDetails && ticketPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ticket Price</span>
                    <span>Rs. {ticketPrice.toFixed(2)}</span>
                  </div>
                )}
                {bookingDetails && mealPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meal Price</span>
                    <span>Rs. {mealPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>Rs. {tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start">
              <p className="text-sm text-gray-500 mb-4">
                By completing this purchase, you agree to our Terms of Service
                and Privacy Policy.
              </p>
              <div className="flex gap-2 items-center">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Secure payment processing
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentInterface;