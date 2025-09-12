"use client";

import AiLabSkeleton from "@/components/skeleton/AiLabSkeleton";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAuth } from "@/contexts/auth-context";
import { useChatSession } from "@/contexts/chat-session-context";
import useToggleDialog from "@/hooks/useToggleDialog";
import useWebSocket from "@/hooks/useWebSocket";
import { use, useEffect, useState } from "react";
import AnalysisModal from "./components/AnalysisModal";
import ChatArea from "./components/ChatArea";
import Header from "./components/Header";
import SubmissionModal from "./components/SubmissionModal";
import UserNote from "./components/UserNote";

interface PageProps {
  params: Promise<{
    projectId: string; // This is actually sessionId now
  }>;
}

export default function AILabPage(props: PageProps) {
  const params = use(props.params);
  const sessionId = params.projectId; // This is actually sessionId from URL
  const { currentMissionDetail, fetchSessionDetails, fetchMissionDetails, missionId, analysis } = useChatSession();
  const { userId } = useAuth();
  const {
    connectWebSocket,
    sendMessage,
    messages,
    setMessages,
    isConnected,
    clearError,
    showPromptStarters,
    hidePromptStarters,
    promptStarters,
    completedObjective,
  } = useWebSocket(false);

  const [isLoading, setIsLoading] = useState(false);
  // const [startTime] = useState(new Date());
  const [focusedPanel, setFocusedPanel] = useState<
    "sidebar" | "chat" | "note" | null
  >("chat");
  const [isNotePanelCollapsed, setIsNotePanelCollapsed] = useState(true);
  const [totalCompletedObjectives, setTotalCompletedObjectives] = useState<string[]>([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);

  const [
    showSubmissionForm,
    toggleShowSubmissionForm,
    shouldRenderShowSubmissionForm,
  ] = useToggleDialog();

  const [
    showAnalysis,
    toggleShowAnalysis,
    shouldRenderShowAnalysis,
  ] = useToggleDialog();

  // // Verify session exists and matches URL
  // useEffect(() => {
  //   if (!contextSessionId || contextSessionId !== sessionId) {
  //     console.warn("Session mismatch or no active session");
  //     notFound();
  //   }
  // }, [contextSessionId, sessionId]);

  // Initialize welcome message and fetch session data
  useEffect(() => {
    if (!userId || hasFetchedData) {
      return;
    }

    const fetchData = async () => {
      await fetchSessionDetails(sessionId, setMessages);

      // If mission details are not available from chat history, fetch them separately
      if (!currentMissionDetail && missionId) {
        await fetchMissionDetails(missionId);
      }

      setHasFetchedData(true);
    };
    fetchData();
  }, [userId, sessionId, missionId, hasFetchedData]);

  useEffect(() => {
    // Only show analysis modal if:
    // 1. Analysis data exists
    // 2. Modal is not already showing
    // 3. Analysis belongs to the current session (session_id matches)
    if (analysis && !showAnalysis && analysis.session_id?.trim() === sessionId?.trim()) {
      toggleShowAnalysis();
    }
  }, [analysis, showAnalysis, toggleShowAnalysis, sessionId]);

  // Establish WebSocket connection once we have the identifiers ready
  useEffect(() => {
    if (!sessionId || !missionId || !userId) return;
    if (!isConnected) {
      connectWebSocket();
    }
  }, [sessionId, missionId, userId, isConnected]);


  if (!currentMissionDetail) {
    return <AiLabSkeleton />;
  }

  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim()) return;

    if (!isConnected) {
      return;
    }

    setIsLoading(true);
    try {
      // Send message through WebSocket 
      sendMessage(inputValue);
      clearError(); // Clear any previous WebSocket errors
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handlePanelFocus = (panel: "sidebar" | "chat" | "note" | null) => {
    setFocusedPanel(panel);
  };

  const handleContainerClick = () => {
    setFocusedPanel("chat");
  };

  const toggleNotePanel = () => {
    setIsNotePanelCollapsed(!isNotePanelCollapsed);
  };

  const handleCompleteObjective = (objective: string) => {
    setTotalCompletedObjectives([...totalCompletedObjectives, objective]);
  };

  const progress =
    (totalCompletedObjectives.length /
      currentMissionDetail.learning_objectives.length) *
    100;

  return (
    <div
      className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"
      onClick={handleContainerClick}
    >
      <Header
        project={currentMissionDetail}
        projectId={currentMissionDetail.id}
        progress={progress}
        toggleSubmissionForm={toggleShowSubmissionForm}
      />

      <div className="flex-1 w-full mx-auto px-0 py-0 md:px-4 md:py-6 lg:px-8 min-h-0">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full rounded-2xl"
        >
          <ResizablePanel
            defaultSize={isNotePanelCollapsed ? 100 : 75}
            minSize={isNotePanelCollapsed ? 100 : 50}
            maxSize={100}
            className="h-full"
          >
            <ChatArea
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              project={currentMissionDetail}
              focusedPanel={focusedPanel}
              onPanelFocus={handlePanelFocus}
              isNotePanelCollapsed={isNotePanelCollapsed}
              toggleNotePanel={toggleNotePanel}
              showPromptStarters={showPromptStarters}
              promptStarters={promptStarters}
              hidePromptStarters={hidePromptStarters}
              completedObjective={completedObjective}
              totalCompletedObjectives={totalCompletedObjectives}
              handleCompleteObjective={handleCompleteObjective}
            />
          </ResizablePanel>
          {!isNotePanelCollapsed && (
            <>
              <ResizableHandle />
              <ResizablePanel
                defaultSize={25}
                minSize={10}
                maxSize={50}
                className="h-full"
              >
                <UserNote
                  focusedPanel={focusedPanel}
                  onPanelFocus={handlePanelFocus}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
      {shouldRenderShowSubmissionForm && (
        <SubmissionModal
          toggleSubmissionForm={toggleShowSubmissionForm}
          missionId={currentMissionDetail.id}
          handleCompleteObjective={handleCompleteObjective}
          learningObjectives={currentMissionDetail.learning_objectives}
        />
      )}
      {shouldRenderShowAnalysis && (
        <AnalysisModal
          isOpen={showAnalysis}
          toggleAnalysis={toggleShowAnalysis}
          analysis={analysis}
          missionId={currentMissionDetail.id}
        />
      )}
    </div>
  );
}
