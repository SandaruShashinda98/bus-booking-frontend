import { tripListingService } from "@/services/tripListing.service";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AvailableBusSchedules = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [busSchedules, setBusSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      const date = searchParams.get("date");

      const tripData = await tripListingService.getAllTripsWithFilter({
        from,
        to,
        date,
      });

      if (tripData) {
        console.log(tripData);
        setBusSchedules(tripData);
      }
    } catch (error) {
      console.error("Failed to fetch trip data:", error);
      setError("Failed to load bus schedules. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const handleTripDetails = (id) => {
    const selected = busSchedules.find((schedule) => schedule._id === id);
    setSelectedSchedule(selected);
    console.log("Viewing details for:", selected);
  };

  const handleBackToSearch = () => {
    navigate("/search");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br bg-slate-500 relative">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start pt-16 px-4 md:px-8">
        {/* Back Button */}
        <div className="w-full max-w-4xl mb-4 flex justify-start">
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

        {/* Results Card */}
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
            Available Bus Schedules
          </h1>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
              <div className="flex">
                <svg
                  className="h-6 w-6 text-red-500 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* No Results State */}
          {!isLoading && !error && busSchedules.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-md text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-2 text-yellow-500"
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
              <h3 className="text-xl font-semibold mb-2">
                No Bus Schedules Found
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any schedules matching your search criteria.
              </p>
              <button
                onClick={handleBackToSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Modify Search
              </button>
            </div>
          )}

          {/* Bus Schedules List */}
          {!isLoading && !error && busSchedules.length > 0 && (
            <div className="space-y-4">
              {busSchedules.map((schedule) => (
                <div
                  key={schedule._id}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {schedule.company ?? "Company Name"}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center mb-1">
                          <svg
                            className="h-4 w-4 mr-1 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {schedule.start_location} → {schedule.destination}
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="h-4 w-4 mr-1 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {new Date(schedule.start_date).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-gray-900 font-semibold mt-2">
                        Ticket Price: ${schedule.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTripDetails(schedule._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Trip Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trip Details Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Trip Details</h2>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-blue-800">
                {selectedSchedule.company}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium text-gray-600">
                  Start Location:
                </span>
                <span className="text-gray-900">
                  {selectedSchedule.start_location}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium text-gray-600">End Location:</span>
                <span className="text-gray-900">
                  {selectedSchedule.destination}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium text-gray-600">Departure:</span>
                <span className="text-gray-900">
                  {new Date(selectedSchedule.start_date).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium text-gray-600">Arrival:</span>
                <span className="text-gray-900">
                  {new Date(selectedSchedule.end_date).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium text-gray-600">Ticket Price:</span>
                <span className="text-xl font-bold text-blue-600">
                  ${selectedSchedule.price}
                </span>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={() => setSelectedSchedule(null)}
                >
                  Close
                </button>
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() =>
                    navigate(`/seat-booking/${selectedSchedule._id}`)
                  }
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
