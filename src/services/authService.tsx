import api from "@/api/client";
import { removeToken, setToken } from "@/utils/tokenStorage";

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log(response)
      const { access_token, ...res } = response.data.data;
      setToken(access_token);
      return res;
    } catch (error: unknown) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  async register(userData: object) {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: unknown) {
      throw new Error(error?.response?.data?.message || "Registration failed");
    }
  },

  async logout() {
    try {
      await api.post("/auth/logout");
      removeToken();
    } catch (error) {
      removeToken();
      console.error("Logout error:", error);
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get("/auth/profile");
      return response.data.data;
    } catch (error) {
      // removeToken();
      console.log(error);
      throw new Error("Failed to get current user");
    }
  },

  async editCurrentUser(user_id: number, userData: object) {
    try {
      const response = await api.patch(`/users/${user_id}`, userData);
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current user");
    }
  },
};
