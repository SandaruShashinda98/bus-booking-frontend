import api from "@/api/client";

export const busFleetService = {
  async getAllFleet() {
    try {
      const response = await api.get("/bus-fleet");
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current fleet");
    }
  },

  async createBusFleet(data: object) {
    try {
      const response = await api.post("/bus-fleet", data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current fleet");
    }
  },

  async editFleet(trip_id: number, data: object) {
    try {
      const response = await api.patch(`/bus-fleet/${trip_id}`, data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current fleet");
    }
  },
};
