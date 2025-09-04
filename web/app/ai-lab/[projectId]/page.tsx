"use client";

import { projectData } from "@/data/mockdata";
import { Message } from "@/interfaces/chat.interface";
import { notFound } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import ProjectSidebar from "./components/ProjectSidebar";
import ChatArea from "./components/ChatArea";
import SubmissionModal from "./components/SubmissionModal";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import UserNote from "./components/UserNote";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://8000-01k2sjwsvx2j62nbvtc48xawyt.cloudspaces.litng.ai";

export default function AILabPage(props: PageProps) {
  const params = use(props.params);
  const project = projectData.find((p) => p.id === params.projectId);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Chào bạn! Tôi là AI Assistant sẽ hỗ trợ bạn hoàn thành dự án "${project?.title}". Tôi đã hiểu rõ bối cảnh và yêu cầu của dự án. Hãy bắt đầu bằng cách cho tôi biết bạn muốn tiếp cận vấn đề như thế nào?`,
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [completedObjectives, setCompletedObjectives] = useState<number[]>([]);
  const [finalSubmission, setFinalSubmission] = useState("");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(
        Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  if (!project) {
    notFound();
  }

  //! TODO: replace fetch with websocket, move to service

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // replace this with websocket

    try {
      const res = await fetch(`${BASE_API_URL}/api/v1/chat/practice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage.content,
          history: messages,
          project_description: project?.description,
          goals: project?.objectives,
        }),
      });

      const data = await res.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response.practice_response || JSON.stringify(data),
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: unknown }).message)
            : "Có lỗi khi gọi API. Vui lòng thử lại.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
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
    (completedObjectives.length / project.objectives.length) * 100;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header
        project={project}
        projectId={params.projectId}
        elapsedTime={elapsedTime}
        progress={progress}
        onSubmissionClick={() => setShowSubmissionForm(true)}
      />

      <div className="w-full mx-auto px-4 py-6 lg:px-8 h-[calc(100vh-200px)]">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-[calc(100vh-200px)] w-full rounded-2xl"
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
              messagesEndRef={messagesEndRef}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSendMessage={handleSendMessage}
              project={project}
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
