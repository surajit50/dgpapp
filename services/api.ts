import { LoginRequest, LoginResponse } from "../types/auth";

const BASE_URL = "https://dhalparagp.in/api";

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    console.log("Login attempt with:", {
      email: credentials.email,
      hasPassword: !!credentials.password,
      hasCode: !!credentials.code,
    });

    const response = await fetch(`${BASE_URL}/auth/mobile-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "React-Native-App",
      },
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
        code: credentials.code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error instanceof Error ? error : new Error("Network request failed");
  }
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${BASE_URL}/health`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error(
      "API health check failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return false;
  }
};
