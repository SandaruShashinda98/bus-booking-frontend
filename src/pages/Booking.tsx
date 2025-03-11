/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

const BusSeatSelection = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengerName, setPassengerName] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [guardianContact, setGuardianContact] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Create seat numbers array
  const firstRow = [1, 7, 9, 13, 17, 21, 25, 29, 37, 39, 43, 47];
  const secondRow = [2, 8, 10, 14, 18, 22, 26, 30, 38, 40, 44, 48];
  const thirdRow = [4, 6, 12, 16, 20, 24, 28, 32, 34, 36, 42, 46, 50];
  const fourthRow = [3, 5, 11, 15, 19, 23, 27, 31, 33, 35, 41, 45, 49];

  const handleSeatSelection = (seatNumber:any) => {
    setSelectedSeat(seatNumber === selectedSeat ? null : seatNumber);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log('Booking details:', {
      selectedSeat,
      passengerName,
      pickupLocation,
      dropoffLocation,
      contactNumber,
      email,
      guardianContact,
      idNumber,
      specialInstructions
    });
    // Here you would handle the booking submission
  };

  const renderSeatRow = (seats: any[]) => {
    return (
      <div className="flex justify-between mb-4">
        {seats.map((number: React.Key | null | undefined) => (
          <button
            key={number}
            className={`w-12 h-12 flex items-center justify-center rounded-sm
              ${selectedSeat === number ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-200'} 
              hover:opacity-90 transition-colors`}
            onClick={() => handleSeatSelection(number)}
          >
            <span className="text-sm">{String(number).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-200 p-4 bg-opacity-50 bg-blend-overlay">
      <div className="max-w-6xl mx-auto">
        {/* Seat Selection Container */}
        <div className="bg-gray-200 bg-opacity-90 rounded-lg p-6 mb-6 shadow-lg">
          <h1 className="text-3xl font-bold  mb-6">Booking</h1>
          
          {/* Seats Grid */}
          <div className="mb-8">
            {renderSeatRow(firstRow)}
            {renderSeatRow(secondRow)}
            <div className="h-8"></div> {/* Aisle space */}
            {renderSeatRow(thirdRow)}
            {renderSeatRow(fourthRow)}
          </div>
          
          {/* Passenger Information */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {/* Left Column */}
              <input
                type="text"
                placeholder="Passenger Name"
                className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pick up Location"
                    className="w-full px-4 py-3 rounded-full border border-gray-300 pr-10 bg-white"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                  />
                  <span className="absolute right-3 top-3 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Drop off Location"
                    className="w-full px-4 py-3 rounded-full border border-gray-300 pr-10 bg-white"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    required
                  />
                  <span className="absolute right-3 top-3 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                </div>
              </div>
              
              <input
                type="tel"
                placeholder="Passenger Contact Number"
                className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
              
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <input
                type="tel"
                placeholder="Guardian Contact Number"
                className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white"
                value={guardianContact}
                onChange={(e) => setGuardianContact(e.target.value)}
              />
            </div>
            
            <div className="space-y-4">
              {/* Right Column */}
              <textarea
                placeholder="Enter Special Instructions"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 h-32 resize-none bg-white"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
              
              <input
                type="text"
                placeholder="Passenger NIC / Passport Number"
                className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                required
              />
              
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300"
                  disabled={!selectedSeat}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusSeatSelection;