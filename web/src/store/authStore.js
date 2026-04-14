import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = "/api/auth";

axios.defaults.withCredentials = true;

const generateGuestId = () =>
  "guest_" + Math.random().toString(36).substring(2, 10);

const GUEST_NAMES = [
  "Knight Rider", "Pawn Star", "Bishop Bash", "Rook Raider",
  "Queen Bee", "King Pin", "Castle Crusher", "Check Mate",
  "Dark Horse", "Blitz Kid", "Elo Hunter", "Tempo Thief",
];

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isCheckingAuth: true,
      message: null,

      signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/sign-up`, {
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
            error: error.response.data.message || "Error signing up",
            isLoading: false,
          });
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/sign-in`, {
            email,
            password,
          });
          set({
            isAuthenticated: true,
            user: response.data.user,
            error: null,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error logging in",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.post(`${API_URL}/logout`);
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        } catch (error) {
          set({ error: "Error logging out", isLoading: false });
          throw error;
        }
      },

      loginAsGuest: () => {
        const guestName =
          GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)];
        set({
          user: {
            _id: generateGuestId(),
            name: guestName,
            isGuest: true,
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
          const response = await axios.get(`${API_URL}/check-auth`);
          set({
            user: response.data.user,
            isAuthenticated: true,
            isCheckingAuth: false,
          });
        } catch (error) {
          set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
