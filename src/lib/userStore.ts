import User from "../models/User";
import { create } from "zustand";
import { parseCookies, setCookie } from "nookies";

interface UserStore {
  user: User | null;
  isSignedIn: boolean;
  setUser: (user: User) => void;
  signOut: () => void;
}

const initialUser = async (): Promise<User | null> => {
  const baseURL = "http://localhost:4000/";
  const { token } = parseCookies();
  if (!token) {
    return null;
  }
  try {
    const responseOne = await fetch(`${baseURL}auth/${token}`);
    if (responseOne.status === 401) {
      setCookie(null, "token", "", {
        maxAge: -1, // the cookie will be removed
      });
    }
    const dataOne = await responseOne.json();
    const user = dataOne;
    const responseTwo = await fetch(`${baseURL}users/${user.user_id}`);
    const dataTwo = await responseTwo.json();
    const userWithAvatar = dataTwo;
    userWithAvatar.avatar = Buffer.from(userWithAvatar.avatar.data);

    return Promise.resolve(userWithAvatar);
  } catch (e: any) {
    console.log(e);

    return Promise.resolve(null);
  }
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isSignedIn: false,
  setUser: (newUser: User) => {
    set({ user: newUser });
  },
  signOut: () => {
    set({ user: null, isSignedIn: false });
    // Remove the cookie
    setCookie(null, "token", "", {
      maxAge: -1, // the cookie will be removed
      path: "/", // the cookie will be available in all pages
    });
  },
}));

initialUser().then((user) => {
  useUserStore.setState({ user });
});
