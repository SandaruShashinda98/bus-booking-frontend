import api from "@/api/client";

export const userService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, ...res } = response.data.data;
      setToken(access_token);
      return res;
    } catch (error: unknown) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  async register(userData: object) {
    try {
      const response = (await api.post("/auth/register", userData)) as {
        data: object;
      };
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
      const response = (await api.get("/auth/me")) as { data: object };
      return response.data;
    } catch (error) {
      removeToken();
      console.log(error);
      throw new Error("Failed to get current user");
    }
  },

  async filerUsers() {
    try {
      console.log("hi")
      const response = await api.get("/users");
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to get current user");
    }
  },

  async editUser(userId:string,userData: object) {
    try {
      const response = (await api.patch(`/users/${userId}`, userData)) as {
        data: object;
      };
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(error?.response?.data?.message || "Registration failed");
    }
  },


  async createUser(userData: object) {
    try {
      const response = (await api.patch("/users", userData)) as {
        data: object;
      };
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(error?.response?.data?.message || "Registration failed");
    }
  },
};
