import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  Brain,
  Clock,
  Play,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Lock,
  MessageCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { TutorChat } from "@/components/tutor-chat";

const categoryData = [
  {
    id: "prompting",
    title: "Kỹ năng Đặt câu hỏi",
    description: "Kiểm tra kiến thức về tạo ra những câu lệnh hiệu quả cho AI",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-400",
    quizzes: [
      {
        id: "prompt-basics-quiz",
        title: "Chương 1: Nền tảng tư duy cho kỷ nguyên AI",
        description:
          "Kiểm tra hiểu biết về các khái niệm cơ bản trong AI và Prompt Engineering",
        duration: "10 phút",
        questions: 19,
        completed: false,
        locked: false,
        score: null,
      },
      {
        id: "role-playing-quiz",
        title: "Chương 2: Nghệ thuật phân công",
        description:
          "Đánh giá khả năng sử dụng vai trò để cải thiện chất lượng phản hồi",
        duration: "12 phút",
        questions: 17,
        completed: false,
        locked: false,
        score: null,
      },
      {
        id: "chain-of-thought-quiz",
        title: "Chương 3: Nghệ thuật mô tả",
        description: "Kiểm tra kỹ năng hướng dẫn AI suy nghĩ từng bước một",
        duration: "15 phút",
        questions: 20,
        completed: false,
        locked: true,
        score: null,
      },
    ],
  },
  {
    id: "critical-thinking",
    title: "Tư duy Phản biện",
    description: "Kiểm tra khả năng nhận diện và kiểm chứng thông tin từ AI",
    icon: Brain,
    color: "blue",
    quizzes: [
      {
        id: "ai-hallucination-quiz",
        title: "Trắc nghiệm: Nhận diện Ảo giác của AI",
        description: "Đánh giá khả năng phát hiện thông tin sai lệch từ AI",
        duration: "15 phút",
        questions: 20,
        completed: false,
        locked: false,
        score: null,
      },
      {
        id: "fact-checking-quiz",
        title: "Trắc nghiệm: Kiểm chứng Thông tin",
        description: "Kiểm tra phương pháp xác minh độ chính xác của nội dung",
        duration: "18 phút",
        questions: 25,
        completed: false,
        locked: false,
        score: null,
      },
    ],
  },
];

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params;
  const category = categoryData.find((cat) => cat.id === params.category);

  if (!category) {
    notFound();
  }

  const IconComponent = category.icon;
  const completedQuizzes = category.quizzes.filter(
    (quiz) => quiz.completed
  ).length;
  const progress = (completedQuizzes / category.quizzes.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/skill-hub"
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
              <h1 className=" font-bold text-xl text-slate-800">
                {category.title}
              </h1>
              <p className="text-slate-600 text-sm">{category.description}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
        {/* Progress Overview */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg mb-1 text-slate-800">
                  Tiến độ làm bài
                </h2>
                <p className="text-slate-600 text-sm">
                  {completedQuizzes} / {category.quizzes.length} bài trắc nghiệm
                  đã hoàn thành
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent mb-1">
                  {Math.round(progress)}%
                </div>
                <Badge
                  variant="secondary"
                  className="text-xs bg-slate-100 text-slate-700"
                >
                  {category.quizzes.length} bài trắc nghiệm
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Quizzes List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className=" font-bold text-2xl text-slate-800">
              Danh sách bài trắc nghiệm
            </h2>
          </div>

          {category.quizzes.map((quiz, index) => (
            <Card
              key={quiz.id}
              className={`transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/20 ${
                quiz.locked ? "opacity-60" : "hover:shadow-md hover:bg-white/90"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Quiz Status Icon */}
                  <div className="flex-shrink-0">
                    {quiz.completed ? (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    ) : quiz.locked ? (
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-slate-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Quiz Content */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1 text-slate-800">
                          {quiz.title}
                        </h3>
                        <p className="text-slate-600 text-sm mb-3">
                          {quiz.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {quiz.duration}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-200 text-slate-600"
                          >
                            {quiz.questions} câu hỏi
                          </Badge>
                          {quiz.score && (
                            <Badge
                              variant="outline"
                              className="text-xs border-green-200 text-green-600 bg-green-50"
                            >
                              Điểm: {quiz.score}/100
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-4">
                        {quiz.locked ? (
                          <Button
                            disabled
                            variant="outline"
                            size="sm"
                            className="bg-slate-50"
                          >
                            Đã khóa
                          </Button>
                        ) : quiz.completed ? (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-slate-50 bg-transparent"
                          >
                            <Link
                              href={`/skill-hub/${params.category}/quiz/${quiz.id}`}
                            >
                              Xem lại
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            asChild
                            className={`bg-gradient-to-r ${category.color}`}
                          >
                            <Link
                              href={`/skill-hub/${params.category}/quiz/${quiz.id}`}
                            >
                              Bắt đầu
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Learning */}
        <Card className="mt-8 bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-2 text-slate-800">
              Sẵn sàng thực hành?
            </h3>
            <p className="text-slate-600 mb-4">
              Áp dụng kiến thức đã học vào các dự án thực tế tại Xưởng Dự án
            </p>
            <Button
              asChild
              className={`bg-gradient-to-r ${category.color} hover:from-slate-700 hover:to-blue-700`}
            >
              <Link href="/project-hub">
                Khám phá Dự án
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <TutorChat lessonContext={category.title} />
      </div>
    </div>
  );
}
