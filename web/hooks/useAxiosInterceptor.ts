// hooks/useAxiosInterceptor.ts
"use client";

import { useAuth } from "@/contexts/auth-context";
import api from "@/services/axios.service";
import { useEffect } from "react";

export function useAxiosInterceptor() {
  const { userId } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (userId) {
        // attach userId in headers (recommended) or params
        config.headers["user-id"] = userId;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [userId]);
}
