import React, { useState } from 'react';

const BookingCancellation = () => {
  const [bookingId, setBookingId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [passengerId, setPassengerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for cancellation
    setTimeout(() => {
      console.log('Cancellation requested for:', {
        bookingId,
        bookingDate,
        seatNumber,
        passengerId
      });
      setIsSubmitting(false);
      // Here you would handle the actual cancellation logic
      alert('Booking cancellation successful');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  ml-96" style={{
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="w-full max-w-4xl bg-blue-900 bg-opacity-90 p-8 rounded-xl text-white shadow-xl">
        <h1 className="text-4xl font-bold text-center mb-12">Booking Cancellation</h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-center">
            <label htmlFor="bookingId" className="text-xl font-medium">
              Booking ID
            </label>
            <div className="md:col-span-2">
              <input
                type="text"
                id="bookingId"
                className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-center">
            <label htmlFor="bookingDate" className="text-xl font-medium">
              Booking Date
            </label>
            <div className="md:col-span-2">
              <input
                type="text"
                id="bookingDate"
                className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                placeholder="MM/DD/YYYY"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-center">
            <label htmlFor="seatNumber" className="text-xl font-medium">
              Seat Number
            </label>
            <div className="md:col-span-2">
              <input
                type="text"
                id="seatNumber"
                className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-center">
            <label htmlFor="passengerId" className="text-xl font-medium">
              Passenger NIC / Passport Number
            </label>
            <div className="md:col-span-2">
              <input
                type="text"
                id="passengerId"
                className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md"
                value={passengerId}
                onChange={(e) => setPassengerId(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gray-800 text-white px-8 py-3 rounded-md hover:bg-gray-700 transition duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingCancellation;