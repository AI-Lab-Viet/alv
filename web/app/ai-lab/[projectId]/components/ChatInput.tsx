import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export default function ChatInput({
  inputValue,
  setInputValue,
  onSendMessage,
  isLoading,
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
      <div className="flex gap-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập câu hỏi hoặc yêu cầu cho AI..."
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1 bg-white/80 backdrop-blur-sm border-white/20"
        />
        <Button
          onClick={onSendMessage}
          disabled={!inputValue.trim() || isLoading}
          size="icon"
          className="bg-gradient-to-r from-sky-300 to-blue-500 hover:from-slate-700 hover:to-blue-700 transition-all duration-200"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
