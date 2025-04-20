import api from "@/api/client";

export const bookingService = {
  async editBooking(trip_id: number, data: object) {
    try {
      const response = await api.patch(
        `/booking/booking-payment/${trip_id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current booking");
    }
  },

  async cancelBooking(data: object) {
    try {
      const response = await api.patch(`/booking/cancel`, data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current booking");
    }
  },

  async getBooking(id: string) {
    try {
      const response = await api.get(`/booking/${id}`);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current booking");
    }
  },
};
