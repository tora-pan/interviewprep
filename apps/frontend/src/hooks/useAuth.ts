import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

export type LoginInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const AUTH_CHANGED_EVENT = "auth-changed";

async function loginRequest(credentials: LoginInput): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = (await response.json()) as LoginResponse | { detail?: string };

  if (!response.ok) {
    const message =
      "detail" in data && data.detail
        ? data.detail
        : "Sign in failed. Try again.";
    throw new Error(message);
  }

  return data as LoginResponse;
}

async function signupRequest(payload: SignUpInput): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as LoginResponse | { detail?: string };

  if (!response.ok) {
    const message =
      "detail" in data && data.detail
        ? data.detail
        : "Create account failed. Try again.";
    throw new Error(message);
  }

  return data as LoginResponse;
}

function dispatchAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

function persistAuth(data: LoginResponse, email: string) {
  localStorage.setItem("authToken", data.access_token);
  localStorage.setItem("authTokenType", data.token_type);
  localStorage.setItem("authUserEmail", email);
  dispatchAuthChange();
}

export function useLoginMutation() {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: loginRequest,
    onSuccess: (data, variables) => {
      persistAuth(data, variables.email);
    },
  });
}

export function useSignupMutation() {
  return useMutation<LoginResponse, Error, SignUpInput>({
    mutationFn: signupRequest,
    onSuccess: (data, variables) => {
      persistAuth(data, variables.email);
    },
  });
}

export function useAuthUser() {
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem("authUserEmail"),
  );

  useEffect(() => {
    const syncAuthUser = () => {
      setUserEmail(localStorage.getItem("authUserEmail"));
    };

    window.addEventListener("storage", syncAuthUser);
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuthUser);

    return () => {
      window.removeEventListener("storage", syncAuthUser);
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuthUser);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenType");
    localStorage.removeItem("authUserEmail");
    dispatchAuthChange();
  };

  return {
    userEmail,
    isAuthenticated: Boolean(userEmail),
    logout,
  };
}
