import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants/urls";
import client from "../constants/apollo-client";
import { snackVar } from "../constants/snack"; // 1. Import snackVar

interface LoginRequest {
  email: string;
  password: string;
}

const useLogin = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (request: LoginRequest) => {
    try {
      setError("");

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          res.status === 401
            ? "Email hoặc mật khẩu không chính xác."
            : errorData.message || "Đã có lỗi xảy ra.";

        setError(errorMessage);

        // 2. Hiện thông báo lỗi lên Snackbar
        snackVar({ message: errorMessage, type: "error" });
        return;
      }

      try {
        await client.resetStore();
        // Tùy chọn: Hiện thông báo thành công
        snackVar({ message: "Đăng nhập thành công!", type: "success" });
      } catch (apolloError) {
        console.warn("Apollo resetStore notice:", apolloError);
      }

      navigate("/");
    } catch (err) {
      const connectionError =
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.";
      setError(connectionError);

      // 3. Hiện thông báo lỗi kết nối
      snackVar({ message: connectionError, type: "error" });
      console.error("Login Error:", err);
    }
  };

  return { login, error };
};

export { useLogin };
