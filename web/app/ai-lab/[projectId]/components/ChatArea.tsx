import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from "@/interfaces/chat.interface";
import { DetailedProject } from "@/interfaces/project.interface";
import { MessageSquare } from "lucide-react";
import ChatInput from "./ChatInput";
import Chats from "./Chats";
import ProjectSidebar from "./ProjectSidebar";
import { Separator } from "@/components/ui/separator";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  project: DetailedProject;
  completedObjectives: number[];
  handleCompleteObjective: (index: number) => void;
  focusedPanel: 'sidebar' | 'chat' | 'note' | null;
  onPanelFocus: (panel: 'sidebar' | 'chat' | 'note' | null) => void;
}

export default function ChatArea({
  messages,
  isLoading,
  inputValue,
  setInputValue,
  onSendMessage,
  project,
  completedObjectives,
  handleCompleteObjective,
  focusedPanel,
  onPanelFocus,
}: ChatAreaProps) {
  return (
    <div className="w-full h-full overflow-hidden flex flex-row bg-white backdrop-blur-sm  shadow-lg rounded-none">
      <div
        className={`transition-all duration-300 ${focusedPanel && focusedPanel !== 'sidebar' ? 'opacity-50' : 'opacity-100'}`}
        onClick={(e) => {
          e.stopPropagation();
          onPanelFocus('sidebar');
        }}
      >
        <ProjectSidebar
          project={project}
          completedObjectives={completedObjectives}
          onCompleteObjective={handleCompleteObjective}
          focusedPanel={focusedPanel}
          onPanelFocus={onPanelFocus}
        />
      </div>
      <div
        className={`flex flex-col h-full flex-1 transition-all duration-300 ${focusedPanel && focusedPanel !== 'chat' ? 'opacity-50' : 'opacity-100'}`}
        onClick={(e) => {
          e.stopPropagation();
          onPanelFocus('chat');
        }}
      >
        {/* Fixed Card Header */}
        <CardHeader className="h-12 py-3 shrink-0 bg-zinc-200/20 backdrop-blur-lg border-none rounded-none shadow-none ">
          <CardTitle className="text-lg flex items-center gap-2 pb-3">
            <MessageSquare className="w-5 h-5 text-zinc-500" />

            <span className="font-semibold">
              AI Lab - Môi trường làm việc
            </span>
          </CardTitle>
        </CardHeader>
        {/* <Separator className="my-0 bg-gray-50" /> */}

        {/* Scrollable Chat Content */}
        <div className="flex-1 min-h-0">
          <Chats messages={messages} isLoading={isLoading} />
        </div>

        {/* Fixed Chat Input */}
        <div className="shrink-0 px-6 pb-1">
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
