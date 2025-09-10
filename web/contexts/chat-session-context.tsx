"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import { DetailedProject, IAnalysisResponse, IFinishSessionResponse } from "@/interfaces/project.interface";
import { IStartSessionResponse } from "@/interfaces/session.interface";
import { finishSession, getChatHistory, startSession } from "@/services/chat.service";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";
import { Message } from "@/interfaces/chat.interface";

interface ChatSessionContextType {
  sessionId: string | undefined;
  missionId: string | undefined;
  currentMissionDetail: DetailedProject | undefined;
  isLoading: boolean;
  error: string | null;
  startNewSession: (missionId: string) => Promise<string>;
  clearError: () => void;
  clearSession: () => void;
  fetchSessionDetails: (
    sessionId: string,
    setMessages: (msg: Message[]) => void
  ) => Promise<void>;
  finishCurrentSession: () => Promise<void>;
  analysis: IFinishSessionResponse | undefined;
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
  const [analysis, setAnalysis] = useState<IFinishSessionResponse>();
  useAxiosInterceptor();

  async function startNewSession(missionId: string): Promise<string> {
    setIsLoading(true);
    setError(null);

    try {
      const response = await startSession(missionId);
      // Check for successful status codes (200-299)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Error creating new session: ${response.status}`);
      }
      const responseData = response.data as IStartSessionResponse;
      setSessionId(responseData.session_id);
      setCurrentMissionDetail(responseData.mission);
      setIsLoading(false);
      return responseData.session_id;
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

  async function fetchSessionDetails(
    sessionId: string,
    setMessages: (msg: Message[]) => void
  ) {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching session details for:", sessionId);
      const response = await getChatHistory({ sessionId });
      console.log("Session details response:", response);
      if (response.mission_detail) {
        setCurrentMissionDetail(response.mission_detail);
      }
      if (response.chat_history.length) {
        setMessages(response.chat_history);
      }
      setSessionId(sessionId);
    } catch (error: unknown) {
      // If the session is new, the backend might legitimately respond with 404 (no history yet).
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.info("No chat history found yet – this is expected for a new session.");
        // Simply keep mission detail undefined and return without setting an error.
        return;
      }

      console.error("Failed to fetch session details:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch session details";
      setError(errorMessage);
      // No re-throw; errors are handled here
    } finally {
      setIsLoading(false);
    }
  }

  async function finishCurrentSession() {
    setIsLoading(true);
    setError(null);
    if(!sessionId) {
      setIsLoading(false);
      return;
    }
    try {
      console.log("Finishing session:", sessionId);
      const response = await finishSession(sessionId);
      console.log("Session finished:", response);
      setAnalysis(response);
      clearSession();
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to finish session:", error);
      setError(error instanceof Error ? error.message : "Failed to finish session");
    } finally {
      setIsLoading(false);
    }
  }

  const value: ChatSessionContextType = useMemo(() => ({
    sessionId,
    missionId: currentMissionDetail?.id,
    currentMissionDetail,
    isLoading,
    error,
    startNewSession,
    clearError,
    clearSession,
    fetchSessionDetails,
    finishCurrentSession,
    analysis,
  }), [sessionId, currentMissionDetail, isLoading, error, analysis]);

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
