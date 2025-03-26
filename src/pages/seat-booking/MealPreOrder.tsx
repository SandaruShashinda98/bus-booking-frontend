import { menuManagementService } from "@/services/menuManagement.service";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const MealPreOrder = () => {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      items: {},
    },
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const menuData = await menuManagementService.getAllMenus();
      if (menuData) {
        setMenu(menuData);

        // Initialize the form with the count from menu data
        const initialValues = menuData.reduce((acc, item) => {
          acc[item._id] = item.count || 0;
          return acc;
        }, {});

        reset({ items: initialValues });
      }
    } catch (error) {
      console.error("Failed to fetch user menu:", error);
      toast.error("Failed to load menu items. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Trip ID:", params.tripID);
      console.log("NIC:", params.nic);

      const orderItems = Object.entries(data.items)
        .map(([itemId, count]) => {
          const menuItem = menu.find((item) => item._id === itemId);
          return {
            itemId,
            food: menuItem?.food || "",
            nic: params.nic,
            count,
          };
        })
        .filter((item) => item.count > 0); // Only include items with count > 0

      console.log("Formatted order:", orderItems);

      if (orderItems.length === 0) {
        toast.info("No items selected for pre-order.");
        navigate(`/search`);
        return;
      }

      const updatedMenus = await menuManagementService.editMenuFood(orderItems);

      if (updatedMenus) {
        toast.success("Meal pre-ordered and booking added successfully!");
        navigate(`/search`);
      } else {
        toast.error("Something went wrong with your order. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting meal pre-order:", error);
      toast.error("Failed to submit your order. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipOrder = (e) => {
    e.preventDefault();
    console.log("Order skipped");
    toast.info("Meal pre-order skipped and booking added successfully.");
    navigate(`/search`);
  };

  // Function to handle quantity change
  const handleQuantityChange = (_id, value, onChange) => {
    const newValue = Math.max(0, value);
    onChange(newValue);
  };

  const handleBackToSearch = () => {
    navigate("/search");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br bg-slate-500 relative">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start pt-16 px-4 md:px-8">
        {/* Back Button */}
        <div className="w-full max-w-2xl mb-4 flex justify-start">
          <button
            onClick={handleBackToSearch}
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
            Back to Search
          </button>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 mb-8">
          {/* Header */}
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </span>
              Meal Pre-Order
            </h1>
            <p className="text-gray-600 mt-2">
              Select the meals you'd like to pre-order for your trip
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Food Items */}
              <div className="space-y-3 mb-8">
                {menu.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mx-auto mb-2 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p>No menu items available</p>
                  </div>
                ) : (
                  menu.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col">
                        <span className="text-lg font-medium text-gray-800">
                          {item.food}
                        </span>
                        {item.ingredients && (
                          <span className="text-sm text-gray-500 mt-1">
                            {item.ingredients}
                          </span>
                        )}
                        <span className="text-blue-600 font-semibold mt-1">
                          Rs. {item.price || 0}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Controller
                          name={`items.${item._id}`}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <div className="flex items-center">
                              <button
                                type="button"
                                className="w-8 h-8 flex items-center justify-center text-xl bg-gray-200 hover:bg-gray-300 rounded-full disabled:opacity-50"
                                onClick={() =>
                                  handleQuantityChange(
                                    item._id,
                                    value - 1,
                                    onChange
                                  )
                                }
                                disabled={isSubmitting || (value || 0) <= 0}
                              >
                                -
                              </button>
                              <div className="w-12 h-10 flex items-center justify-center mx-2 border border-gray-300 rounded-md bg-white">
                                {value || 0}
                              </div>
                              <button
                                type="button"
                                className="w-8 h-8 flex items-center justify-center text-xl bg-gray-200 hover:bg-gray-300 rounded-full disabled:opacity-50"
                                onClick={() =>
                                  handleQuantityChange(
                                    item._id,
                                    value + 1,
                                    onChange
                                  )
                                }
                                disabled={isSubmitting}
                              >
                                +
                              </button>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-between gap-4 mt-8">
                <button
                  type="button"
                  onClick={skipOrder}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Skip Pre-Order
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
                  disabled={isSubmitting}
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
                      Processing...
                    </span>
                  ) : (
                    "Proceed with Booking"
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

export default MealPreOrder;
