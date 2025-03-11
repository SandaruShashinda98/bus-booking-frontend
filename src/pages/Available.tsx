import React, { useState } from 'react';

const AvailableBusSchedules = () => {
  // Sample data - in a real app, this would come from an API
  const [busSchedules, setBusSchedules] = useState([
    { id: 1, company: 'ABC travels', price: '$45.00', departureTime: '08:30 AM', arrivalTime: '12:30 PM', duration: '4h', type: 'Express' },
    { id: 2, company: 'XYZ travels', price: '$38.50', departureTime: '09:15 AM', arrivalTime: '01:45 PM', duration: '4h 30m', type: 'Standard' },
    { id: 3, company: 'QRS travels', price: '$52.00', departureTime: '10:00 AM', arrivalTime: '01:30 PM', duration: '3h 30m', type: 'Premium' }
  ]);

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleTripDetails = (id: number) => {
    const selected = busSchedules.find(schedule => schedule.id === id);
    setSelectedSchedule(selected);
    console.log('Viewing details for:', selected);
    // In a real app, this might open a modal or navigate to a details page
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen ml-96 w-full">
      {/* Left Section - Schedule List */}
      <div className="w-full md:w-1/2 bg-gray-200 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Available Bus Schedules</h1>
        
        <div className="space-y-4">
          {busSchedules.map((schedule) => (
            <div key={schedule.id} className="bg-white rounded-md shadow-sm p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{schedule.company}</h3>
                  <p className="text-gray-600">Ticket Price: {schedule.price}</p>
                </div>
                <button 
                  onClick={() => handleTripDetails(schedule.id)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Trip Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right Section - Bus Interior Image */}
      <div 
        className="w-full md:w-1/2 bg-cover bg-center hidden md:block"
        style={{
          backgroundImage: "url('/api/placeholder/800/1000')",
          backgroundPosition: 'center'
        }}
      />
      
      {/* Trip Details Modal - Would be shown when a schedule is selected */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedSchedule.company}</h2>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-medium">Departure:</span>
                <span>{selectedSchedule.departureTime}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Arrival:</span>
                <span>{selectedSchedule.arrivalTime}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>{selectedSchedule.duration}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Bus Type:</span>
                <span>{selectedSchedule.type}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Ticket Price:</span>
                <span className="font-bold">{selectedSchedule.price}</span>
              </p>
              <div className="mt-6 flex justify-between">
                <button 
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  onClick={() => setSelectedSchedule(null)}
                >
                  Close
                </button>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    console.log('Booking ticket for:', selectedSchedule);
                    // Handle booking logic here
                    setSelectedSchedule(null);
                  }}
                >
                  Book Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableBusSchedules;