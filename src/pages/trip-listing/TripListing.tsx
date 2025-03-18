// import React, { useState } from 'react';
// import {  Calendar, MapPin, Bus, Filter, X } from 'lucide-react';

// const BusBookingApp = () => {
//   const [selectedTrip, setSelectedTrip] = useState(null);
//   const [filters, setFilters] = useState({
//     date: '',
//     startPoint: '',
//     destination: '',
//     travelAgency: '',
//     seatsAvailable: false
//   });
  
//   // Sample data for demonstration
//   const busTrips = [
//     {
//       id: 1,
//       agency: 'ABC travels',
//       price: 2500,
//       origin: 'Colombo',
//       destination: 'Kandy',
//       departure: '2025-03-15T08:00',
//       arrival: '2025-03-15T11:30',
//       stops: ['Kadawatha', 'Kegalle', 'Mawanella'],
//       busType: 'Luxury',
//       regNumber: 'NA-5678',
//       driver: 'John Doe',
//       conductor: 'Jane Smith',
//       availableSeats: 12,
//       totalSeats: 45,
//       amenities: {
//         wifi: true,
//         charging: true,
//         ac: true,
//         entertainment: true,
//         blanket: true
//       },
//       washrooms: [
//         { location: 'Kegalle', duration: '15 min' },
//         { location: 'Mawanella', duration: '10 min' }
//       ]
//     },
//     {
//       id: 2,
//       agency: 'XYZ travels',
//       price: 2000,
//       origin: 'Colombo',
//       destination: 'Kandy',
//       departure: '2025-03-15T09:30',
//       arrival: '2025-03-15T13:00',
//       stops: ['Kadawatha', 'Nittambuwa', 'Kegalle', 'Mawanella'],
//       busType: 'Semi-Luxury',
//       regNumber: 'WP-9012',
//       driver: 'Sam Wilson',
//       conductor: 'Mary Johnson',
//       availableSeats: 0,
//       totalSeats: 52,
//       amenities: {
//         wifi: true,
//         charging: true,
//         ac: true,
//         entertainment: false,
//         blanket: false
//       },
//       washrooms: [
//         { location: 'Nittambuwa', duration: '10 min' },
//         { location: 'Kegalle', duration: '15 min' }
//       ]
//     },
//     {
//       id: 3,
//       agency: 'QRS travels',
//       price: 2300,
//       origin: 'Colombo',
//       destination: 'Kandy',
//       departure: '2025-03-15T10:15',
//       arrival: '2025-03-15T13:45',
//       stops: ['Kadawatha', 'Kiribathgoda', 'Kegalle', 'Mawanella'],
//       busType: 'Luxury',
//       regNumber: 'CP-3456',
//       driver: 'Robert Brown',
//       conductor: 'Elizabeth Davis',
//       availableSeats: 8,
//       totalSeats: 45,
//       amenities: {
//         wifi: true,
//         charging: true,
//         ac: true,
//         entertainment: true,
//         blanket: true
//       },
//       washrooms: [
//         { location: 'Kegalle', duration: '15 min' }
//       ]
//     }
//   ];

//   // Apply filters to bus trips
//   const filteredTrips = busTrips.filter(trip => {
//     return (
//       (filters.date === '' || trip.departure.includes(filters.date)) &&
//       (filters.startPoint === '' || trip.origin.toLowerCase().includes(filters.startPoint.toLowerCase())) &&
//       (filters.destination === '' || trip.destination.toLowerCase().includes(filters.destination.toLowerCase())) &&
//       (filters.travelAgency === '' || trip.agency.toLowerCase().includes(filters.travelAgency.toLowerCase())) &&
//       (!filters.seatsAvailable || trip.availableSeats > 0)
//     );
//   });

//   // Format date and time from ISO string
//   const formatDateTime = (isoString) => {
//     const date = new Date(isoString);
//     return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
//   };

//   // Handle filter changes
//   const handleFilterChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFilters({
//       ...filters,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setFilters({
//       date: '',
//       startPoint: '',
//       destination: '',
//       travelAgency: '',
//       seatsAvailable: false
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">Bus Ticket Booking</h1>
      
//       {/* Filter Section */}
//       <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold flex items-center">
//             <Filter className="mr-2" size={20} />
//             Filters
//           </h2>
//           <button 
//             onClick={clearFilters}
//             className="text-sm text-blue-600 flex items-center"
//           >
//             <X size={16} className="mr-1" />
//             Clear All
//           </button>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1 flex items-center">
//               <Calendar size={16} className="mr-1" />
//               Date
//             </label>
//             <input 
//               type="date" 
//               name="date"
//               value={filters.date}
//               onChange={handleFilterChange}
//               className="p-2 border rounded-md"
//             />
//           </div>
          
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1 flex items-center">
//               <MapPin size={16} className="mr-1" />
//               From
//             </label>
//             <input 
//               type="text" 
//               name="startPoint"
//               value={filters.startPoint}
//               onChange={handleFilterChange}
//               placeholder="Origin"
//               className="p-2 border rounded-md"
//             />
//           </div>
          
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1 flex items-center">
//               <MapPin size={16} className="mr-1" />
//               To
//             </label>
//             <input 
//               type="text" 
//               name="destination"
//               value={filters.destination}
//               onChange={handleFilterChange}
//               placeholder="Destination"
//               className="p-2 border rounded-md"
//             />
//           </div>
          
//           <div className="flex flex-col">
//             <label className="text-sm text-gray-600 mb-1 flex items-center">
//               <Bus size={16} className="mr-1" />
//               Travel Agency
//             </label>
//             <input 
//               type="text" 
//               name="travelAgency"
//               value={filters.travelAgency}
//               onChange={handleFilterChange}
//               placeholder="Travel Agency"
//               className="p-2 border rounded-md"
//             />
//           </div>
          
//           <div className="flex items-center mt-6">
//             <input 
//               type="checkbox" 
//               id="seatsAvailable"
//               name="seatsAvailable"
//               checked={filters.seatsAvailable}
//               onChange={handleFilterChange}
//               className="mr-2"
//             />
//             <label htmlFor="seatsAvailable" className="text-sm text-gray-600">
//               Show only available seats
//             </label>
//           </div>
//         </div>
//       </div>
      
//       {/* Available Bus Schedules */}
//       <h2 className="text-2xl font-bold mb-4">Available Bus Schedules</h2>
      
//       {filteredTrips.length === 0 ? (
//         <div className="bg-white p-6 rounded-lg shadow-md text-center">
//           <p className="text-gray-500">No trips match your filter criteria. Please adjust your filters.</p>
//         </div>
//       ) : (
//         filteredTrips.map(trip => (
//           <div key={trip.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="font-semibold">{trip.agency}</h3>
//                 <p className="text-gray-600">Ticket Price: Rs. {trip.price}</p>
//               </div>
//               <button 
//                 onClick={() => setSelectedTrip(trip)}
//                 className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700"
//               >
//                 Trip Details
//               </button>
//             </div>
//           </div>
//         ))
//       )}
      
//       {/* Trip Details Modal */}
//       {selectedTrip && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-6">
//                 <h2 className="text-2xl font-bold">Trip Details</h2>
//                 <button 
//                   onClick={() => setSelectedTrip(null)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl"
//                 >
//                   &times;
//                 </button>
//               </div>
              
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Route Information</h3>
//                   <ul className="list-disc pl-5 space-y-1">
//                     <li>Origin and Destination: {selectedTrip.origin} → {selectedTrip.destination}</li>
//                     <li>Key stops: {selectedTrip.stops.join(', ')}</li>
//                   </ul>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Departure and Arrival Details</h3>
//                   <ul className="list-disc pl-5 space-y-1">
//                     <li>Departure: {formatDateTime(selectedTrip.departure)}</li>
//                     <li>Estimated arrival: {formatDateTime(selectedTrip.arrival)}</li>
//                   </ul>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Bus Information</h3>
//                   <ul className="list-disc pl-5 space-y-1">
//                     <li>Bus type: {selectedTrip.busType}</li>
//                     <li>Bus registration number: {selectedTrip.regNumber}</li>
//                     <li>Driver: {selectedTrip.driver}</li>
//                     <li>Conductor: {selectedTrip.conductor}</li>
//                   </ul>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Seating Details</h3>
//                   <ul className="list-disc pl-5 space-y-1">
//                     <li>Available seats: {selectedTrip.availableSeats} of {selectedTrip.totalSeats}</li>
//                   </ul>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Onboard Amenities</h3>
//                   <ul className="list-disc pl-5 space-y-1">
//                     <li>Wi-Fi: {selectedTrip.amenities.wifi ? 'Available' : 'Not available'}</li>
//                     <li>Charging ports: {selectedTrip.amenities.charging ? 'Available' : 'Not available'}</li>
//                     <li>Air conditioning: {selectedTrip.amenities.ac ? 'Available' : 'Not available'}</li>
//                     <li>Entertainment: {selectedTrip.amenities.entertainment ? 'Available' : 'Not available'}</li>
//                     <li>Blanket and pillow: {selectedTrip.amenities.blanket ? 'Available' : 'Not available'}</li>
//                   </ul>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-2">Washroom Stops</h3>
//                   <ul className="list-disc pl-5 space-y-1">
//                     {selectedTrip.washrooms.map((stop, index) => (
//                       <li key={index}>{stop.location} - {stop.duration}</li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
              
//               <div className="mt-8 flex justify-between">
//                 <button 
//                   onClick={() => setSelectedTrip(null)}
//                   className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
//                 >
//                   Back
//                 </button>
                
//                 <button 
//                   className={`py-2 px-4 rounded-md ${
//                     selectedTrip.availableSeats > 0 
//                       ? 'bg-blue-600 text-white hover:bg-blue-700' 
//                       : 'bg-gray-400 text-gray-700 cursor-not-allowed'
//                   }`}
//                   disabled={selectedTrip.availableSeats === 0}
//                 >
//                   Book Seat
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BusBookingApp;

import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Bus, Filter, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const TripListing = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const { register, handleSubmit, watch, reset, setValue, formState } = useForm({
    defaultValues: {
      date: '',
      startPoint: '',
      destination: '',
      travelAgency: '',
      seatsAvailable: false
    }
  });
  const filters = watch();
  
  // Sample data for demonstration
  const busTrips = [
    {
      id: 1,
      agency: 'ABC travels',
      price: 2500,
      origin: 'Colombo',
      destination: 'Kandy',
      departure: '2025-03-15T08:00',
      arrival: '2025-03-15T11:30',
      stops: ['Kadawatha', 'Kegalle', 'Mawanella'],
      busType: 'Luxury',
      regNumber: 'NA-5678',
      driver: 'John Doe',
      conductor: 'Jane Smith',
      availableSeats: 12,
      totalSeats: 45,
      amenities: {
        wifi: true,
        charging: true,
        ac: true,
        entertainment: true,
        blanket: true
      },
      washrooms: [
        { location: 'Kegalle', duration: '15 min' },
        { location: 'Mawanella', duration: '10 min' }
      ]
    },
    {
      id: 2,
      agency: 'XYZ travels',
      price: 2000,
      origin: 'Colombo',
      destination: 'Kandy',
      departure: '2025-03-15T09:30',
      arrival: '2025-03-15T13:00',
      stops: ['Kadawatha', 'Nittambuwa', 'Kegalle', 'Mawanella'],
      busType: 'Semi-Luxury',
      regNumber: 'WP-9012',
      driver: 'Sam Wilson',
      conductor: 'Mary Johnson',
      availableSeats: 0,
      totalSeats: 52,
      amenities: {
        wifi: true,
        charging: true,
        ac: true,
        entertainment: false,
        blanket: false
      },
      washrooms: [
        { location: 'Nittambuwa', duration: '10 min' },
        { location: 'Kegalle', duration: '15 min' }
      ]
    },
    {
      id: 3,
      agency: 'QRS travels',
      price: 2300,
      origin: 'Colombo',
      destination: 'Kandy',
      departure: '2025-03-15T10:15',
      arrival: '2025-03-15T13:45',
      stops: ['Kadawatha', 'Kiribathgoda', 'Kegalle', 'Mawanella'],
      busType: 'Luxury',
      regNumber: 'CP-3456',
      driver: 'Robert Brown',
      conductor: 'Elizabeth Davis',
      availableSeats: 8,
      totalSeats: 45,
      amenities: {
        wifi: true,
        charging: true,
        ac: true,
        entertainment: true,
        blanket: true
      },
      washrooms: [
        { location: 'Kegalle', duration: '15 min' }
      ]
    }
  ];

  // Apply filters to bus trips
  const filteredTrips = busTrips.filter(trip => {
    return (
      (filters.date === '' || trip.departure.includes(filters.date)) &&
      (filters.startPoint === '' || trip.origin.toLowerCase().includes(filters.startPoint.toLowerCase())) &&
      (filters.destination === '' || trip.destination.toLowerCase().includes(filters.destination.toLowerCase())) &&
      (filters.travelAgency === '' || trip.agency.toLowerCase().includes(filters.travelAgency.toLowerCase())) &&
      (!filters.seatsAvailable || trip.availableSeats > 0)
    );
  });

  // Format date and time from ISO string
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Handle form submission
  const onSubmit = (data) => {
    console.log('Applied filters:', data);
    // Additional actions can be performed here
  };

  // Clear all filters
  const clearFilters = () => {
    reset({
      date: '',
      startPoint: '',
      destination: '',
      travelAgency: '',
      seatsAvailable: false
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Bus Ticket Booking</h1>
      
      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Filter className="mr-2" size={20} />
            Filters
          </h2>
          <button 
            onClick={clearFilters}
            className="text-sm text-blue-600 flex items-center"
          >
            <X size={16} className="mr-1" />
            Clear All
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 flex items-center">
                <Calendar size={16} className="mr-1" />
                Date
              </label>
              <input 
                type="date" 
                className="p-2 border rounded-md"
                {...register("date")}
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 flex items-center">
                <MapPin size={16} className="mr-1" />
                From
              </label>
              <input 
                type="text" 
                placeholder="Origin"
                className="p-2 border rounded-md"
                {...register("startPoint")}
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 flex items-center">
                <MapPin size={16} className="mr-1" />
                To
              </label>
              <input 
                type="text" 
                placeholder="Destination"
                className="p-2 border rounded-md"
                {...register("destination")}
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 flex items-center">
                <Bus size={16} className="mr-1" />
                Travel Agency
              </label>
              <input 
                type="text" 
                placeholder="Travel Agency"
                className="p-2 border rounded-md"
                {...register("travelAgency")}
              />
            </div>
            
            <div className="flex items-center mt-6">
              <input 
                type="checkbox" 
                id="seatsAvailable"
                className="mr-2"
                {...register("seatsAvailable")}
              />
              <label htmlFor="seatsAvailable" className="text-sm text-gray-600">
                Show only available seats
              </label>
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Available Bus Schedules */}
      <h2 className="text-2xl font-bold mb-4">Available Bus Schedules</h2>
      
      {filteredTrips.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No trips match your filter criteria. Please adjust your filters.</p>
        </div>
      ) : (
        filteredTrips.map(trip => (
          <div key={trip.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{trip.agency}</h3>
                <p className="text-gray-600">Ticket Price: Rs. {trip.price}</p>
              </div>
              <button 
                onClick={() => setSelectedTrip(trip)}
                className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Trip Details
              </button>
            </div>
          </div>
        ))
      )}
      
      {/* Trip Details Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Trip Details</h2>
                <button 
                  onClick={() => setSelectedTrip(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Route Information</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Origin and Destination: {selectedTrip.origin} → {selectedTrip.destination}</li>
                    <li>Key stops: {selectedTrip.stops.join(', ')}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Departure and Arrival Details</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Departure: {formatDateTime(selectedTrip.departure)}</li>
                    <li>Estimated arrival: {formatDateTime(selectedTrip.arrival)}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Bus Information</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Bus type: {selectedTrip.busType}</li>
                    <li>Bus registration number: {selectedTrip.regNumber}</li>
                    <li>Driver: {selectedTrip.driver}</li>
                    <li>Conductor: {selectedTrip.conductor}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Seating Details</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Available seats: {selectedTrip.availableSeats} of {selectedTrip.totalSeats}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Onboard Amenities</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Wi-Fi: {selectedTrip.amenities.wifi ? 'Available' : 'Not available'}</li>
                    <li>Charging ports: {selectedTrip.amenities.charging ? 'Available' : 'Not available'}</li>
                    <li>Air conditioning: {selectedTrip.amenities.ac ? 'Available' : 'Not available'}</li>
                    <li>Entertainment: {selectedTrip.amenities.entertainment ? 'Available' : 'Not available'}</li>
                    <li>Blanket and pillow: {selectedTrip.amenities.blanket ? 'Available' : 'Not available'}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Washroom Stops</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedTrip.washrooms.map((stop, index) => (
                      <li key={index}>{stop.location} - {stop.duration}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button 
                  onClick={() => setSelectedTrip(null)}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Back
                </button>
                
                <button 
                  className={`py-2 px-4 rounded-md ${
                    selectedTrip.availableSeats > 0 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  }`}
                  disabled={selectedTrip.availableSeats === 0}
                >
                  Book Seat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripListing;