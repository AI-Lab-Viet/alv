// hooks/useAxiosInterceptor.ts
"use client";

import { useAuth } from "@/contexts/auth-context";
import api from "@/services/axios.service";
import { useLayoutEffect } from "react";

export function useAxiosInterceptor() {
  const { userId, isLoading } = useAuth();

  // useLayoutEffect ensures the interceptor is attached before any child components
  // execute their own effects that might trigger API calls.
  useLayoutEffect(() => {
    const interceptor = api.interceptors.request.use(
      async (config) => {
        // // If auth is still loading, reject the request with a clear error
        // if (isLoading) {
        //   console.warn("Request blocked: Auth still loading");
        //   return Promise.reject(
        //     new Error("Authentication not ready. Please wait.")
        //   );
        // }

        // Auth is ready, attach userId if available
        if (userId) {
          config.headers["user-id"] = userId;
        } else {
          console.warn("No userId available for API request to:", config.url);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [userId, isLoading]);
}
