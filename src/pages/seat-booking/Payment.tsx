import React, { useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { bookingService } from "@/services/booking.service";

const PaymentInterface = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Log form data for debugging
    console.log("Form data:", data);
    console.log("params?.tripID", params?.tripID);
    console.log("params.nic", params.nic);

    await bookingService
      .editBooking(params?.tripID, {
        card_holder_name: data.card_holder_name,
        card_number: data.card_number,
        card_expiry_date: data.card_expiry_date,
        card_cvc: data.card_cvc,
      })
      .then((response) => {
        console.log("Payment response:", response);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Payment error:", error);
        setIsSubmitting(false);
      });

    // Simulate payment processing
    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   setIsSuccess(true);
    // }, 1500);
  };

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
            onClick={navigate('/search')}
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
                            // pattern: {
                            //   value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                            //   message: "Please use MM/YY format",
                            // },
                          })}
                          // className={errors.card_expiry_date ? "border-red-500" : ""}
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
                          type="password"
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rs. 89.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>Rs. 00.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>$102.18</span>
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
