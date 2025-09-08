"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DetailedProject } from "@/interfaces/project.interface";
import { IStartSessionResponse } from "@/interfaces/session.interface";
import { startSession } from "@/services/chat.service";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";

interface ChatSessionContextType {
  sessionId: string | undefined;
  missionId: string | undefined;
  currentMissionDetail: DetailedProject | undefined;
  isLoading: boolean;
  error: string | null;
  startNewSession: (missionId: string) => Promise<void>;
  clearError: () => void;
  clearSession: () => void;
}

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(
  undefined
);

interface ChatSessionProviderProps {
  children: ReactNode;
}

export function ChatSessionProvider({ children }: ChatSessionProviderProps) {
  const [sessionId, setSessionId] = useState<string>();
  const [currentMissionDetail, setCurrentMissionDetail] =
    useState<DetailedProject>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useAxiosInterceptor();

  async function startNewSession(missionId: string) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await startSession(missionId);
      // Check for successful status codes (200-299)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Error creating new session: ${response.status}`);
      }
      console.log("Start session full response:", response);
      const responseData = response.data as IStartSessionResponse;
      setSessionId(responseData.session_id);
      console.log("sessionId:", responseData.session_id);
      setCurrentMissionDetail(responseData.mission);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start new session";
      console.error("Failed to start new session:", error);
      setError(errorMessage);
      // Re-throw to let the calling component handle it if needed
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const clearError = () => setError(null);

  const clearSession = () => {
    setSessionId(undefined);
    setCurrentMissionDetail(undefined);
    setError(null);
  };

  const value: ChatSessionContextType = {
    sessionId,
    missionId: currentMissionDetail?.id,
    currentMissionDetail,
    isLoading,
    error,
    startNewSession,
    clearError,
    clearSession,
  };

  return (
    <ChatSessionContext.Provider value={value}>
      {children}
    </ChatSessionContext.Provider>
  );
}

export function useChatSession(): ChatSessionContextType {
  const context = useContext(ChatSessionContext);
  if (context === undefined) {
    throw new Error("useChatSession must be used within a ChatSessionProvider");
  }
  return context;
}
