"use client";

import MissionPageSkeletion from "@/components/skeleton/MissionPageSkeletion";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useChatSession } from "@/contexts/chat-session-context";
import useWebSocket from "@/hooks/useWebSocket";
import { use, useEffect, useState } from "react";
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
  const { currentMissionDetail, sessionId: contextSessionId } =
    useChatSession();
  const {
    sendMessage,
    messages,
    setMessages,
    isConnected,
    error: wsError,
    clearError,
  } = useWebSocket();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [completedObjectives, setCompletedObjectives] = useState<number[]>([]);
  const [finalSubmission, setFinalSubmission] = useState("");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);

  // // Verify session exists and matches URL
  // useEffect(() => {
  //   if (!contextSessionId || contextSessionId !== sessionId) {
  //     console.warn("Session mismatch or no active session");
  //     notFound();
  //   }
  // }, [contextSessionId, sessionId]);

  // Initialize welcome message

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(
        Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  if (!currentMissionDetail) {
    return <MissionPageSkeletion />;
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!isConnected) {
      console.warn("WebSocket not connected");
      return;
    }

    setIsLoading(true);
    try {
      // Send message through WebSocket
      sendMessage(inputValue);
      setInputValue("");
      clearError(); // Clear any previous WebSocket errors
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteObjective = (index: number) => {
    if (!completedObjectives.includes(index)) {
      setCompletedObjectives([...completedObjectives, index]);
    }
  };

  const handleSubmitProject = () => {
    // Here would be the logic to save the project and chat history
    alert(
      "Dự án đã được nộp thành công! Kết quả sẽ được thêm vào portfolio của bạn."
    );
  };

  const progress =
    (completedObjectives.length /
      currentMissionDetail.learning_objectives.length) *
    100;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header
        project={currentMissionDetail}
        projectId={currentMissionDetail.id}
        elapsedTime={elapsedTime}
        progress={progress}
        onSubmissionClick={() => setShowSubmissionForm(true)}
      />

      <div className="flex-1 w-full mx-auto px-4 py-6 lg:px-8 min-h-0">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full rounded-2xl"
        >
          <ResizablePanel
            defaultSize={75}
            minSize={50}
            maxSize={90}
            className="h-full"
          >
            <ChatArea
              messages={messages}
              isLoading={isLoading}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSendMessage={handleSendMessage}
              project={currentMissionDetail}
              completedObjectives={completedObjectives}
              handleCompleteObjective={handleCompleteObjective}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            defaultSize={25}
            minSize={10}
            maxSize={50}
            className="h-full"
          >
            <UserNote />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <SubmissionModal
        isOpen={showSubmissionForm}
        finalSubmission={finalSubmission}
        setFinalSubmission={setFinalSubmission}
        onSubmit={handleSubmitProject}
        onClose={() => setShowSubmissionForm(false)}
      />
    </div>
  );
}
