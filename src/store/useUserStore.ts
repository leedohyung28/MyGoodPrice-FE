import { UserTypes } from "@/types";
import { create } from "zustand";

type userState = {
  userInfo: UserTypes;
  loading: boolean;
  setUserInfo: (newInfo: Partial<userState["userInfo"]>) => void;
  setLoading: (isLoading: boolean) => void;
};

const useUserStore = create<userState>((set) => ({
  userInfo: {
    id: null,
    name: "",
    provider: "",
    likes: JSON.parse(localStorage.getItem("likes") || "[]") as string[],
    location: {
      latitude: "",
      longitude: "",
    },
  },

  loading: false,

  setUserInfo: (newInfo) =>
    set((state) => ({
      userInfo: {
        ...state.userInfo,
        ...newInfo,
      },
    })),
  setLoading: (isLoading) => set(() => ({ loading: isLoading })),
}));

export default useUserStore;
