'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'tutor';
  timestamp: string;
}

interface TutorChatProps {
  lessonContext?: string;
}

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://8000-01k2sjwsvx2j62nbvtc48xawyt.cloudspaces.litng.ai';

export function TutorChat({ lessonContext }: TutorChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Xin chào! Tôi là Gia sư AI của bạn. Tôi có thể giúp bạn hiểu rõ hơn về ${
        // lessonContext ||
        'các khái niệm AI'
      }. Bạn có câu hỏi gì không?`,
      sender: 'tutor',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // const handleSendMessage = async () => {
  //   if (!inputValue.trim()) return

  //   const userMessage: Message = {
  //     id: Date.now().toString(),
  //     content: inputValue,
  //     sender: "user",
  //     timestamp: new Date().toISOString(),
  //   }

  //   setMessages((prev) => [...prev, userMessage])
  //   setInputValue("")
  //   setIsLoading(true)

  //   // Simulate AI response
  //   setTimeout(() => {
  //     const tutorResponse: Message = {
  //       id: (Date.now() + 1).toString(),
  //       content: `Đây là một câu hỏi hay về ${lessonContext || "AI"}! Để trả lời câu hỏi "${inputValue}", tôi cần giải thích...`,
  //       sender: "tutor",
  //       timestamp: new Date().toISOString(),
  //     }
  //     setMessages((prev) => [...prev, tutorResponse])
  //     setIsLoading(false)
  //   }, 1000)
  // }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_API_URL}/api/v1/chat/learning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage.content
        })
      });

      const data = await res.json();

      const tutorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || JSON.stringify(data), // tuỳ theo API trả về
        sender: 'tutor',
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, tutorResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: '⚠️ Có lỗi khi gọi API. Vui lòng thử lại.',
        sender: 'tutor',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className='fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg'
        size='icon'>
        <MessageCircle className='w-6 h-6' />
      </Button>
    );
  }

  return (
    <Card className='fixed flex flex-col pb-0 gap-0 bottom-6 right-6 w-96 h-[550px] max-h-[80vh] shadow-xl z-50'>
      <CardHeader className='pb-0 shrink-0'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Bot className='w-5 h-5 text-purple-600' />
            Gia sư AI
          </CardTitle>
          <Button variant='ghost' size='icon' onClick={() => setIsOpen(false)} className='h-8 w-8'>
            <X className='w-4 h-4' />
          </Button>
        </div>
        {/* {lessonContext && (
          <p className="text-sm text-gray-600">Đang hỗ trợ: {lessonContext}</p>
        )} */}
      </CardHeader>

      <CardContent className='p-0 flex flex-col flex-1 overflow-hidden'>
        <ScrollArea className='flex-1 p-4'>
          <div className='space-y-4'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                {message.sender === 'tutor' && (
                  <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0'>
                    <Bot className='w-4 h-4 text-purple-600' />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-lg break-words whitespace-pre-wrap ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } prose prose-sm max-w-none`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => (
                        <p className='text-sm break-words whitespace-pre-wrap' {...props} />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1
                          className='text-lg break-words whitespace-pre-wrap font-bold'
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li
                          className='text-sm break-words whitespace-pre-wrap list-disc ml-4'
                          {...props}
                        />
                      )
                    }}>
                    {message.content}
                  </ReactMarkdown>
                </div>

                {message.sender === 'user' && (
                  <div className='w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0'>
                    <User className='w-4 h-4 text-gray-600' />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className='flex gap-3 justify-start'>
                <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
                  <Bot className='w-4 h-4 text-purple-600' />
                </div>
                <div className='bg-gray-100 p-3 rounded-lg'>
                  <div className='flex gap-1'>
                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                    <div
                      className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                      style={{ animationDelay: '0.1s' }}></div>
                    <div
                      className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                      style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className='px-4 py-2 shrink-0 border-t'>
          <div className='flex gap-2'>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='Đặt câu hỏi về bài học...'
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size='icon'>
              <Send className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
