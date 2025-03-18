import { useForm, Controller } from 'react-hook-form';

const MealPreOrder = () => {
  // Mock data for food items
  const foodItems = [
    { id: 1, name: 'Food A', price: 'Rs 299' },
    { id: 2, name: 'Food B', price: 'Rs 399' },
    { id: 3, name: 'Food C', price: 'Rs 249' },
    { id: 4, name: 'Food D', price: 'Rs 199' },
  ];

  // Form setup
  const { control, handleSubmit } = useForm({
    defaultValues: {
      items: foodItems.reduce((acc, item) => {
        acc[item.id] = 1;
        return acc;
      }, {})
    }
  });

  const onSubmit = (data) => {
    console.log("Order submitted:", data);
    // Here you would typically send this data to your backend
  };

  const updateOrder = () => {
    console.log("Order updated");
    // Logic to update the current order
  };

  const skipOrder = () => {
    console.log("Order skipped");
    // Logic to skip the ordering process
  };

  // Function to handle quantity change
  const handleQuantityChange = (id, value, onChange) => {
    // Ensure quantity is at least 0
    const newValue = Math.max(0, value);
    onChange(newValue);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-gray-200 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-white bg-opacity-60"></div>
      </div>
      
      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Meal Pre Order</h1>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">Restaurant A</h2>
        </div>
        
        {/* Food items */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 mb-8">
            {foodItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg font-medium mr-2">•</span>
                  <span className="text-lg">
                    {item.name} - {item.price}
                  </span>
                </div>
                <div className="flex items-center">
                  <Controller
                    name={`items.${item.id}`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center text-xl bg-gray-100 hover:bg-gray-200 rounded-full"
                          onClick={() => handleQuantityChange(item.id, value + 1, onChange)}
                        >
                          +
                        </button>
                        <div className="w-10 h-10 flex items-center justify-center mx-2 border border-gray-300 rounded-md bg-white">
                          {value}
                        </div>
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center text-xl bg-gray-100 hover:bg-gray-200 rounded-full"
                          onClick={() => handleQuantityChange(item.id, value - 1, onChange)}
                        >
                          -
                        </button>
                      </div>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={skipOrder}
              className="flex-1 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={updateOrder}
              className="flex-1 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Update Order
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Proceed Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealPreOrder;