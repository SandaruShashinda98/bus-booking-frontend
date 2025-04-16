import api from "@/api/client";

export const tripListingService = {
  async getAllTrips() {
    try {
      const response = await api.get("/trip");
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current trip");
    }
  },

  async getAllTripsWithFilter(filters) {
    try {
      const queryParams = new URLSearchParams();

      if (filters.from) queryParams.append("from", filters.from);
      if (filters.to) queryParams.append("to", filters.to);
      if (filters.date) queryParams.append("date", filters.date);
      if (filters.timePreference) queryParams.append("timePreference", filters.timePreference);

      const response = await api.get(`/trip/public?${queryParams.toString()}`);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current trip");
    }
  },

  async getSingleTrip(trip_id: string) {
    try {
      const response = await api.get(`/trip/${trip_id}`);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current trip");
    }
  },

  async createTrip(data: object) {
    try {
      const response = await api.post("/trip", data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current trip");
    }
  },

  async editTrip(trip_id: number, data: object) {
    try {
      const response = await api.patch(`/trip/trip-booking/${trip_id}`, data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current trip");
    }
  },

  async updateTripOnly(trip_id: number, data: object) {
    try {
      const response = await api.patch(`/trip/${trip_id}`, data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current trip");
    }
  },
};
