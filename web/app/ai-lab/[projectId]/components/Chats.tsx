"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/interfaces/chat.interface";
import { Bot, User } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import avatarMascot from "@/public/images/mascot/face-removebg-preview.png";

interface ChatsProps {
  messages: Message[];
  isLoading: boolean;
}

export default function Chats({ messages, isLoading }: ChatsProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  // Function to check if message contains "50,000"
  const containsFiftyThousand = (text: string) => {
    return text.includes("50,000");
  };

  // Function to check if message is a tip message
  const isTipMessage = (text: string) => {
    return text.startsWith("💡 **Mẹo từ ALVA:**");
  };

  // Create extended messages array with tips
  const extendedMessages = messages.reduce((acc: Message[], message, index) => {
    acc.push(message);
    if (message.sender === "ai" && containsFiftyThousand(message.message)) {
      acc.push({
        sender: "ai",
        message: "💡 **Mẹo từ ALVA:** Với các số liệu và nguồn trích dẫn cụ thể, hãy luôn thực hành kỹ năng **Nhận định** để kiểm chứng nhé!",
      });
    }
    return acc;
  }, []);
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (
      extendedMessages.length > 0 &&
      extendedMessages[extendedMessages.length - 1].sender === "user"
    ) {
      setWaitingForResponse(true);
    } else if (
      extendedMessages.length > 0 &&
      extendedMessages[extendedMessages.length - 1].sender === "ai"
    ) {
      setWaitingForResponse(false);
    }

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
  }, [extendedMessages]); // Trigger on messages change or loading state change
  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {extendedMessages.map((message) => (
            <div
              key={Math.random().toString(36).substring(7)}
              className={`flex gap-3 mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {message.sender === "ai" && (
                <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0 border border-slate-200">
                  {/* <Bot className="w-4 h-4 text-slate-600" /> */}
                  <Avatar>
                    <AvatarImage
                      src={avatarMascot.src}
                      alt="AI Lab Việt"
                      className="bg-white"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                </div>
              )}

              {message.sender === "user" ? (
                <div className="max-w-[80%] rounded-2xl p-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg">
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
              ) : (
                <div
                  className={
                    isTipMessage(message.message)
                      ? "relative max-w-[80%] p-4 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg shadow-yellow-400/30"
                      : "max-w-[80%] p-4 rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200"
                  }
                >
                  {isTipMessage(message.message) && (
                    <div className="absolute inset-0 rounded-2xl border-2 border-yellow-400 animate-pulse pointer-events-none"></div>
                  )}
                  <div className="relative text-gray-900">
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
                </div>
              )}

              {message.sender === "user" && (
                <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-300">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {waitingForResponse && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center border border-slate-200">
                <Avatar>
                  <AvatarImage
                    src={avatarMascot.src}
                    alt="AI Lab Việt"
                    className="bg-white"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
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
    </div>
  );
}
