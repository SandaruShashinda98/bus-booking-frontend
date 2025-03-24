import api from "@/api/client";

export const tripListingService = {
  async getAllTrips() {
    try {
      const response = await api.get("/trip");
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current user");
    }
  },

  async editTrip(trip_id: number, data: object) {
    try {
      const response = await api.patch(`/trip/${trip_id}`, data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current user");
    }
  },
};
