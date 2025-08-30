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
  Users,
  Brain,
  Lightbulb,
  Award,
  MapPin
} from 'lucide-react';

// Types
interface Message {
  id: string;
  sender: 'alva' | 'user';
  content: string;
  timestamp: Date;
  contentUpdate?: ContentUpdate;
}

interface ContentUpdate {
  type: 'definition' | 'image' | 'interactive' | 'scenario' | 'completion' | 'intro';
  data: any;
}

interface InteractiveWidget {
  type: 'drag-drop' | 'multiple-choice' | 'text-input';
  data: any;
}

const stationContent = {
  2: {
    title: 'Nghệ thuật Phân công',
    chapter: 'Chương 2',
    description: 'Rèn luyện kỹ năng đầu tiên của một trưởng nhóm',
    totalSteps: 8,
    concepts: [
      {
        id: 'goal-thinking',
        title: 'Tư duy Mục tiêu',
        definition: 'Khả năng xác định rõ ràng điểm đến trước khi bắt đầu hành trình với AI.',
        explanation:
          'Một mục tiêu rõ ràng chính là kim chỉ nam cho mọi hành động. Việc xác định mục tiêu cụ thể giúp bạn định hướng rõ ràng cho quá trình làm việc với AI.',
        image: '/images/goal-map.jpg',
        icon: Target
      },
      {
        id: 'know-yourself',
        title: 'Biết mình, biết ta',
        definition: 'Hiểu rõ điểm mạnh của con người và AI để phân công hiệu quả.',
        explanation:
          'Người: Sáng tạo, ra quyết định, cảm xúc, tầm nhìn chiến lược. AI: Xử lý dữ liệu, tạo nội dung, phân tích, nghiên cứu thông tin.',
        icon: Users
      },
      {
        id: 'wood-chopping',
        title: 'Kỹ năng "Chẻ củi"',
        definition: 'Chia nhỏ một vấn đề lớn, phức tạp thành các nhiệm vụ nhỏ, cụ thể.',
        explanation:
          'Thay vì giao cho AI một nhiệm vụ khổng lồ, hãy chia nhỏ thành các bước có thể quản lý được.',
        example: 'Khúc củi lớn → Nhiều thanh củi nhỏ',
        icon: Lightbulb
      }
    ]
  }
};

export default function DojoPage() {
  const params = useParams();
  const router = useRouter();
  const stationId = parseInt(params.stationId as string);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [contentDisplay, setContentDisplay] = useState<any>(null);
  const [interactiveWidget, setInteractiveWidget] = useState<InteractiveWidget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragDropResults, setDragDropResults] = useState<{ [key: number]: string }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const station = stationContent[stationId as keyof typeof stationContent];

  useEffect(() => {
    if (station) {
      initializeSession();
    }
  }, [stationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      sender: 'alva',
      content: `Chào mừng ${station ? 'Phong' : 'bạn'} đến với võ đường "${
        station.title
      }"! Ở đây, chúng ta sẽ rèn luyện kỹ năng đầu tiên của một trưởng nhóm. Sẵn sàng chưa?`,
      timestamp: new Date(),
      contentUpdate: {
        type: 'intro',
        data: {
          title: station.title,
          chapter: station.chapter,
          description: station.description
        }
      }
    };

    setMessages([welcomeMessage]);
    setContentDisplay({
      type: 'intro',
      title: station.title,
      chapter: station.chapter,
      description: station.description
    });
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    // Simulate ALVA's response based on the detailed flow
    setTimeout(() => {
      const alvaResponse = generateAlvaResponse(currentStep, currentInput);
      setMessages((prev) => [...prev, alvaResponse]);

      if (alvaResponse.contentUpdate) {
        updateContentDisplay(alvaResponse.contentUpdate);
      }

      setCurrentStep((prev) => prev + 1);
      setProgress(((currentStep + 1) / station.totalSteps) * 100);
      setIsLoading(false);
    }, 1500);
  };

  const generateAlvaResponse = (step: number, userInput: string): Message => {
    const responses: Record<number, { content: string; contentUpdate?: ContentUpdate }> = {
      // Step 1: After user clicks "Bắt đầu"
      0: {
        content:
          "Tuyệt vời! Kỹ năng đầu tiên của một trưởng nhóm là 'Biết rõ Đích đến'. Bạn có thể xem định nghĩa và hình ảnh minh họa ở bên phải nhé.",
        contentUpdate: {
          type: 'definition',
          data: station.concepts[0]
        }
      },
      // Step 3: After user explains importance of goal setting
      1: {
        content:
          "Chính xác! Bạn đã nắm được cốt lõi. Một mục tiêu rõ ràng chính là kim chỉ nam cho mọi hành động. Giờ hãy đến với 'thế võ' thứ hai: 'Biết mình, biết ta'.",
        contentUpdate: {
          type: 'definition',
          data: station.concepts[1]
        }
      },
      // Step 5: Interactive challenge
      2: {
        content:
          "Giờ là lúc cho một thử thách nhỏ để khởi động! Hãy phân loại các công việc sau đây vào đúng cột 'Người làm tốt' hoặc 'AI làm tốt'.",
        contentUpdate: {
          type: 'interactive',
          data: {
            type: 'drag-drop',
            title: 'Thử thách: Phân loại công việc',
            items: [
              { id: 1, text: 'Brainstorm ý tưởng sáng tạo', category: 'ai' },
              { id: 2, text: 'Ra quyết định cuối cùng', category: 'human' },
              { id: 3, text: 'Soạn thảo bản nháp', category: 'ai' },
              { id: 4, text: 'Đánh giá chất lượng', category: 'human' },
              { id: 5, text: 'Phân tích dữ liệu lớn', category: 'ai' },
              { id: 6, text: 'Đưa ra tầm nhìn chiến lược', category: 'human' }
            ]
          }
        }
      },
      // Step 6: After completing drag-drop
      3: {
        content:
          "Xuất sắc! Bạn đã phân loại đúng tất cả. 'Brainstorm ý tưởng' chính là thế mạnh của AI, trong khi 'Ra quyết định cuối cùng' luôn là vai trò của bạn. Giờ hãy đến với kỹ năng cuối cùng: 'Chẻ củi'.",
        contentUpdate: {
          type: 'definition',
          data: station.concepts[2]
        }
      },
      // Step 7: Final challenge setup
      4: {
        content:
          "Bạn đã làm rất tốt. Giờ là lúc cho 'trận đấu tính điểm' cuối cùng để xem bạn đã thực sự trở thành một trưởng nhóm tài ba chưa nhé!",
        contentUpdate: {
          type: 'scenario',
          data: {
            title: 'Thử thách cuối cùng',
            scenario:
              'Bạn được giao nhiệm vụ "Tổ chức một workshop online về Kỹ năng mềm cho sinh viên". Hãy áp dụng kỹ năng "Chẻ củi" để phân rã nhiệm vụ này thành 5 bước nhỏ và phân công cho "Người" hoặc "AI".',
            type: 'text-input'
          }
        }
      },
      // Step 8: Completion
      5: {
        content:
          "Hoàn hảo! Bạn đã phân rã vấn đề một cách rất logic và phân công cực kỳ hợp lý. Chúc mừng bạn đã hoàn thành xuất sắc trạm 'Nghệ thuật Phân công'!",
        contentUpdate: {
          type: 'completion',
          data: {
            badge: 'Delegation Master',
            achievement: 'Bậc thầy Phân công',
            message: 'Bạn đã thành thạo nghệ thuật phân công công việc giữa Người và AI!',
            concepts_unlocked: 3
          }
        }
      }
    };

    const response = responses[step as keyof typeof responses];
    return {
      id: `alva-${step}`,
      sender: 'alva',
      content: response?.content || 'Cảm ơn bạn đã chia sẻ!',
      timestamp: new Date(),
      contentUpdate: response?.contentUpdate
    };
  };

  const updateContentDisplay = (update: ContentUpdate) => {
    setContentDisplay(update.data);
    if (update.type === 'interactive' && update.data) {
      setInteractiveWidget({
        type: update.data.type,
        data: update.data
      });
    } else {
      setInteractiveWidget(null);
    }
  };

  const handleInteractionComplete = (result: any) => {
    const completionMessage: Message = {
      id: `interaction-${Date.now()}`,
      sender: 'user',
      content: `[Đã hoàn thành thử thách phân loại]`,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, completionMessage]);
    setInteractiveWidget(null);

    // Auto-advance to next step
    setTimeout(() => {
      const nextResponse = generateAlvaResponse(currentStep + 1, '');
      setMessages((prev) => [...prev, nextResponse]);
      if (nextResponse.contentUpdate) {
        updateContentDisplay(nextResponse.contentUpdate);
      }
      setCurrentStep((prev) => prev + 2);
      setProgress(((currentStep + 2) / station.totalSteps) * 100);
    }, 1000);
  };

  const handleDragDrop = (itemId: number, zone: string) => {
    setDragDropResults((prev) => ({
      ...prev,
      [itemId]: zone
    }));
  };

  const checkDragDropResults = () => {
    const correctAnswers = {
      1: 'ai', // Brainstorm ý tưởng sáng tạo
      2: 'human', // Ra quyết định cuối cùng
      3: 'ai', // Soạn thảo bản nháp
      4: 'human', // Đánh giá chất lượng
      5: 'ai', // Phân tích dữ liệu lớn
      6: 'human' // Đưa ra tầm nhìn chiến lược
    };

    const allCorrect = Object.keys(correctAnswers).every(
      (key) =>
        dragDropResults[parseInt(key)] ===
        correctAnswers[parseInt(key) as keyof typeof correctAnswers]
    );

    if (allCorrect || Object.keys(dragDropResults).length >= 4) {
      handleInteractionComplete('drag-drop-completed');
    }
  };

  const renderContentPanel = () => {
    if (!contentDisplay) return null;

    switch (contentDisplay.type || 'intro') {
      case 'intro':
        return (
          <div className='text-center space-y-6'>
            <Badge variant='secondary' className='text-sm'>
              {contentDisplay.chapter}
            </Badge>
            <h2 className='text-2xl font-bold text-foreground'>{contentDisplay.title}</h2>
            <p className='text-muted-foreground text-lg'>{contentDisplay.description}</p>
            <div className='w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center'>
              <Users className='w-10 h-10 text-white' />
            </div>
            <div className='pt-4'>
              <Button
                onClick={() => handleSendMessage()}
                className='w-full'
                disabled={currentStep > 0}>
                {currentStep > 0 ? 'Đã bắt đầu' : 'Bắt đầu'}
              </Button>
            </div>
          </div>
        );

      case 'definition':
        const IconComponent = contentDisplay.icon || Lightbulb;
        return (
          <div className='space-y-6'>
            <div className='text-center'>
              <h3 className='text-xl font-semibold text-foreground mb-2'>{contentDisplay.title}</h3>
            </div>
            <Card className='bg-primary/5 border-primary/20'>
              <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0'>
                    <IconComponent className='w-6 h-6 text-white' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-foreground mb-2'>Định nghĩa</h4>
                    <p className='text-sm text-muted-foreground mb-3'>
                      {contentDisplay.definition}
                    </p>
                    {contentDisplay.explanation && (
                      <div className='mt-4 p-4 bg-muted rounded-lg'>
                        <p className='text-sm'>{contentDisplay.explanation}</p>
                      </div>
                    )}
                    {contentDisplay.example && (
                      <div className='mt-4 p-4 bg-secondary/10 rounded-lg border border-secondary/20'>
                        <p className='text-sm font-medium text-secondary'>Ví dụ:</p>
                        <p className='text-sm mt-1'>{contentDisplay.example}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {currentStep === 1 && (
              <div className='space-y-3'>
                <p className='text-sm text-muted-foreground text-center'>
                  💡 <strong>Câu hỏi thực hành:</strong> Theo bạn, tại sao việc xác định rõ mục tiêu
                  trước khi dùng AI lại quan trọng đến vậy?
                </p>
              </div>
            )}
          </div>
        );

      case 'scenario':
        return (
          <div className='space-y-4'>
            <div className='text-center'>
              <Badge variant='destructive' className='mb-2'>
                Thử thách cuối cùng
              </Badge>
              <h3 className='text-xl font-semibold text-foreground'>{contentDisplay.title}</h3>
            </div>
            <Card className='bg-destructive/5 border-destructive/20'>
              <CardContent className='p-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-destructive rounded-lg flex items-center justify-center flex-shrink-0'>
                    <Target className='w-6 h-6 text-white' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-foreground mb-3'>Tình huống thực tế</h4>
                    <p className='text-sm text-muted-foreground mb-4'>{contentDisplay.scenario}</p>
                    <div className='p-3 bg-background rounded border border-border'>
                      <p className='text-xs text-muted-foreground mb-2'>Gợi ý format:</p>
                      <p className='text-xs text-muted-foreground'>
                        1. [Tên bước] - Phân công: [Người/AI]
                        <br />
                        2. [Tên bước] - Phân công: [Người/AI]
                        <br />
                        ...
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

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
                {contentDisplay.achievement}
              </h3>
              <p className='text-muted-foreground mb-4'>{contentDisplay.message}</p>
              <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                <p className='text-sm text-green-700'>
                  🎉 Bạn đã mở khóa <strong>{contentDisplay.concepts_unlocked} khái niệm</strong>{' '}
                  trong Kho Báu Tri thức!
                </p>
              </div>
            </div>
            <div className='space-y-3'>
              <Button onClick={() => router.push('/skill-hub')} className='w-full'>
                <MapPin className='w-4 h-4 mr-2' />
                Quay về Bản đồ Hành trình
              </Button>
              <Button
                variant='outline'
                onClick={() => router.push('/skill-hub/knowledge-vault')}
                className='w-full'>
                Xem Kho Báu Tri thức
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderInteractiveWidget = () => {
    if (!interactiveWidget || interactiveWidget.type !== 'drag-drop' || !interactiveWidget.data)
      return null;

    return (
      <Card className='mt-4'>
        <CardHeader>
          <CardTitle className='text-lg'>{interactiveWidget.data.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div
              className='border-2 border-dashed border-primary/30 rounded-lg p-4 min-h-[150px] bg-primary/5'
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const itemId = parseInt(e.dataTransfer.getData('text/plain'));
                handleDragDrop(itemId, 'human');
              }}>
              <h4 className='font-semibold text-center mb-3 text-primary'>👤 Người làm tốt</h4>
              <div className='space-y-2'>
                {Object.entries(dragDropResults)
                  .filter(([_, zone]) => zone === 'human')
                  .map(([itemId, _]) => {
                    const item = interactiveWidget.data?.items?.find(
                      (i: any) => i.id === parseInt(itemId)
                    );
                    return item ? (
                      <div key={itemId} className='p-2 bg-primary/10 rounded text-sm'>
                        {item.text}
                      </div>
                    ) : null;
                  })}
              </div>
            </div>

            <div
              className='border-2 border-dashed border-secondary/30 rounded-lg p-4 min-h-[150px] bg-secondary/5'
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const itemId = parseInt(e.dataTransfer.getData('text/plain'));
                handleDragDrop(itemId, 'ai');
              }}>
              <h4 className='font-semibold text-center mb-3 text-secondary'>🤖 AI làm tốt</h4>
              <div className='space-y-2'>
                {Object.entries(dragDropResults)
                  .filter(([_, zone]) => zone === 'ai')
                  .map(([itemId, _]) => {
                    const item = interactiveWidget.data?.items?.find(
                      (i: any) => i.id === parseInt(itemId)
                    );
                    return item ? (
                      <div key={itemId} className='p-2 bg-secondary/10 rounded text-sm'>
                        {item.text}
                      </div>
                    ) : null;
                  })}
              </div>
            </div>
          </div>

          <div className='space-y-2 mb-4'>
            <p className='text-sm text-muted-foreground mb-2'>
              Kéo thả các công việc vào cột phù hợp:
            </p>
            {interactiveWidget.data?.items?.map((item: any) => {
              if (dragDropResults[item.id]) return null;
              return (
                <div
                  key={item.id}
                  className='p-3 bg-muted rounded-lg cursor-move hover:bg-muted/80 transition-colors border border-border'
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', item.id.toString());
                  }}>
                  {item.text}
                </div>
              );
            })}
          </div>

          <Button
            onClick={checkDragDropResults}
            className='w-full'
            disabled={Object.keys(dragDropResults).length < 4}>
            Kiểm tra kết quả ({Object.keys(dragDropResults).length}/6)
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (!station) {
    return (
      <div className='bg-background flex items-center justify-center'>
        <Card>
          <CardContent className='p-6 text-center'>
            <p className='text-muted-foreground'>Không tìm thấy trạm học tập này.</p>
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
              <h1 className='text-lg font-semibold text-foreground'>{station.title}</h1>
              <p className='text-sm text-muted-foreground'>{station.chapter}</p>
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

              {/* Messages  */}
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
                        <p className='text-sm'>{message.content}</p>
                        <p className='text-xs opacity-70 mt-1'>
                          {message.timestamp.toLocaleTimeString()}
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
                      currentStep === 0
                        ? 'Nhập "Bắt đầu" để tiếp tục...'
                        : currentStep === 1
                        ? 'Chia sẻ suy nghĩ của bạn về tầm quan trọng của việc xác định mục tiêu...'
                        : currentStep === 4
                        ? 'Viết 5 bước phân rã nhiệm vụ và phân công...'
                        : 'Nhập câu trả lời của bạn...'
                    }
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading || (currentStep === 2 && interactiveWidget)}
                    className='flex-1'
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      isLoading || !currentInput.trim() || (currentStep === 2 && interactiveWidget)
                    }
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
                <div className='space-y-4'>
                  {renderContentPanel()}
                  {renderInteractiveWidget()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
