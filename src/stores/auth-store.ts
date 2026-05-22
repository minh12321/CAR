import { create } from "zustand";
import { persist } from "zustand/middleware";

const VALID_USER = "DHTL2026";
const VALID_PASS = "thanhcong@2026";

type AuthState = {
  isAuthenticated: boolean;
  username: string | null;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      login: (user, pass) => {
        if (user === VALID_USER && pass === VALID_PASS) {
          set({ isAuthenticated: true, username: user });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, username: null }),
    }),
    { name: "car-auth" },
  ),
);
