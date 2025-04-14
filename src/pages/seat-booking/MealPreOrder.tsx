import { menuManagementService } from "@/services/menuManagement.service";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Sliders, Filter } from "lucide-react"; // Import icons

const MealPreOrder = () => {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedDietType, setSelectedDietType] = useState("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const [restaurants, setRestaurants] = useState([]);
  
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
        setFilteredMenu(menuData);

        // Extract unique restaurants for the filter
        const uniqueRestaurants = [...new Set(menuData
          .filter(item => item.restaurant)
          .map(item => item.restaurant))];
        setRestaurants(uniqueRestaurants);

        // Find min and max price for price range
        const prices = menuData.map(item => item.price || 0);
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);
        }

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

  // Apply filters to menu data
  const applyFilters = () => {
    let result = [...menu];
    
    // Filter by restaurant
    if (selectedRestaurant !== "all") {
      result = result.filter(item => item.restaurant === selectedRestaurant);
    }
    
    // Filter by price range
    result = result.filter(item => {
      const itemPrice = item.price || 0;
      return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
    });
    
    // Filter by diet type (vegetarian/non-vegetarian)
    if (selectedDietType !== "all") {
      // Assuming we analyze ingredients to determine veg/non-veg status
      // This is a simplified approach - in a real app, you'd likely have a veg/non-veg field
      const nonVegKeywords = ["chicken", "meat", "beef", "pork", "fish", "lamb", "mutton", "seafood"];
      
      result = result.filter(item => {
        const ingredients = (item.ingredients || "").toLowerCase();
        const containsNonVeg = nonVegKeywords.some(keyword => ingredients.includes(keyword));
        
        return (selectedDietType === "veg" && !containsNonVeg) || 
               (selectedDietType === "nonveg" && containsNonVeg);
      });
    }
    
    setFilteredMenu(result);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedDietType("all");
    setSelectedRestaurant("all");
    
    // Reset price range to min and max from all items
    const prices = menu.map(item => item.price || 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
    
    setFilteredMenu(menu);
  };

  // Apply filters whenever filter states change
  useEffect(() => {
    if (menu.length > 0) {
      applyFilters();
    }
  }, [selectedDietType, selectedRestaurant, priceRange[0], priceRange[1]]);

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
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
        navigate(`/payment/${params?.tripID}/${params.nic}/${params.bookingID}`);
        return;
      }

      const updatedMenus = await menuManagementService.editMenuFood(orderItems);

      if (updatedMenus) {
        toast.success("Meal pre-ordered and booking added successfully!");
        navigate(`/payment/${params?.tripID}/${params.nic}/${params.bookingID}`);
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
    toast.info("Meal pre-order skipped.");
    navigate(`/payment/${params?.tripID}/${params.nic}/${params.bookingID}`);
  };

  // Function to handle quantity change
  const handleQuantityChange = (_id, value, onChange) => {
    const newValue = Math.max(0, value);
    onChange(newValue);
  };

  const handleBackToSearch = () => {
    navigate("/search");
  };

  // Format price for display
  const formatPrice = (price) => {
    return `Rs. ${price.toFixed(0)}`;
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
            <div className="flex justify-between items-center">
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
              
              {/* Filter toggle button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
            <p className="text-gray-600 mt-2">
              Select the meals you'd like to pre-order for your trip
            </p>
          </div>

          {/* Filter Section */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Sliders className="h-5 w-5 mr-2 text-blue-600" />
                  Filter Options
                </h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset Filters
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Restaurant filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant
                  </label>
                  <select
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Restaurants</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant} value={restaurant}>
                        {restaurant}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Diet Type filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diet Type
                  </label>
                  <select
                    value={selectedDietType}
                    onChange={(e) => setSelectedDietType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>
              
              {/* Price Range filter */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredMenu.length} of {menu.length} items
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Food Items */}
              <div className="space-y-3 mb-8">
                {filteredMenu.length === 0 ? (
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
                    <p>No menu items available with the selected filters</p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredMenu.map((item) => {
                    const isAvailable = item.is_available !== false; // Treat undefined as available
                    
                    // Determine if item is vegetarian based on ingredients
                    const nonVegKeywords = ["chicken", "meat", "beef", "pork", "fish", "lamb", "mutton", "seafood"];
                    const ingredients = (item.ingredients || "").toLowerCase();
                    const isVegetarian = !nonVegKeywords.some(keyword => ingredients.includes(keyword));
                    
                    return (
                      <div
                        key={item._id}
                        className={`flex items-center justify-between p-4 border rounded-lg transition-shadow ${
                          isAvailable 
                            ? "bg-gray-50 border-gray-100 hover:shadow-md" 
                            : "bg-gray-100 border-gray-200 opacity-75"
                        }`}
                      >
                        <div className="flex flex-col relative">
                          <div className="flex items-center">
                            <span className="text-lg font-medium text-gray-800">
                              {item.food}
                            </span>
                            {/* Veg/Non-veg indicator */}
                            <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                              isVegetarian 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {isVegetarian ? "Veg" : "Non-Veg"}
                            </span>
                          </div>
                          
                          {/* Restaurant name */}
                          {item.restaurant && (
                            <span className="text-xs text-gray-500 mt-1">
                              {item.restaurant}
                            </span>
                          )}
                          
                          {item.ingredients && (
                            <span className="text-sm text-gray-500 mt-1">
                              {item.ingredients}
                            </span>
                          )}
                          <span className="text-blue-600 font-semibold mt-1">
                            Rs. {item.price || 0}
                          </span>
                          
                          {!isAvailable && (
                            <div className="absolute right-0 -top-2 -mr-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                              Currently Unavailable
                            </div>
                          )}
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
                                  disabled={isSubmitting || (value || 0) <= 0 || !isAvailable}
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
                                  disabled={isSubmitting || !isAvailable}
                                >
                                  +
                                </button>
                              </div>
                            )}
                          />
                        </div>
                      </div>
                    );
                  })
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