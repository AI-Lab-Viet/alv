"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/interfaces/chat.interface";
import { Bot, User } from "lucide-react";
import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Chats({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    };

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]); // Trigger on messages change or loading state change
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={Math.random().toString(36).substring(7)}
            className={`flex gap-3 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "ai" && (
              <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0 border border-slate-200">
                <Bot className="w-4 h-4 text-slate-600" />
              </div>
            )}

            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-sky-300 to-blue-500 text-white shadow-lg"
                  : "bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200 shadow-md"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      className="text-sm break-words whitespace-pre-wrap"
                      {...props}
                    />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-lg break-words whitespace-pre-wrap font-bold"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="text-sm break-words whitespace-pre-wrap list-disc ml-4"
                      {...props}
                    />
                  ),
                }}
              >
                {message.message}
              </ReactMarkdown>
            </div>

            {message.sender === "user" && (
              <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-300">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center border border-slate-200">
              <Bot className="w-4 h-4 text-slate-600" />
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-gray-200 shadow-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
