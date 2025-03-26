// import React, { useState } from 'react';

// const BookingCancellation = () => {
//   const [bookingId, setBookingId] = useState('');
//   const [bookingDate, setBookingDate] = useState('');
//   const [seatNumber, setSeatNumber] = useState('');
//   const [passengerId, setPassengerId] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Simulate API call for cancellation
//     setTimeout(() => {
//       console.log('Cancellation requested for:', {
//         bookingId,
//         bookingDate,
//         seatNumber,
//         passengerId
//       });
//       setIsSubmitting(false);
//       // Here you would handle the actual cancellation logic
//       alert('Booking cancellation successful');
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center" style={{
//       backgroundSize: 'cover',
//       backgroundPosition: 'center'
//     }}>
//       <div className="w-full max-w-4xl bg-blue-900 bg-opacity-90 p-8 rounded-xl text-white shadow-xl">
//         <h1 className="text-4xl font-bold text-center mb-12">Booking Cancellation</h1>

//         <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-center">
//             <label htmlFor="bookingId" className="text-xl font-medium">
//               Booking ID
//             </label>
//             <div className="md:col-span-2">
//               <input
//                 type="text"
//                 id="bookingId"
//                 className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md"
//                 value={bookingId}
//                 onChange={(e) => setBookingId(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-center">
//             <label htmlFor="bookingDate" className="text-xl font-medium">
//               Booking Date
//             </label>
//             <div className="md:col-span-2">
//               <input
//                 type="text"
//                 id="bookingDate"
//                 className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md"
//                 value={bookingDate}
//                 onChange={(e) => setBookingDate(e.target.value)}
//                 required
//                 placeholder="MM/DD/YYYY"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-center">
//             <label htmlFor="seatNumber" className="text-xl font-medium">
//               Seat Number
//             </label>
//             <div className="md:col-span-2">
//               <input
//                 type="text"
//                 id="seatNumber"
//                 className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md"
//                 value={seatNumber}
//                 onChange={(e) => setSeatNumber(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-center">
//             <label htmlFor="passengerId" className="text-xl font-medium">
//               Passenger NIC / Passport Number
//             </label>
//             <div className="md:col-span-2">
//               <input
//                 type="text"
//                 id="passengerId"
//                 className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-md"
//                 value={passengerId}
//                 onChange={(e) => setPassengerId(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <button
//               type="submit"
//               className="bg-gray-800 text-white px-8 py-3 rounded-md hover:bg-gray-700 transition duration-300"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BookingCancellation;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingCancellation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      bookingId: '',
      bookingDate: '',
      seatNumber: '',
      passengerId: ''
    }
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    // Simulate API call for cancellation
    setTimeout(() => {
      console.log('Cancellation requested for:', data);
      setIsSubmitting(false);
      // Here you would handle the actual cancellation logic
      toast.success('Booking cancellation successful!');
      navigate('/search');
    }, 1500);
  };

  const handleBackToSearch = () => {
    navigate('/search');
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
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
              <span className="bg-blue-600 text-white p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              Booking Cancellation
            </h1>
            <p className="text-gray-600 mt-2">Please provide your booking details to proceed with cancellation</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700">
                Booking ID
              </label>
              <input
                type="text"
                id="bookingId"
                className={`w-full px-3 py-2 border rounded-md bg-white ${errors.bookingId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                {...register('bookingId', { required: 'Booking ID is required' })}
              />
              {errors.bookingId && (
                <p className="text-red-500 text-xs mt-1">{errors.bookingId.message}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">
                Booking Date
              </label>
              <input
                type="date"
                id="bookingDate"
                className={`w-full px-3 py-2 border rounded-md bg-white ${errors.bookingDate ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                {...register('bookingDate', { required: 'Booking date is required' })}
              />
              {errors.bookingDate && (
                <p className="text-red-500 text-xs mt-1">{errors.bookingDate.message}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="seatNumber" className="block text-sm font-medium text-gray-700">
                Seat Number
              </label>
              <input
                type="text"
                id="seatNumber"
                className={`w-full px-3 py-2 border rounded-md bg-white ${errors.seatNumber ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                {...register('seatNumber', { required: 'Seat number is required' })}
              />
              {errors.seatNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.seatNumber.message}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="passengerId" className="block text-sm font-medium text-gray-700">
                Passenger NIC / Passport Number
              </label>
              <input
                type="text"
                id="passengerId"
                className={`w-full px-3 py-2 border rounded-md bg-white ${errors.passengerId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                {...register('passengerId', { required: 'Passenger ID is required' })}
              />
              {errors.passengerId && (
                <p className="text-red-500 text-xs mt-1">{errors.passengerId.message}</p>
              )}
            </div>
            
            <div className="pt-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Once cancelled, your booking cannot be restored. Any refund will be processed according to our refund policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={handleBackToSearch}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Confirm Cancellation"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingCancellation;
