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
import {
  DetailedProject,
  IAnalysisResponse,
  IFinishSessionResponse,
} from "@/interfaces/project.interface";
import { IStartSessionResponse } from "@/interfaces/session.interface";
import {
  finishSession,
  getChatHistory,
  startSession,
} from "@/services/chat.service";
import { getProjectById } from "@/services/projects.service";
import { useAxiosInterceptor } from "@/hooks/useAxiosInterceptor";
import { Message } from "@/interfaces/chat.interface";

interface ChatSessionContextType {
  sessionId: string | undefined;
  missionId: string | undefined;
  currentMissionDetail: DetailedProject | undefined;
  isLoading: boolean;
  error: string | null;
  startNewSession: (missionId: string) => Promise<{ sessionId: string, missionId: string }>;
  clearError: () => void;
  clearSession: () => void;
  clearAnalysis: () => void;
  fetchSessionDetails: (
    sessionId: string,
    setMessages: (msg: Message[]) => void
  ) => Promise<void>;
  fetchMissionDetails: (missionId: string) => Promise<void>;
  finishCurrentSession: ({
    finalSubmission,
    reflection,
  }: {
    finalSubmission: string;
    reflection: string;
  }) => Promise<void>;
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
  const [missionId, setMissionId] = useState<string>();
  const [currentMissionDetail, setCurrentMissionDetail] =
    useState<DetailedProject>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<IFinishSessionResponse>();
  useAxiosInterceptor();

  async function startNewSession(missionId: string): Promise<{ sessionId: string, missionId: string }> {
    setIsLoading(true);
    setError(null);
    clearAnalysis(); // Clear any existing analysis when starting new session

    try {
      const response = await startSession(missionId);
      // Check for successful status codes (200-299)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Error creating new session: ${response.status}`);
      }
      const responseData = response.data as IStartSessionResponse;
      // Set sessionId and missionId immediately for WebSocket stability
      setSessionId(responseData.session_id);
      setMissionId(responseData.mission.id);
      setIsLoading(false);
      return {
        sessionId: responseData.session_id,
        missionId: responseData.mission.id
      };
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

  const clearAnalysis = () => setAnalysis(undefined);

  const clearSession = () => {
    setSessionId(undefined);
    setMissionId(undefined);
    setCurrentMissionDetail(undefined);
    setError(null);
    clearAnalysis(); // Clear analysis when clearing session
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

      // Always set the session ID
      setSessionId(sessionId);

      if (response.mission_detail) {
        setCurrentMissionDetail(response.mission_detail);
      } else {
        // If no mission detail in chat history, we need to fetch it separately
        // For now, we'll leave this as undefined and handle it in the component
        console.warn("No mission detail found in chat history response");
      }

      if (response.chat_history.length) {
        setMessages(response.chat_history);
      }
    } catch (error: unknown) {
      // If the session is new, the backend might legitimately respond with 404 (no history yet).
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.info(
          "No chat history found yet – this is expected for a new session."
        );
        // Set session ID but keep mission detail undefined
        setSessionId(sessionId);
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

  async function fetchMissionDetails(missionId: string) {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching mission details for:", missionId);
      const missionDetail = await getProjectById({ missionId });
      setCurrentMissionDetail(missionDetail);
      // Ensure missionId is set (in case it wasn't set during session creation)
      setMissionId(missionId);
    } catch (error) {
      console.error("Failed to fetch mission details:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch mission details";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function finishCurrentSession({
    finalSubmission,
    reflection,
  }: {
    finalSubmission: string;
    reflection: string;
  }) {
    setIsLoading(true);
    setError(null);
    if (!sessionId) {
      setIsLoading(false);
      return;
    }
    try {
      console.log("Finishing session:", sessionId);
      const response = await finishSession(
        sessionId,
        finalSubmission,
        reflection
      );
      console.log("Session finished:", response);
      setAnalysis(response);
      // Don't clear session immediately - let the analysis modal handle navigation
      // clearSession();
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to finish session:", error);
      setError(
        error instanceof Error ? error.message : "Failed to finish session"
      );
    } finally {
      setIsLoading(false);
    }
  }

  const value: ChatSessionContextType = useMemo(
    () => ({
      sessionId,
      missionId,
      currentMissionDetail,
      isLoading,
      error,
      startNewSession,
      clearError,
      clearSession,
      clearAnalysis,
      fetchSessionDetails,
      fetchMissionDetails,
      finishCurrentSession,
      analysis,
    }),
    [sessionId, missionId, currentMissionDetail, isLoading, error, analysis]
  );

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
