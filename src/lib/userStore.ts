import User from "@/models/User";
import { create } from "zustand";
import { parseCookies, setCookie } from "nookies";

interface UserStore {
  user: User;
  isSignedIn: boolean;
  setUser: (user: User) => void;
  signOut: () => void;
}

const initialUser = parseCookies().user
  ? JSON.parse(parseCookies().user)
  : null;

export const useUserStore = create<UserStore>((set) => ({
  user: initialUser,
  isSignedIn: !!initialUser,
  setUser: (user) => {
    set({ user });
    // Save the user in a cookie
    setCookie(null, "user", JSON.stringify(user), {
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      path: "/", // the cookie will be available in all pages
    });
  },
  signOut: () => {
    set({ user: {} });
    // Remove the cookie
    setCookie(null, "user", "", {
      maxAge: -1, // the cookie will be removed
      path: "/", // the cookie will be available in all pages
    });
  },
}));
