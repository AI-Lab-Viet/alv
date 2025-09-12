"use client";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Message, PromptStarterType } from "@/interfaces/chat.interface";
import { DetailedProject } from "@/interfaces/project.interface";
import { MessageSquare, Notebook } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import ChatInput from "./ChatInput";
import Chats from "./Chats";
import ProjectSidebar from "./ProjectSidebar";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (inputValue: string) => void;
  project: DetailedProject;
  focusedPanel: "sidebar" | "chat" | "note" | null;
  onPanelFocus: (panel: "sidebar" | "chat" | "note" | null) => void;
  isNotePanelCollapsed: boolean;
  toggleNotePanel: () => void;
  showPromptStarters: boolean;
  promptStarters: PromptStarterType[];
  hidePromptStarters: () => void;
  completedObjective: string;
  totalCompletedObjectives: string[];
  handleCompleteObjective: (objective: string) => void;
}

export default function ChatArea({
  messages,
  isLoading,
  onSendMessage,
  project,
  focusedPanel,
  onPanelFocus,
  isNotePanelCollapsed,
  toggleNotePanel,
  showPromptStarters,
  promptStarters,
  hidePromptStarters,
  completedObjective,
  totalCompletedObjectives,
  handleCompleteObjective,
}: ChatAreaProps) {
  const handleSendMessage = (inputValue: string) => {
    onSendMessage(inputValue);
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-row bg-white backdrop-blur-sm  shadow-lg rounded-none">
      <div
        className={`transition-all duration-300 ${
          focusedPanel && focusedPanel !== "sidebar"
            ? "opacity-50"
            : "opacity-100"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onPanelFocus("sidebar");
        }}
      >
        <ProjectSidebar
          project={project}
          focusedPanel={focusedPanel}
          onPanelFocus={onPanelFocus}
          completedObjective={completedObjective}
          totalCompletedObjectives={totalCompletedObjectives}
          handleCompleteObjective={handleCompleteObjective}
        />
      </div>
      <div
        className={`flex flex-col h-full flex-1 transition-all duration-300 relative ${
          focusedPanel && focusedPanel !== "chat" ? "opacity-50" : "opacity-100"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onPanelFocus("chat");
        }}
      >
        {/* Fixed Card Header */}
        <CardHeader className="h-12 py-3 shrink-0 bg-zinc-200/20 backdrop-blur-lg border-none rounded-none shadow-none ">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 pb-3">
              <MessageSquare className="w-5 h-5 text-zinc-500" />

              <span className="font-semibold">
                AI Lab - Môi trường làm việc
              </span>
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNotePanel();
                  }}
                  className="h-8 w-8 pb-3 hover:bg-zinc-200"
                >
                  <Notebook className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isNotePanelCollapsed ? "Mở ghi chú" : "Đóng ghi chú"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        {/* <Separator className="my-0 bg-gray-50" /> */}

        {/* Scrollable Chat Content */}
        <div className="flex-1 min-h-0">
          <Chats messages={messages} isLoading={isLoading} />
        </div>

        {/* Fixed Chat Input */}
        <div className="shrink-0 px-6 pb-1">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            showPromptStarters={showPromptStarters}
            promptStarters={promptStarters}
            hidePromptStarters={hidePromptStarters}
          />
        </div>
      </div>
    </div>
  );
}
