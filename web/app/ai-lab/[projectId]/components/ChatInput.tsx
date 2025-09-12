import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromptStarterType } from "@/interfaces/chat.interface";
import { Lightbulb, Send } from "lucide-react";
import { useEffect, useState } from "react";

interface ChatInputProps {
  onSendMessage: (inputValue: string) => void;
  isLoading: boolean;
  showPromptStarters: boolean;
  promptStarters: PromptStarterType[];
  hidePromptStarters: () => void;
}

export default function ChatInput({
  onSendMessage,
  isLoading,
  showPromptStarters,
  promptStarters,
  hidePromptStarters,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltip, setTooltip] = useState<React.ReactNode>("");

  useEffect(() => {
    if (
      inputValue.trim().toLowerCase() === "ok, hãy viết cho tôi về luận điểm 1"
    ) {
      setTooltip(
        <span className="font-semibold">
          Mẹo từ ALVA: Áp dụng công thức{" "}
          <span className="font-semibold">R.C.T.C.</span> (Vai trò, Bối cảnh...)
          để có kết quả sâu sắc hơn nhé!
        </span>
      );
      setTimeout(() => {
        setShowTooltip(true);
      }, 500);
    } else {
      setShowTooltip(false);
    }
  }, [inputValue]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue(""); // Clear input after sending
  };

  return (
    <div className="p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm relative">
      {showPromptStarters && (
        <div className="absolute w-full h-fit flex flex-col items-start bottom-20 left-0 bg-white border-t border-gray-200 rounded-md mt-2 z-50">
          <p className="text-sm tracking-tight text-gray-400 px-4 pt-2">
            Đang gặp khó khăn? Thử bắt đầu với các prompt mẫu:
          </p>
          <div className="px-4 py-2 w-full h-fit flex flex-wrap gap-2">
            {promptStarters.map((starter, index) => (
              <Button
                variant={"outline"}
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer  h-fit text-left whitespace-normal break-words w-full"
                style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                onClick={() => {
                  setInputValue(starter.prompt);
                  // hidePromptStarters();
                }}
              >
                <span className="block w-full text-left">{starter.prompt}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
      {showTooltip && (
        <div className="absolute w-full h-fit flex flex-col items-start justify-center bottom-16 left-0 bg-gray-100 border-t border-gray-200 rounded-md mt-2 z-50">
          <p className="text-sm tracking-tight text-gray-600 px-4 py-2 flex flex-row items-center">
            <Lightbulb
              className="w-4 h-4 mr-2 text-yellow-300"
              fill="currentColor"
            />
            {tooltip}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập câu hỏi hoặc yêu cầu cho AI..."
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="flex-1 bg-zinc-200/20 shadow-none backdrop-blur-sm border-white/20"
        />
        <Button
          onClick={handleSendMessage}
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
