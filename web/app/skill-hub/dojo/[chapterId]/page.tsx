"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Send,
  ArrowLeft,
  CheckCircle,
  Target,
  Shield,
  Brain,
  AlertTriangle,
} from "lucide-react";
import { mockAgentResponses } from "@/mock/agent_responses";
import {
  getLessonsByChapter,
  poolingExerciseDate,
  postLearningRequest,
} from "@/lib/api";
import ContentPanel from "@/components/ContentPanel";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

// Agent states enum for Chapter 4 specifically
enum Chapter4States {
  GREETING = 0,
  TEACHING_GOLDEN_QUESTIONS = 1,
  PRACTICE_FIND_ERROR = 2,
  FEEDBACK_TRANSITION = 3,
  TEACHING_RED_FLAGS = 4,
  PRACTICE_RED_FLAGS = 5,
  TEACHING_FEEDBACK_FORMULA = 6,
  PRACTICE_FEEDBACK_FORMULA = 7,
  FINAL_TEST = 8,
  COMPLETION = 9,
}

// Types
interface Message {
  id: string;
  sender: "alva" | "user";
  content: string;
  timestamp: string;
}

interface AgentResponse {
  state: number;
  response_text: string;
  progress?: number;
  chapter_data?: any;
  interactive_content?: any;
}

interface LessonBlock {
  id: string;
  chapter: number;
  block_type: string;
  content: string;
  display_order: number;
  section: string;
}

const chapterMetadata = {
  4: {
    title: "Nghệ thuật Nhận định",
    description: "Rèn luyện tư duy phản biện và đánh giá chất lượng",
    totalSteps: 11,
    concepts: [
      {
        id: "critical-thinking",
        title: "Tư duy Phản biện",
        definition: "Phát triển khả năng đánh giá và phản biện kết quả từ AI.",
        icon: Brain,
      },
      {
        id: "golden-questions",
        title: "Bộ câu hỏi Vàng",
        definition: "Năm câu hỏi cốt lõi để đánh giá chất lượng sản phẩm AI.",
        icon: CheckCircle,
      },
      {
        id: "red-flags",
        title: "Cờ đỏ trong tư duy AI",
        definition: "Nhận diện các lỗi logic và tư duy của AI.",
        icon: AlertTriangle,
      },
      {
        id: "feedback-formula",
        title: "Công thức Phản hồi",
        definition: "Bốn bước để đưa ra phản hồi hiệu quả cho AI.",
        icon: Target,
      },
    ],
  },
};

export default function JourneyPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = parseInt(params.chapterId as string);
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [taskId, setTaskId] = useState<string | null>(null);
  const [exerciseData, setExerciseData] = useState<any>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentState, setCurrentState] = useState<number>(
    Chapter4States.GREETING
  );
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(
    null
  );
  const [contentDisplay, setContentDisplay] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: any }>({});
  const [clickedError, setClickedError] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<string>("");

  const [lessonBlocks, setLessonBlocks] = useState<LessonBlock[]>([]);
  const [whySectionBlocks, setWhySectionBlocks] = useState<LessonBlock[]>([]);
  const [howSectionBlocks, setHowSectionBlocks] = useState<LessonBlock[]>([]);

  const [wrongCriteria, setWrongCriteria] = useState<string>("");
  const [wrongClickedWord, setWrongClickedWord] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chapter = chapterMetadata[chapterId as keyof typeof chapterMetadata];

  useEffect(() => {
    if (chapterId === 4) {
      loadLessonBlocks();
      initializeSession();
    }
  }, [chapterId]);

  useEffect(() => {
    const fetchExerciseData = async () => {
      if (taskId) {
        const data = await poolingExerciseDate(taskId);
        setContentDisplay(data.result);
        setExerciseData(data.result);
      }
    };
    fetchExerciseData();
  }, [taskId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    handleStateChange(currentState, agentResponse as AgentResponse);
  }, [currentState, agentResponse]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadLessonBlocks = async () => {
    try {
      const blocks = await getLessonsByChapter("4");
      const whatSectionBlocks = blocks.filter(
        (block) => block.section === "what"
      );
      const whySectionBlocks = blocks.filter(
        (block) => block.section === "why"
      );
      const howSectionBlocks = blocks.filter(
        (block) => block.section === "how"
      );
      setLessonBlocks(whatSectionBlocks);
      setWhySectionBlocks(whySectionBlocks);
      setHowSectionBlocks(howSectionBlocks);
    } catch (error) {
      console.error("Failed to load lesson blocks:", error);
    }
  };

  const initializeSession = async () => {
    setContentDisplay({
      type: "intro",
      title: "Nghệ thuật Nhận định",
      description: "Rèn luyện tư duy phản biện với AI",
    });
    const initialMessage: Message = {
      id: "init",
      sender: "user",
      content: "Xin chào ALVA!",
      timestamp: new Date().toISOString(),
    };
    setMessages([initialMessage]);

    setIsLoading(true);
    const agentResponse = await postLearningRequest({
      chapter_id: "622f8ec2-0c4c-4874-81e7-912e1e4f4522",
      current_state: Chapter4States.GREETING,
      query: "Xin chào ALVA!",
      session_id: sessionId,
      topic: "Nghệ thuật nhận định",
      user_id: "18645595-da81-43f7-b9ce-1834bec4d6d4",
      exercise_data: exerciseData,
    });

    let agentMessage: Message | null = null;
    if (agentResponse && agentResponse.status === "success") {
      agentMessage = {
        id: `alva-${Date.now()}`,
        sender: "alva",
        content: agentResponse.response_text,
        timestamp: new Date().toISOString(),
      };
    }

    setMessages((prev) => [...prev, ...(agentMessage ? [agentMessage] : [])]);
    setIsLoading(false);
    // setAgentResponse(initialResponse);
    // setCurrentState(Chapter4States.GREETING);
    setProgress((currentState / 10) * 100 || 0);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: currentInput,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    let agentMessage: Message | null = null;

    setIsLoading(true);
    const agentApiResponse = await postLearningRequest({
      chapter_id: "622f8ec2-0c4c-4874-81e7-912e1e4f4522",
      current_state: currentState,
      query: currentInput,
      session_id: sessionId,
      topic: "Nghệ thuật nhận định là gì?",
      user_id: "18645595-da81-43f7-b9ce-1834bec4d6d4",
    });

    if (agentApiResponse && agentApiResponse.status === "success") {
      agentMessage = {
        id: `alva-${Date.now()}`,
        sender: "alva",
        content: agentApiResponse.response_text,
        timestamp: new Date().toISOString(),
      };
      setCurrentState(agentApiResponse.state);
      setTaskId(agentApiResponse.task_id);
    }
    setProgress((currentState / 10) * 100 || 0);
    setMessages((prev) => (agentMessage ? [...prev, agentMessage] : [...prev]));
    setIsLoading(false);
    setCurrentInput("");
  };

  const handleStateTransition = () => {
    // const nextState = currentState + 1;
    // const nextResponse = mockAgentResponses[nextState];
    // if (nextResponse) {
    //   const alvaResponse: Message = {
    //     id: `alva-${Date.now()}`,
    //     sender: "alva",
    //     content: nextResponse.response_text,
    //     timestamp: new Date().toISOString(),
    //   };
    //   setMessages((prev) => [...prev, alvaResponse]);
    //   setAgentResponse(nextResponse);
    //   setCurrentState(nextState);
    //   setProgress(nextResponse.progress || 0);
    //   // Handle state-specific content
    //   handleStateChange(nextState, nextResponse);
    // }
  };

  const handleStateChange = (state: number, response: AgentResponse) => {
    switch (state) {
      case Chapter4States.TEACHING_GOLDEN_QUESTIONS:
        setContentDisplay({
          type: "lesson",
          // title: "Bộ câu hỏi Vàng",
          // questions: response.chapter_data?.questions || [],
          lessonBlocks: lessonBlocks,
        });
        break;

      case Chapter4States.PRACTICE_FIND_ERROR:
        setContentDisplay({
          type: "loading",
          title: "Đang tạo bài tập...",
        });
        break;

      // case Chapter4States.PRACTICE_IDENTIFY_CRITERIA:
      //   setContentDisplay({
      //     type: "multiple_choice",
      //     title: "Xác định tiêu chí vi phạm",
      //     question: "Lỗi sai này vi phạm tiêu chí nào trong Bộ câu hỏi Vàng?",
      //     options: response.interactive_content?.options || [],
      //     correct_answer: response.interactive_content?.correct_answer,
      //   });
      //   break;

      // case Chapter4States.FEEDBACK_TRANSITION:
      //   setContentDisplay({
      //     type: "transition",
      //     title: "Tuyệt vời!",
      //     message: response.response_text,
      //   });
      //   setTimeout(() => {
      //     setCurrentState(Chapter4States.TEACHING_RED_FLAGS);
      //     const nextResponse =
      //       mockAgentResponses[Chapter4States.TEACHING_RED_FLAGS];
      //     if (nextResponse) {
      //       handleStateChange(Chapter4States.TEACHING_RED_FLAGS, nextResponse);
      //       setProgress(nextResponse.progress || 0);
      //     }
      //   }, 2000);
      //   break;

      case Chapter4States.TEACHING_RED_FLAGS:
        setContentDisplay({
          type: "red_flags",
          title: 'Các "Cờ đỏ" trong tư duy AI',
          // red_flags: response.chapter_data?.red_flags || [],
          lessonBlocks: whySectionBlocks,
        });
        break;

      case Chapter4States.PRACTICE_RED_FLAGS:
        // setContentDisplay({
        //   type: "text_analysis",
        //   title: "Nhận diện Cờ đỏ",
        //   instruction: 'Đoạn văn sau đang mắc phải "cờ đỏ" nào?',
        //   content: response.interactive_content?.content,
        //   expected_answer: response.interactive_content?.expected_answer,
        // });
        setContentDisplay({
          type: "loading",
          title: "Đang tạo bài tập...",
        });
        break;

      // case Chapter4States.TEACHING_FEEDBACK_FORMULA:
      //   setContentDisplay({
      //     type: "feedback_formula",
      //     title: "Công thức Phản hồi 4 bước",
      //     steps: response.chapter_data?.steps || [],
      //     lessonBlocks: howSectionBlocks,
      //   });
      //   break;

      case Chapter4States.PRACTICE_FEEDBACK_FORMULA:
        // setContentDisplay({
        //   type: "feedback_practice",
        //   title: "Thực hành Công thức Phản hồi",
        //   instruction:
        //     'Áp dụng Công thức Phản hồi 4 bước cho lỗi "mùa hè rực lửa năm 1789"',
        //   prompt: response.interactive_content?.prompt,
        // });
        break;

      case Chapter4States.FINAL_TEST:
        setContentDisplay({
          type: "loading",
          title: "Đang tạo bài kiểm tra...",
          // scenario: response.interactive_content?.scenario,
          // prompt: response.interactive_content?.prompt,
        });
        break;

      case Chapter4States.COMPLETION:
        setContentDisplay({
          type: "completion",
          badge: "Discernment Shield",
          achievement: "Nghệ thuật Nhận định - Hoàn thành",
          next_action: "Quay về Bản đồ Hành trình",
        });
        break;
    }
  };

  const handleClickableText = async (clickedText: string) => {
    if (contentDisplay?.correct_answer.includes(clickedText)) {
      setClickedError(true);
      setWrongClickedWord("");

      const userMessage: Message = {
        id: "submission-" + Date.now().toString(),
        sender: "user",
        content: `Tôi đã tìm thấy lỗi: "${clickedText}"`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsLoading(true);
      const agentResponse = await postLearningRequest({
        chapter_id: "622f8ec2-0c4c-4874-81e7-912e1e4f4522",
        current_state: currentState,
        query: `Tôi đã tìm thấy lỗi: "${clickedText}"`,
        session_id: sessionId,
        topic: "Nghệ thuật nhận định",
        user_id: "18645595-da81-43f7-b9ce-1834bec4d6d4",
        exercise_data: exerciseData,
      });

      if (agentResponse && agentResponse.status === "success") {
        const agentMessage: Message = {
          id: `alva-${Date.now()}`,
          sender: "alva",
          content: agentResponse.response_text,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, agentMessage]);
        setCurrentState(agentResponse.state);
      }
      setIsLoading(false);
      setProgress((currentState / 10) * 100 || 0);
    } else {
      setWrongClickedWord(clickedText);
    }
  };

  const handleMultipleChoice = async (selectedOption: string) => {
    setSelectedCriteria(selectedOption);
    setWrongCriteria("");

    if (selectedOption === contentDisplay?.correct_answer) {
      const userMessage: Message = {
        id: "submission-" + Date.now().toString(),
        sender: "user",
        content: `Tôi chọn đáp án: "${selectedOption}"`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsLoading(true);
      const agentResponse = await postLearningRequest({
        chapter_id: "622f8ec2-0c4c-4874-81e7-912e1e4f4522",
        current_state: currentState,
        query: `Tôi chọn đáp án: "${selectedOption}"`,
        session_id: sessionId,
        topic: "Nghệ thuật nhận định",
        user_id: "18645595-da81-43f7-b9ce-1834bec4d6d4",
        exercise_data: exerciseData,
      });

      if (agentResponse && agentResponse.status === "success") {
        const agentMessage: Message = {
          id: `alva-${Date.now()}`,
          sender: "alva",
          content: agentResponse.response_text,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, agentMessage]);
        setCurrentState(agentResponse.state);
      }
      setIsLoading(false);
      setProgress((currentState / 10) * 100 || 0);
    } else {
      setWrongCriteria(selectedOption);
    }
  };

  const handleTextAnalysis = async () => {
    if (
      exerciseData.validation_keywords.some((keyword: string) =>
        currentInput.toLowerCase().includes(keyword)
      )
    ) {
      const userMessage: Message = {
        id: "submission-" + Date.now().toString(),
        sender: "user",
        content: `Câu trả lời của tôi: "${currentInput}"`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      setIsLoading(true);
      const agentResponse = await postLearningRequest({
        chapter_id: "622f8ec2-0c4c-4874-81e7-912e1e4f4522",
        current_state: currentState,
        query: `Câu trả lời của tôi: "${currentInput}"`,
        session_id: sessionId,
        topic: "Nghệ thuật nhận định",
        user_id: "18645595-da81-43f7-b9ce-1834bec4d6d4",
        exercise_data: exerciseData,
      });

      if (agentResponse && agentResponse.status === "success") {
        const agentMessage: Message = {
          id: `alva-${Date.now()}`,
          sender: "alva",
          content: agentResponse.response_text,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, agentMessage]);
        setCurrentState(agentResponse.state);
      }
      setIsLoading(true);
      setProgress((currentState / 10) * 100 || 0);
      setCurrentInput("");
    }
  };

  // Expose click handler to global scope for HTML onclick
  useEffect(() => {
    (window as any).handleErrorClick = handleClickableText;
    return () => {
      delete (window as any).handleErrorClick;
    };
  }, [contentDisplay]);

  if (!chapter || chapterId !== 4) {
    return (
      <div className="bg-background flex items-center justify-center h-full">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Chương này chưa được hỗ trợ.
            </p>
            <Button onClick={() => router.push("/skill-hub")} className="mt-4">
              Quay về Bản đồ Hành trình
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground transition-colors flex flex-col">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/skill-hub")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay về
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {chapter.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Chương {chapterId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tiến độ</p>
              <p className="text-sm font-medium">{Math.round(progress)}%</p>
            </div>
            <Progress value={progress} className="w-32" />
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto p-4 w-full">
        <div className="grid lg:grid-cols-2 gap-6 h-full">
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <Card className="flex flex-col h-full bg-card border-border">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  Dòng Đối thoại với ALVA
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <div className="text-sm break-words whitespace-pre-wrap">
                          {message.content}
                        </div>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-t border-border p-4 flex-shrink-0">
                <div className="flex gap-2">
                  <Textarea
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder={
                      currentState === Chapter4States.GREETING
                        ? 'Nhập "Bắt đầu" để tiếp tục...'
                        : "Nhập câu trả lời của bạn..."
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (contentDisplay?.type === "text_analysis") {
                          handleTextAnalysis();
                        }
                        handleSendMessage();
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1 resize-y min-h-[40px] max-h-40"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !currentInput.trim()}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel: Knowledge Frame */}
          <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
            <Card className="flex flex-col h-full bg-card border-border">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  Khung Tri thức
                </CardTitle>
              </CardHeader>

              {/* Content */}
              <CardContent className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <ContentPanel
                    contentDisplay={contentDisplay}
                    chapterId={chapterId}
                    currentState={currentState}
                    clickedError={clickedError}
                    selectedCriteria={selectedCriteria}
                    onSendMessage={handleSendMessage}
                    onClickableText={handleClickableText}
                    onMultipleChoice={handleMultipleChoice}
                    onRouterPush={router.push}
                    onStateTransition={handleStateTransition}
                    wrongCriteria={wrongCriteria}
                    wrongClickedWord={wrongClickedWord}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
