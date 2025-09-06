import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from "@/interfaces/chat.interface";
import { DetailedProject } from "@/interfaces/project.interface";
import { MessageSquare } from "lucide-react";
import ChatInput from "./ChatInput";
import Chats from "./Chats";
import ProjectSidebar from "./ProjectSidebar";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  project: DetailedProject;
  completedObjectives: number[];
  handleCompleteObjective: (index: number) => void;
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
}: ChatAreaProps) {
  return (
    <div className="w-full h-full overflow-hidden flex flex-row bg-white backdrop-blur-sm border-white/20 shadow-lg rounded-none">
      <ProjectSidebar
        project={project}
        completedObjectives={completedObjectives}
        onCompleteObjective={handleCompleteObjective}
      />
      <div className="lg:flex-1 flex flex-col">
        <Card className="flex-1 pb-0 flex flex-col  max-h-[85vh] border-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
                AI Lab - Môi trường làm việc
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <Chats messages={messages} isLoading={isLoading} />
            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSendMessage={onSendMessage}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
