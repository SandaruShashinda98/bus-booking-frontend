import api from "@/api/client";

export const menuManagementService = {
  async getAllMenus() {
    try {
      const response = await api.get("/menu");
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current menu");
    }
  },

  async getAllPublicMenus() {
    try {
      const response = await api.get("/menu/public");
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current menu");
    }
  },

  async getAllOrders() {
    try {
      const response = await api.get("/menu/orders");
      console.log(response)
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current menu");
    }
  },

  async createMenu(data: object) {
    try {
      const response = await api.post("/menu", data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current menu");
    }
  },

  async editMenu(menu_id: number, data: object) {
    try {
      const response = await api.patch(`/menu/${menu_id}`, data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current menu");
    }
  },

  async editMenuFood(data: object) {
    try {
      const response = await api.patch(`/menu/food`, data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current menu");
    }
  },

  async editBooking(id:string,data: object) {
    try {
      const response = await api.patch(`/booking/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current menu");
    }
  },
};
