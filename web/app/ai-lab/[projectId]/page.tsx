"use client";

import { useState, useRef, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Send,
  Bot,
  User,
  ChevronLeft,
  FileText,
  Target,
  CheckCircle,
  Upload,
  Save,
  Lightbulb,
  Clock,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TutorChat } from "@/components/tutor-chat";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const projectData = [
  {
    id: "c3356ab6-ecaf-4c14-b295-9140dd01bdc2",
    title: "Lập kế hoạch du lịch Việt Nam",
    description:
      "Tạo lịch trình chi tiết cho chuyến du lịch 3 ngày 2 đêm tại Đà Nẵng",
    category: "Đời sống",
    difficulty: "Cơ bản",
    duration: "45 phút",
    context: `Bạn là một sinh viên đại học tại Hà Nội và có kế hoạch đi du lịch Đà Nẵng cùng 3 người bạn trong dịp nghỉ lễ. 
    Nhóm bạn có ngân sách khoảng 8 triệu đồng cho cả chuyến đi và muốn trải nghiệm cả văn hóa, ẩm thực và thiên nhiên.`,
    objectives: [
      "Lập lịch trình chi tiết cho 3 ngày 2 đêm",
      "Tìm kiếm và đề xuất địa điểm tham quan phù hợp",
      "Lên kế hoạch ăn uống và lưu trú trong ngân sách",
      "Tính toán chi phí tổng thể và phân bổ hợp lý",
    ],
    deliverables: [
      "Lịch trình từng ngày với thời gian cụ thể",
      "Danh sách địa điểm tham quan và hoạt động",
      "Bảng tính chi phí chi tiết",
      "Gợi ý về phương tiện di chuyển",
    ],
    tips: [
      "Sử dụng kỹ thuật nhập vai: 'Hãy đóng vai một hướng dẫn viên du lịch chuyên nghiệp'",
      "Yêu cầu AI phân tích từng khía cạnh: thời tiết, giao thông, giá cả",
      "Đặt câu hỏi cụ thể về từng địa điểm để có thông tin chi tiết",
    ],
  },
  {
    id: "13ad043d-42fc-4b1e-91db-dd679e562a68",
    title: "Viết bài luận về AI trong giáo dục",
    description:
      "Nghiên cứu và viết bài luận 1000 từ về tác động của AI trong giáo dục Việt Nam",
    category: "Học thuật",
    difficulty: "Trung bình",
    duration: "90 phút",
    context: `Bạn là sinh viên ngành Sư phạm và được giao nhiệm vụ viết bài luận về tác động của trí tuệ nhân tạo 
    trong hệ thống giáo dục Việt Nam. Bài luận cần có tính học thuật và dựa trên các nguồn tài liệu đáng tin cậy.`,
    objectives: [
      "Nghiên cứu tình hình ứng dụng AI trong giáo dục Việt Nam",
      "Phân tích ưu điểm và thách thức của AI trong giáo dục",
      "Đưa ra quan điểm cá nhân có căn cứ",
      "Viết bài luận 1000 từ với cấu trúc rõ ràng",
    ],
    deliverables: [
      "Bài luận hoàn chỉnh 1000 từ",
      "Danh sách tài liệu tham khảo",
      "Outline chi tiết của bài luận",
      "Tóm tắt các điểm chính",
    ],
    tips: [
      "Yêu cầu AI đóng vai nhà nghiên cứu giáo dục để có góc nhìn chuyên sâu",
      "Kiểm chứng thông tin bằng cách hỏi về nguồn gốc và độ tin cậy",
      "Sử dụng chuỗi suy nghĩ để phân tích từng khía cạnh một cách logic",
    ],
  },
];

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!project) {
    notFound();
  }

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress =
    (completedObjectives.length / project.objectives.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/project-hub/${params.projectId}`}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Trở về
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/ai-lab-viet-logo.png"
                  alt="AI Lab Việt"
                  width={70}
                  height={70}
                />
              </Link>
              <div>
                <h1 className="font-semibold text-lg bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
                  {project.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <Badge className="bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700 border-slate-200">
                    {project.category}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(elapsedTime)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">
                  {Math.round(progress)}% hoàn thành
                </div>
                <Progress value={progress} className="w-32 h-2" />
              </div>
              <Button
                onClick={() => setShowSubmissionForm(true)}
                disabled={progress < 100}
                className="gap-2 bg-gradient-to-r from-sky-300 to-blue-500 hover:from-slate-700 hover:to-blue-700 transition-all duration-200"
              >
                <Upload className="w-4 h-4" />
                Nộp bài
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar - Project Info */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto">
            {/* Context */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent font-semibold">
                    Bối cảnh
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {project.context}
                </p>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent font-semibold">
                    Mục tiêu ({completedObjectives.length}/
                    {project.objectives.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <button
                        onClick={() => handleCompleteObjective(index)}
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors ${
                          completedObjectives.includes(index)
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {completedObjectives.includes(index) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <span
                        className={`text-sm ${
                          completedObjectives.includes(index)
                            ? "text-blue-700 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        {objective}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-blue-500 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent font-semibold">
                    Gợi ý
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {project.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-xs text-gray-600 leading-relaxed"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-gradient-to-r from-slate-500 to-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{tip}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 pb-0 flex flex-col bg-white/80 backdrop-blur-sm border-white/20 shadow-lg max-h-[85vh]">
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
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
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
                            {message.content}
                          </ReactMarkdown>
                          <div
                            className={`text-xs mt-2 ${
                              message.sender === "user"
                                ? "text-slate-200"
                                : "text-gray-500"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
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

                {/* Input */}
                <div className="p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
                  <div className="flex gap-3">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Nhập câu hỏi hoặc yêu cầu cho AI..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && !e.shiftKey && handleSendMessage()
                      }
                      disabled={isLoading}
                      className="flex-1 bg-white/80 backdrop-blur-sm border-white/20"
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
                Nộp sản phẩm cuối cùng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sản phẩm hoàn thành
                </label>
                <Textarea
                  value={finalSubmission}
                  onChange={(e) => setFinalSubmission(e.target.value)}
                  placeholder="Dán nội dung sản phẩm cuối cùng của bạn tại đây..."
                  rows={10}
                  className="bg-white/80 backdrop-blur-sm border-white/20"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmissionForm(false)}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSubmitProject}
                  disabled={!finalSubmission.trim()}
                  className="bg-gradient-to-r from-sky-300 to-blue-500 hover:from-slate-700 hover:to-blue-700 transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Nộp dự án
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
