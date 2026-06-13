import { create } from "zustand";
import { persist } from "zustand/middleware";

const VALID_USER = "DHTL2026";
const VALID_PASS = "thanhcong@2026";

type AuthState = {
  isAuthenticated: boolean;
  username: string | null;
  /** true = user đã xem intro trong session này, reset về false mỗi khi login */
  hasSeenIntro: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  markIntroSeen: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      hasSeenIntro: false,
      login: (user, pass) => {
        if (user === VALID_USER && pass === VALID_PASS) {
          // Reset intro mỗi lần đăng nhập để luôn hiển thị lại
          set({ isAuthenticated: true, username: user, hasSeenIntro: false });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, username: null, hasSeenIntro: false }),
      markIntroSeen: () => set({ hasSeenIntro: true }),
    }),
    {
      name: "car-auth",
      // Không persist hasSeenIntro — chỉ lưu thông tin xác thực
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        username: state.username,
      }),
    },
  ),
);
