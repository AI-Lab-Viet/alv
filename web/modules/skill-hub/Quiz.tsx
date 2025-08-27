"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuizList } from "@/types/skill-hub-type";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useState } from "react";
import { TutorChat } from "@/components/tutor-chat";

interface QuizProps {
  quiz: QuizList;
  category: string;
}

export default function QuizPage({ quiz, category }: QuizProps) {
  if (!quiz) {
    notFound();
  }

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8">
            <div className="flex items-center gap-4">
              <Link
                href={`/skill-hub/${category}`}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
              >
                <ChevronLeft className="w-5 h-5" />
                Trở về danh sách
              </Link>
              <h1 className=" font-bold text-xl bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                {quiz.title}
              </h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <div
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  score >= 80
                    ? "bg-green-100"
                    : score >= 60
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                {score >= 80 ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              <CardTitle className="text-2xl text-slate-800">
                {score >= 80
                  ? "Xuất sắc!"
                  : score >= 60
                  ? "Tốt!"
                  : "Cần cải thiện"}
              </CardTitle>
              <div className="text-4xl font-bold bg-slate-600 bg-clip-text text-transparent">
                {score}/100
              </div>
              <p className="text-slate-600">
                Bạn đã trả lời đúng{" "}
                {
                  selectedAnswers.filter(
                    (answer, index) =>
                      answer === quiz.questions[index].correctAnswer
                  ).length
                }
                /{quiz.questions.length} câu hỏi
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {quiz.questions.map((question, index) => {
                const isCorrect =
                  selectedAnswers[index] === question.correctAnswer;
                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-slate-800 mb-2">
                          Câu {index + 1}: {question.question}
                        </h4>
                        <p className="text-sm text-slate-600 mb-2">
                          <strong>Đáp án đúng:</strong>{" "}
                          {question.choices[question.correctAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-slate-600 mb-2">
                            <strong>Bạn đã chọn:</strong>{" "}
                            {question.choices[selectedAnswers[index]]}
                          </p>
                        )}
                        {/* <p className="text-sm text-slate-600">
                          <strong>Giải thích:</strong> {question.explanation}
                        </p> */}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="flex-1 hover:bg-slate-50 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Làm lại
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
                >
                  <Link href={`/skill-hub/${category}`}>
                    Tiếp tục học
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/skill-hub/${category}`}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
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
              <h1 className=" font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {quiz.title}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <Clock className="w-4 h-4" />
              {quiz.duration}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
        {/* Progress */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">
                Câu hỏi {currentQuestion + 1} / {quiz.questions.length}
              </span>
              <span className="text-sm font-medium text-slate-800">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.choices.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-slate-300"
                    }`}
                  >
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-slate-700">{option}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="hover:bg-slate-50 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Câu trước
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
          >
            {currentQuestion === quiz.questions.length - 1
              ? "Hoàn thành"
              : "Câu tiếp"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
      <TutorChat lessonContext={quiz.description} />
    </div>
  );
}
