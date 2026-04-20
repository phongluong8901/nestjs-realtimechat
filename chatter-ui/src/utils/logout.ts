// src/utils/logout.ts
import { API_URL } from "../constants/urls";
import router from "../components/Routes";
import client from "../constants/apollo-client";
import { authenticatedVar } from "../constants/authenticated";

export const logout = async () => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    authenticatedVar(false); // Đánh dấu là đã logout
    await client.clearStore();
    router.navigate("/login");
  }
};
