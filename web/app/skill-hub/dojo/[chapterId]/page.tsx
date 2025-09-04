'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Send,
  ArrowLeft,
  CheckCircle,
  Trophy,
  Target,
  Shield,
  Brain,
  Lightbulb,
  Award,
  MapPin,
  Search,
  AlertTriangle,
  BookOpen,
  Check
} from 'lucide-react';
import { mockAgentResponses } from '@/mock/agent_responses';
import { mockQuizResponse } from '@/mock/quiz_responses';
import { mockPracticeResponses } from '@/mock/practice_responses';

// Agent states enum
enum AgentState {
  GREETING = 0,
  EXPLAINING_WHAT = 1,
  PRACTICING_WHAT = 2,
  FEEDBACK_WHAT = 3,
  EXPLAINING_WHY = 4,
  PRACTICING_WHY = 5,
  FEEDBACK_WHY = 6,
  EXPLAINING_HOW = 7,
  QUIZ = 8,
  COMPLETION = 9
}

// Types
interface Message {
  id: string;
  sender: 'alva' | 'user';
  content: string;
  timestamp: string;
}

interface AgentResponse {
  state: number;
  response_text: string;
  task_id?: string;
  progress?: number;
  chapter_data?: any;
}

interface TaskResponse {
  task_id: string;
  task_type: string;
  status: string;
  content: any;
  questions?: any[];
}

const chapterMetadata = {
  1: {
    title: 'Nền tảng Tư duy',
    description: 'Hiểu tại sao cần học và những gì đang chờ đợi bạn',
    totalSteps: 8,
    concepts: [
      {
        id: 'foundation-thinking',
        title: 'Tư duy Nền tảng',
        definition: 'Xây dựng nền tảng tư duy để làm việc hiệu quả với AI.',
        icon: Lightbulb
      }
    ]
  },
  2: {
    title: 'Nghệ thuật Phân công',
    description: 'Học cách phân công nhiệm vụ giữa bạn và AI một cách hiệu quả',
    totalSteps: 10,
    concepts: [
      {
        id: 'delegation-role',
        title: 'Vai trò Trưởng nhóm',
        definition: 'Khi làm việc với AI, bạn là người vạch ra chiến lược và phân công nhiệm vụ.',
        icon: Shield
      },
      {
        id: 'goal-setting',
        title: 'Biết rõ Đích đến',
        definition: 'Xác định mục tiêu rõ ràng trước khi bắt đầu làm việc với AI.',
        icon: Target
      },
      {
        id: 'task-decomposition',
        title: 'Kỹ năng Chẻ Củi',
        definition: 'Phân rã vấn đề lớn thành các nhiệm vụ nhỏ, cụ thể.',
        icon: Search
      }
    ]
  },
  3: {
    title: 'Nghệ thuật Mô tả',
    description: 'Rèn luyện kỹ năng giao tiếp chính xác với AI',
    totalSteps: 12,
    concepts: [
      {
        id: 'communication',
        title: 'Giao tiếp Hiệu quả',
        definition: 'Học cách diễn đạt ý tưởng một cách rõ ràng với AI.',
        icon: Target
      }
    ]
  },
  4: {
    title: 'Nghệ thuật Nhận định',
    description: 'Rèn luyện tư duy phản biện và đánh giá chất lượng',
    totalSteps: 15,
    concepts: [
      {
        id: 'critical-thinking',
        title: 'Tư duy Phản biện',
        definition: 'Phát triển khả năng đánh giá và phản biện kết quả từ AI.',
        icon: Brain
      },
      {
        id: 'quality-assessment',
        title: 'Đánh giá Chất lượng',
        definition: 'Học cách đánh giá độ chính xác và chất lượng của thông tin.',
        icon: CheckCircle
      },
      {
        id: 'fact-checking',
        title: 'Kiểm tra Sự thật',
        definition: 'Rèn luyện kỹ năng kiểm tra và xác minh thông tin.',
        icon: AlertTriangle
      }
    ]
  },
  5: {
    title: 'Nghệ thuật Trách nhiệm',
    description: 'Rèn luyện ý thức đạo đức và trách nhiệm',
    totalSteps: 18,
    concepts: [
      {
        id: 'ethics',
        title: 'Đạo đức AI',
        definition: 'Hiểu và áp dụng các nguyên tắc đạo đức khi sử dụng AI.',
        icon: Shield
      }
    ]
  },
  6: {
    title: 'Nghệ thuật Tổng hợp',
    description: 'Biến kết quả AI thành sản phẩm giá trị của riêng bạn',
    totalSteps: 20,
    concepts: [
      {
        id: 'synthesis',
        title: 'Tổng hợp Sáng tạo',
        definition: 'Kết hợp và biến đổi kết quả AI thành sản phẩm độc đáo.',
        icon: Trophy
      }
    ]
  }
};

export default function JourneyPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = parseInt(params.chapterId as string);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentState, setCurrentState] = useState<number>(AgentState.GREETING);
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(null);
  const [contentDisplay, setContentDisplay] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState<TaskResponse | null>(null);
  const [taskPollingInterval, setTaskPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: any }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chapter = chapterMetadata[chapterId as keyof typeof chapterMetadata];

  useEffect(() => {
    if (chapterId && chapterMetadata[chapterId as keyof typeof chapterMetadata]) {
      initializeSession();
    }
  }, [chapterId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      // Clean up polling interval when component unmounts
      if (taskPollingInterval) {
        clearInterval(taskPollingInterval);
      }
    };
  }, [taskPollingInterval]);

  console.log('JourneyPage - chapterId:', chapterId);
  console.log('JourneyPage - mockAgentResponses:', mockAgentResponses);
  console.log('JourneyPage - contentDisplay:', contentDisplay);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = () => {
    // Get initial greeting from agent
    const initialResponse = mockAgentResponses[AgentState.GREETING];

    if (!initialResponse) {
      console.error('No initial response found');
      return;
    }

    const welcomeMessage: Message = {
      id: 'welcome',
      sender: 'alva',
      content: initialResponse.response_text,
      timestamp: new Date().toISOString()
    };

    setMessages([welcomeMessage]);
    setAgentResponse(initialResponse);
    setCurrentState(AgentState.GREETING);
    setProgress(initialResponse.progress || 0);

    // Set initial content display - use the chapter metadata
    const currentChapter = chapterMetadata[chapterId as keyof typeof chapterMetadata];
    if (currentChapter) {
      setContentDisplay({
        type: 'intro',
        title: currentChapter.title,
        description: currentChapter.description
      });
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: currentInput,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    // send to backend, mock here
    setTimeout(() => {
      const nextState = currentState + 1;
      const nextResponse = mockAgentResponses[nextState];

      if (nextResponse) {
        const alvaResponse: Message = {
          id: `alva-${Date.now()}`,
          sender: 'alva',
          content: nextResponse.response_text,
          timestamp: new Date().toISOString()
        };

        setMessages((prev) => [...prev, alvaResponse]);
        setAgentResponse(nextResponse);
        setCurrentState(nextState);
        setProgress(nextResponse.progress || 0);

        // Handle different states
        handleStateChange(nextState, nextResponse);
      }

      setIsLoading(false);
    }, 1500);
  };

  const handleStateChange = (state: number, response: AgentResponse) => {
    switch (state) {
      case AgentState.EXPLAINING_WHAT:
      case AgentState.EXPLAINING_WHY:
      case AgentState.EXPLAINING_HOW:
        // Display explanation content
        if (response.chapter_data) {
          setContentDisplay({
            type: 'definition',
            ...response.chapter_data
          });
        }
        break;

      case AgentState.PRACTICING_WHAT:
      case AgentState.PRACTICING_WHY:
        // Start polling for practice task
        if (response.task_id) {
          startTaskPolling(response.task_id);
        }
        break;

      case AgentState.QUIZ:
        // Start polling for quiz
        if (response.task_id) {
          startTaskPolling(response.task_id);
        }
        break;

      case AgentState.COMPLETION:
        // Display completion content
        if (response.chapter_data?.completion) {
          setContentDisplay({
            type: 'completion',
            ...response.chapter_data.completion
          });
        }
        break;
    }
  };

  const startTaskPolling = (taskId: string) => {
    // Clear any existing interval
    if (taskPollingInterval) {
      clearInterval(taskPollingInterval);
    }

    // Mock task polling - in a real implementation, this would call an API
    const interval = setInterval(() => {
      // Check if task is ready
      let taskData: TaskResponse | null = null;

      // For mock purposes, immediately return the data
      if (taskId.includes('quiz')) {
        taskData = mockQuizResponse as TaskResponse;
      } else if (taskId in mockPracticeResponses) {
        taskData = mockPracticeResponses[taskId as keyof typeof mockPracticeResponses];
      }

      if (taskData) {
        setCurrentTask(taskData);
        clearInterval(interval);
        setTaskPollingInterval(null);

        // Update content display
        if (taskData.task_type === 'quiz') {
          setContentDisplay({
            type: 'quiz',
            questions: taskData.questions
          });
        } else {
          setContentDisplay({
            type: 'practice',
            ...taskData.content
          });
        }
      }
    }, 1000);

    setTaskPollingInterval(interval);
  };

  const handleTaskSubmit = (answers: any) => {
    setUserAnswers(answers);

    // Simulate task completion and proceed to next state
    const nextState = currentState + 1;
    const nextResponse = mockAgentResponses[nextState];

    if (nextResponse) {
      const completionMessage: Message = {
        id: `completion-${Date.now()}`,
        sender: 'user',
        content: '[Đã hoàn thành thử thách]',
        timestamp: new Date().toISOString()
      };

      const alvaResponse: Message = {
        id: `alva-${Date.now()}`,
        sender: 'alva',
        content: nextResponse.response_text,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, completionMessage, alvaResponse]);
      setAgentResponse(nextResponse);
      setCurrentState(nextState);
      setProgress(nextResponse.progress || 0);
      setCurrentTask(null);

      // Handle next state
      handleStateChange(nextState, nextResponse);
    }
  };

  const renderContentPanel = () => {
    if (!contentDisplay) return null;

    switch (contentDisplay.type) {
      case 'intro':
        return (
          <div className='text-center space-y-6'>
            <Badge variant='secondary' className='text-sm'>
              Chương {chapterId}
            </Badge>
            <h2 className='text-2xl font-bold text-foreground'>{contentDisplay.title}</h2>
            <p className='text-muted-foreground text-lg'>{contentDisplay.description}</p>
            <div className='w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center'>
              <BookOpen className='w-10 h-10 text-white' />
            </div>
            <div className='pt-4'>
              <Button
                onClick={() => handleSendMessage()}
                className='w-full'
                disabled={currentState > AgentState.GREETING}>
                {currentState > AgentState.GREETING ? 'Đã bắt đầu' : 'Bắt đầu'}
              </Button>
            </div>
          </div>
        );

      case 'document':
        return renderDocumentContent();

      case 'practice':
        if (contentDisplay.task_type === 'evaluation') {
          return renderEvaluationTask();
        } else if (contentDisplay.task_type === 'analysis') {
          return renderAnalysisTask();
        }
        return null;

      case 'quiz':
        return renderQuiz();

      case 'completion':
        return (
          <div className='text-center space-y-6'>
            <div className='w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center'>
              <Trophy className='w-12 h-12 text-white' />
            </div>
            <div>
              <Badge variant='secondary' className='mb-2 text-sm'>
                <Award className='w-3 h-3 mr-1' />
                {contentDisplay.badge}
              </Badge>
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                Chúc mừng! Hoàn thành Chương {chapterId}
              </h3>
              <p className='text-muted-foreground mb-4'>Điểm số: {contentDisplay.score}/100</p>
              <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                <p className='text-sm text-green-700 mb-2'>🎉 Thành tựu đạt được:</p>
                <ul className='text-sm text-green-700'>
                  {contentDisplay.achievements?.map((achievement: string, i: number) => (
                    <li key={i} className='flex items-center gap-2 mb-1'>
                      <Check className='w-4 h-4 text-green-500' />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='space-y-3'>
              <Button onClick={() => router.push('/skill-hub')} className='w-full'>
                <MapPin className='w-4 h-4 mr-2' />
                Quay về Bản đồ Hành trình
              </Button>
              <Button
                variant='outline'
                onClick={() => router.push(`/skill-hub/journey/${contentDisplay.next_chapter}`)}
                className='w-full'>
                Tiếp tục đến {contentDisplay.next_chapter}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDocumentContent = () => {
    if (!contentDisplay?.content) return null;

    return (
      <div className='space-y-4 max-h-[600px]'>
        <div className='text-center mb-6'>
          <Badge variant='outline' className='mb-2'>
            Khung Tri thức
          </Badge>
          <h3 className='text-lg font-semibold'>
            {contentDisplay.section === 'what' && 'CÁI GÌ - Khái niệm cơ bản'}
            {contentDisplay.section === 'why' && 'TẠI SAO - Tầm quan trọng'}
            {contentDisplay.section === 'how' && 'NHƯ THẾ NÀO - Cách thực hiện'}
          </h3>
        </div>

        {contentDisplay.content.map((block: any, index: number) => (
          <div key={block.id} className='mb-4'>
            {block.block_type === 'title' && (
              <h4 className='text-lg font-semibold text-foreground mb-2'>{block.content}</h4>
            )}
            {block.block_type === 'text' && (
              <p className='text-sm text-muted-foreground leading-relaxed mb-3'>{block.content}</p>
            )}
            {block.block_type === 'image_body' && (
              <div className='my-4'>
                <img
                  src={block.content}
                  alt={`Hình minh họa ${index + 1}`}
                  className='w-full rounded-lg border'
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderEvaluationTask = () => {
    if (!contentDisplay) return null;

    return (
      <div className='space-y-4'>
        <div className='text-center'>
          <Badge variant='destructive' className='mb-2'>
            Thực hành Nhận định
          </Badge>
          <h3 className='text-xl font-semibold text-foreground'>{contentDisplay.title}</h3>
        </div>

        <Card className='bg-destructive/5 border-destructive/20'>
          <CardContent className='p-6'>
            <p className='text-sm text-muted-foreground mb-4'>{contentDisplay.instruction}</p>

            <div className='p-4 bg-muted rounded-lg mb-6'>
              <h4 className='text-sm font-medium mb-2'>Bài viết cần đánh giá:</h4>
              <div className='text-xs whitespace-pre-wrap'>{contentDisplay.ai_output}</div>
            </div>

            <div className='space-y-4'>
              <h4 className='text-sm font-medium'>Áp dụng Bộ câu hỏi Vàng:</h4>
              {contentDisplay.evaluation_criteria.map((criteria: any) => (
                <div key={criteria.id} className='border rounded-lg p-4'>
                  <h5 className='text-sm font-medium mb-2'>{criteria.title}</h5>
                  <p className='text-xs text-muted-foreground mb-3'>{criteria.description}</p>

                  <div className='space-y-2'>
                    {criteria.issues.length > 0 ? (
                      criteria.issues.map((issue: string, idx: number) => (
                        <label key={idx} className='flex items-start gap-2 text-xs cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={userAnswers[`${criteria.id}_${idx}`] || false}
                            onChange={(e) =>
                              setUserAnswers({
                                ...userAnswers,
                                [`${criteria.id}_${idx}`]: e.target.checked
                              })
                            }
                            className='mt-1'
                          />
                          <span className='text-red-600'>{issue}</span>
                        </label>
                      ))
                    ) : (
                      <p className='text-xs text-green-600'>✓ Không có vấn đề</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-6'>
              <Button onClick={() => handleTaskSubmit(userAnswers)} className='w-full'>
                Nộp bài đánh giá
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDragDropTask = () => {
    if (!contentDisplay) return null;

    return (
      <div className='space-y-4'>
        <div className='text-center'>
          <Badge variant='destructive' className='mb-2'>
            Thực hành
          </Badge>
          <h3 className='text-xl font-semibold text-foreground'>{contentDisplay.title}</h3>
        </div>
        <Card className='bg-destructive/5 border-destructive/20'>
          <CardContent className='p-6'>
            <p className='text-sm text-muted-foreground mb-4'>{contentDisplay.instruction}</p>

            {/* Simple drag-drop visualization (in a real implementation, use a proper drag-drop library) */}
            <div className='grid grid-cols-2 gap-4 mt-6'>
              {contentDisplay.categories.map((category: any) => (
                <div key={category.id} className='border rounded-lg p-4'>
                  <h4 className='text-sm font-medium mb-3'>{category.title}</h4>
                  <div className='min-h-[200px] bg-muted/50 rounded-lg p-2'>
                    {/* Items would be draggable in real implementation */}
                    {contentDisplay.items
                      .filter(
                        (item: any) =>
                          userAnswers[item.id] === category.id ||
                          (!userAnswers[item.id] && item.correct_category === category.id)
                      )
                      .map((item: any) => (
                        <div
                          key={item.id}
                          className='bg-background border rounded-md p-2 mb-2 text-sm cursor-move'
                          onClick={() => {
                            // Toggle between categories
                            const targetCategory =
                              category.id === contentDisplay.categories[0].id
                                ? contentDisplay.categories[1].id
                                : contentDisplay.categories[0].id;
                            setUserAnswers({ ...userAnswers, [item.id]: targetCategory });
                          }}>
                          {item.text}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-6'>
              <Button onClick={() => handleTaskSubmit(userAnswers)} className='w-full'>
                Nộp bài
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAnalysisTask = () => {
    if (!contentDisplay) return null;

    return (
      <div className='space-y-4'>
        <div className='text-center'>
          <Badge variant='destructive' className='mb-2'>
            Phân tích
          </Badge>
          <h3 className='text-xl font-semibold text-foreground'>{contentDisplay.title}</h3>
        </div>
        <Card className='bg-destructive/5 border-destructive/20'>
          <CardContent className='p-6'>
            <div className='p-4 bg-muted rounded-lg mb-4'>
              <p className='text-sm'>{contentDisplay.scenario}</p>
            </div>

            <div className='space-y-4'>
              {contentDisplay.questions.map((question: string, index: number) => (
                <div key={index}>
                  <p className='text-sm font-medium mb-2'>{question}</p>
                  <textarea
                    className='w-full p-3 border rounded-md h-24 text-sm'
                    placeholder='Nhập câu trả lời của bạn...'
                    value={userAnswers[`q${index}`] || ''}
                    onChange={(e) =>
                      setUserAnswers({ ...userAnswers, [`q${index}`]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <div className='mt-6'>
              <Button
                onClick={() => handleTaskSubmit(userAnswers)}
                className='w-full'
                disabled={!Object.keys(userAnswers).length}>
                Nộp bài
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderQuiz = () => {
    if (!contentDisplay?.questions) return null;

    return (
      <div className='space-y-4'>
        <div className='text-center'>
          <Badge variant='secondary' className='mb-2'>
            Kiểm tra
          </Badge>
          <h3 className='text-xl font-semibold text-foreground'>Bài kiểm tra Chương {chapterId}</h3>
        </div>

        <div className='space-y-6'>
          {contentDisplay.questions.slice(0, 5).map((q: any, index: number) => (
            <Card key={index} className='border-primary/20'>
              <CardContent className='p-4'>
                <p className='text-sm font-medium mb-3'>
                  Câu {index + 1}: {q.question}
                </p>
                <div className='space-y-2'>
                  {q.choices.map((choice: string, choiceIndex: number) => (
                    <div
                      key={choiceIndex}
                      className={`p-3 border rounded-md text-sm cursor-pointer hover:bg-muted/50 transition-colors ${
                        userAnswers[`q${index}`] === choiceIndex
                          ? 'bg-primary/10 border-primary'
                          : ''
                      }`}
                      onClick={() =>
                        setUserAnswers({ ...userAnswers, [`q${index}`]: choiceIndex })
                      }>
                      {String.fromCharCode(65 + choiceIndex)}. {choice}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='mt-6'>
          <Button
            onClick={() => handleTaskSubmit(userAnswers)}
            className='w-full'
            disabled={Object.keys(userAnswers).length < 5}>
            Nộp bài
          </Button>
        </div>
      </div>
    );
  };

  if (!chapter) {
    return (
      <div className='bg-background flex items-center justify-center h-full'>
        <Card>
          <CardContent className='p-6 text-center'>
            <p className='text-muted-foreground'>Không tìm thấy chương này.</p>
            <Button onClick={() => router.push('/skill-hub')} className='mt-4'>
              Quay về Bản đồ Hành trình
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='bg-background text-foreground transition-colors flex flex-col'>
      <div className='border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0'>
        <div className='max-w-7xl mx-auto px-4 py-2 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/skill-hub')}
              className='flex items-center gap-2'>
              <ArrowLeft className='w-4 h-4' />
              Quay về
            </Button>
            <div>
              <h1 className='text-lg font-semibold text-foreground'>{chapter.title}</h1>
              <p className='text-sm text-muted-foreground'>Chương {chapterId}</p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='text-right'>
              <p className='text-sm text-muted-foreground'>Tiến độ</p>
              <p className='text-sm font-medium'>{Math.round(progress)}%</p>
            </div>
            <Progress value={progress} className='w-32' />
          </div>
        </div>
      </div>

      <div className='flex-1 max-w-7xl mx-auto p-4 w-full'>
        <div className='grid lg:grid-cols-2 gap-6 h-full'>
          <div className='flex flex-col h-[calc(100vh-200px)]'>
            <Card className='flex flex-col h-full bg-card border-border'>
              <CardHeader className='flex-shrink-0'>
                <CardTitle className='flex items-center gap-2'>
                  <div className='w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center'>
                    <Brain className='w-4 h-4 text-white' />
                  </div>
                  Dòng Đối thoại với ALVA
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <div className='flex-1 overflow-y-auto px-4 pb-4'>
                <div className='space-y-4'>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}>
                        <div
                          className='text-sm'
                          dangerouslySetInnerHTML={{
                            __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }}
                        />
                        <p className='text-xs opacity-70 mt-1'>
                          {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className='flex justify-start'>
                      <div className='bg-muted text-muted-foreground rounded-lg p-3'>
                        <div className='flex items-center gap-2'>
                          <div className='w-2 h-2 bg-current rounded-full animate-bounce' />
                          <div className='w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]' />
                          <div className='w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]' />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className='border-t border-border p-4 flex-shrink-0'>
                <div className='flex gap-2'>
                  <Input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder={
                      currentState === AgentState.GREETING
                        ? 'Nhập "Bắt đầu" để tiếp tục...'
                        : 'Nhập câu trả lời của bạn...'
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                    className='flex-1'
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !currentInput.trim()}
                    size='sm'>
                    <Send className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel: Knowledge Frame */}
          <div className='flex flex-col h-full max-h-[calc(100vh-200px)]'>
            <Card className='flex flex-col h-full bg-card border-border'>
              <CardHeader className='flex-shrink-0'>
                <CardTitle className='flex items-center gap-2'>
                  <div className='w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center'>
                    <CheckCircle className='w-4 h-4 text-white' />
                  </div>
                  Khung Tri thức
                </CardTitle>
              </CardHeader>

              {/* Content */}
              <CardContent className='flex-1 overflow-y-auto'>
                <div className='space-y-4'>{renderContentPanel()}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
