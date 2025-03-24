import api from "@/api/client";

export const busStaffListingService = {
  async getAllStaff() {
    try {
      const response = await api.get("/bus-staff");
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current staff");
    }
  },

  async createBusStaff(data: object) {
    try {
      const response = await api.post("/bus-staff", data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current staff");
    }
  },

  async editStaff(trip_id: number, data: object) {
    try {
      const response = await api.patch(`/bus-staff/${trip_id}`, data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current staff");
    }
  },
};
