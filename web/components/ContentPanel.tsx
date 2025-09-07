"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Shield,
  AlertTriangle,
  Award,
  MapPin,
  BookOpen,
} from "lucide-react";

interface LessonBlock {
  id: string;
  chapter: number;
  block_type: string;
  content: string;
  display_order: number;
  section: string;
}

interface ContentPanelProps {
  contentDisplay: any;
  chapterId: number;
  currentState: number;
  clickedError: boolean;
  selectedCriteria: string;
  onSendMessage: () => void;
  onClickableText: (clickedText: string) => void;
  onMultipleChoice: (selectedOption: string) => void;
  onRouterPush: (path: string) => void;
  onStateTransition?: () => void;
  wrongCriteria?: string;
  wrongClickedWord?: string;
}

export default function ContentPanel({
  contentDisplay,
  chapterId,
  currentState,
  clickedError,
  selectedCriteria,
  onSendMessage,
  onClickableText,
  onMultipleChoice,
  onRouterPush,
  onStateTransition,
  wrongCriteria = "",
  wrongClickedWord = "",
}: ContentPanelProps) {
  console.log("Rendering ContentPanel with contentDisplay:", contentDisplay);
  if (!contentDisplay) return null;

  const renderLessonBlock = (block: LessonBlock) => {
    switch (block.block_type) {
      case "title":
        return (
          <h4 key={block.id} className="font-semibold text-foreground mb-2">
            {block.content}
          </h4>
        );
      case "text":
        return (
          <p key={block.id} className="text-sm text-muted-foreground mb-3">
            {block.content}
          </p>
        );
      case "image_body":
        return (
          <div key={block.id} className="mb-4">
            <img
              src={block.content}
              alt="Lesson illustration"
              className="w-full max-w-md mx-auto rounded-lg border border-gray-200"
            />
          </div>
        );
      default:
        return null;
    }
  };

  switch (contentDisplay.type) {
    case "intro":
      return (
        <div className="text-center space-y-6">
          <Badge variant="secondary" className="text-sm">
            Chương {chapterId}
          </Badge>
          <h2 className="text-2xl font-bold text-foreground">
            {contentDisplay.title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {contentDisplay.description}
          </p>
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          {/* <div className="pt-4">
            <Button
              onClick={onStateTransition}
              className="w-full"
              disabled={currentState > 0}
            >
              {currentState > 0 ? "Đã bắt đầu" : "Bắt đầu"}
            </Button>
          </div> */}
        </div>
      );

    case "lesson_with_golden_questions":
      return (
        <div className="space-y-6">
          {/* Lesson Documentation */}
          {contentDisplay.lessonBlocks &&
            contentDisplay.lessonBlocks.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      {contentDisplay.lessonBlocks
                        .sort(
                          (a: LessonBlock, b: LessonBlock) =>
                            a.display_order - b.display_order
                        )
                        .map((block: LessonBlock) => renderLessonBlock(block))}
                    </div>
                  </div>
                </CardContent>
                <Button onClick={onStateTransition} className="w-full mt-6">
                  Tôi đã hiểu
                </Button>
              </Card>
            )}

          {/* Golden Questions
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {contentDisplay.title}
            </h3>
          </div>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-4">
                    Bộ câu hỏi Vàng
                  </h4>
                  <div className="space-y-3">
                    {contentDisplay.questions.map(
                      (question: string, index: number) => (
                        <div
                          key={index}
                          className="p-3 bg-white rounded-lg border border-yellow-200"
                        >
                          <p className="text-sm font-medium text-yellow-800">
                            {question}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      );

    case "golden_questions":
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {contentDisplay.title}
            </h3>
          </div>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-4">
                    Bộ câu hỏi Vàng
                  </h4>
                  <div className="space-y-3">
                    {contentDisplay.questions.map(
                      (question: string, index: number) => (
                        <div
                          key={index}
                          className="p-3 bg-white rounded-lg border border-yellow-200"
                        >
                          <p className="text-sm font-medium text-yellow-800">
                            {question}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );

    case "identify_error":
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {contentDisplay.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {contentDisplay.instruction}
            </p>
          </div>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div
                className="text-lg leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    contentDisplay.clickable_words?.reduce(
                      (text: string, word: string) => {
                        return text.replace(
                          new RegExp(
                            word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                            "g"
                          ),
                          `<span class="bg-blue-200 px-2 py-1 rounded cursor-pointer hover:bg-blue-300 transition-colors border-2 border-transparent hover:border-blue-400" onclick="window.handleErrorClick('${word}')">${word}</span>`
                        );
                      },
                      contentDisplay.text || ""
                    ) || contentDisplay.text,
                }}
              />
              {clickedError && (
                <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Chính xác! Bạn đã tìm ra lỗi sai.
                  </p>
                </div>
              )}
              {wrongClickedWord && !clickedError && (
                <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                  <p className="text-sm text-destructive">
                    ✗ Chưa đúng. Hãy thử lại!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );

    case "categorize_error":
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {contentDisplay.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {contentDisplay.question}
            </p>
          </div>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="space-y-3">
                {contentDisplay.options.map((option: string, index: number) => (
                  <button
                    key={index}
                    className={`w-full p-3 text-left border rounded-lg transition-colors ${
                      selectedCriteria === option
                        ? option === contentDisplay.correct_answer
                          ? "bg-green-100 border-green-400"
                          : "bg-red-100 border-red-400"
                        : "bg-white border-purple-200 hover:bg-purple-100"
                    }`}
                    onClick={() => onMultipleChoice(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {selectedCriteria === contentDisplay.correct_answer && (
                <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Hoàn hảo! Đây chính là tư duy của một nhà phản biện.
                  </p>
                </div>
              )}
              {wrongCriteria &&
                selectedCriteria === wrongCriteria &&
                selectedCriteria !== contentDisplay.correct_answer && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                    <p className="text-sm text-destructive">
                      ✗ Chưa đúng. Hãy thử lại!
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      );

    case "red_flags":
      return (
        <div className="space-y-6">
          {console.log(
            "Rendering red_flags with wrongCriteria:",
            contentDisplay
          )}
          {contentDisplay.lessonBlocks &&
            contentDisplay.lessonBlocks.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      {contentDisplay.lessonBlocks
                        .sort(
                          (a: LessonBlock, b: LessonBlock) =>
                            a.display_order - b.display_order
                        )
                        .map((block: LessonBlock) => renderLessonBlock(block))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {contentDisplay.title}
            </h3>
          </div>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                {contentDisplay.red_flags.map((flag: string, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-white border border-red-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{flag}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={onStateTransition} className="w-full mt-6">
                Tôi đã hiểu
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    case "free_text_response":
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {contentDisplay.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {contentDisplay.instruction}
            </p>
          </div>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="p-4 bg-white border border-orange-200 rounded-lg mb-4">
                <p className="text-sm italic">"{contentDisplay.question}"</p>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Nhập câu trả lời vào ô chat và nhấn Enter
              </p>
            </CardContent>
          </Card>
        </div>
      );

    case "feedback_formula":
      return (
        <div className="space-y-6">
          {console.log(
            "Rendering feedback_formula with contentDisplay:",
            contentDisplay
          )}
          {contentDisplay.lessonBlocks &&
            contentDisplay.lessonBlocks.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      {contentDisplay.lessonBlocks
                        .sort(
                          (a: LessonBlock, b: LessonBlock) =>
                            a.display_order - b.display_order
                        )
                        .map((block: LessonBlock) => renderLessonBlock(block))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {contentDisplay.title}
            </h3>
          </div>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                {contentDisplay.steps.map((step: string, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-white border border-green-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={onStateTransition} className="w-full mt-6">
                Tôi đã hiểu
              </Button>
            </CardContent>
          </Card>
        </div>
      );

    case "feedback_practice":
    case "final_test":
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {contentDisplay.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {contentDisplay.instruction}
            </p>
          </div>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              {contentDisplay.scenario && (
                <div className="p-4 bg-white border border-blue-200 rounded-lg mb-4">
                  <p className="text-sm">{contentDisplay.scenario}</p>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {contentDisplay.prompt}
              </p>
            </CardContent>
          </Card>
        </div>
      );

    case "loading":
      return (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {contentDisplay.title}
          </h3>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      );

    case "completion":
      return (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <div>
            <Badge variant="secondary" className="mb-2 text-sm">
              <Award className="w-3 h-3 mr-1" />
              {contentDisplay.badge}
            </Badge>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {contentDisplay.achievement}
            </h3>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => onRouterPush("/skill-hub")}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {contentDisplay.next_action}
            </Button>
          </div>
        </div>
      );

    case "transition":
      return (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {contentDisplay.title}
          </h3>
          <p className="text-muted-foreground">{contentDisplay.message}</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      );

    default:
      return null;
  }
}
