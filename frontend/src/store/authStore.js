import axios from "axios";
import { create } from "zustand";

const API_AUTH_URL = "http://localhost:5001/api/auth";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_AUTH_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Signup failed",
        isLoading: false,
      });
      throw error;
    }
  },
  login : async (email, password) => {
    set({ isLoading: true, error: null});
    try {
      const res = await axios.post(`${API_AUTH_URL}/login`,{
        email,
        password
      })
      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })
      return res.data ;
    } catch (error) {
      set({
        error: error.res?.data?.message || "Login failed",
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },
  logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_AUTH_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
  verifyEmail: async (verificationCode) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_AUTH_URL}/verify-email`, {
        verificationToken: verificationCode,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Email verification failed",
      });
      throw error;
    }
  },
  checkAuth: async()=>{
    //await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
    try {
      const res = await axios.get(`${API_AUTH_URL}/check-auth`);
      set({
        user: res.data.user || null,
        isAuthenticated: !!res.data.user,
        isCheckingAuth: false
      })
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false
      })
      console.error("Error checking authentication: ", error.message);
    }
  }
}));