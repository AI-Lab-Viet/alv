import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  BookOpen,
  MessageCircle,
  Play,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TutorChat } from "@/components/tutor-chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const lessonContent = {
  prompting: {
    "prompt-basics": {
      title: "Cơ bản về Prompt Engineering",
      description: "Hiểu về cấu trúc và nguyên tắc cơ bản của prompt",
      duration: "8 phút",
      type: "video",
      content: {
        introduction:
          "Prompt Engineering là nghệ thuật và khoa học của việc thiết kế các câu lệnh hiệu quả để giao tiếp với AI. Đây là kỹ năng cốt lõi đầu tiên mà bạn cần nắm vững.",
        sections: [
          {
            title: "Prompt là gì?",
            content:
              "Prompt là câu lệnh, câu hỏi hoặc chỉ dẫn mà bạn đưa ra cho AI để nhận được phản hồi mong muốn. Một prompt tốt sẽ giúp AI hiểu chính xác ý định của bạn và đưa ra kết quả chất lượng cao.",
            example:
              "Thay vì hỏi: 'Viết về marketing'\nHãy hỏi: 'Viết một bài blog 500 từ về chiến lược marketing số cho doanh nghiệp nhỏ, tập trung vào social media và SEO'",
          },
          {
            title: "Cấu trúc Prompt hiệu quả",
            content: "Một prompt hiệu quả thường bao gồm 4 thành phần chính:",
            list: [
              "**Vai trò (Role)**: Xác định vai trò cho AI (ví dụ: 'Bạn là một chuyên gia marketing')",
              "**Ngữ cảnh (Context)**: Cung cấp thông tin nền tảng cần thiết",
              "**Nhiệm vụ (Task)**: Mô tả rõ ràng việc cần làm",
              "**Định dạng (Format)**: Chỉ định cách trình bày kết quả",
            ],
          },
          {
            title: "Nguyên tắc vàng",
            content:
              "Để tạo ra những prompt hiệu quả, hãy nhớ các nguyên tắc sau:",
            list: [
              "**Rõ ràng và cụ thể**: Tránh những câu hỏi mơ hồ",
              "**Cung cấp ví dụ**: Đưa ra mẫu để AI hiểu rõ hơn",
              "**Chia nhỏ nhiệm vụ**: Phân tách công việc phức tạp thành các bước nhỏ",
              "**Kiểm tra và điều chỉnh**: Thử nghiệm và cải thiện prompt liên tục",
            ],
          },
        ],
        keyTakeaways: [
          "Prompt Engineering là kỹ năng cần thiết để giao tiếp hiệu quả với AI",
          "Cấu trúc prompt tốt bao gồm: Vai trò, Ngữ cảnh, Nhiệm vụ, Định dạng",
          "Tính rõ ràng và cụ thể là yếu tố quan trọng nhất",
        ],
      },
    },
    "role-playing": {
      title: "Kỹ thuật Nhập vai",
      description: "Sử dụng vai trò để cải thiện chất lượng phản hồi",
      duration: "10 phút",
      type: "interactive",
      content: {
        introduction:
          "Kỹ thuật nhập vai là một trong những phương pháp mạnh mẽ nhất trong Prompt Engineering. Bằng cách gán vai trò cụ thể cho AI, bạn có thể nhận được phản hồi chuyên sâu và phù hợp hơn.",
        sections: [
          {
            title: "Tại sao nhập vai hiệu quả?",
            content:
              "Khi AI được gán một vai trò cụ thể, nó sẽ điều chỉnh phong cách trả lời, từ vựng và cách tiếp cận vấn đề theo đặc điểm của vai trò đó.",
            example:
              "So sánh hai prompt:\n1. 'Giải thích blockchain'\n2. 'Bạn là giáo sư công nghệ với 20 năm kinh nghiệm. Hãy giải thích blockchain cho sinh viên năm nhất một cách dễ hiểu'",
          },
          {
            title: "Các loại vai trò phổ biến",
            content: "Dưới đây là một số vai trò hiệu quả bạn có thể sử dụng:",
            list: [
              "**Chuyên gia lĩnh vực**: 'Bạn là chuyên gia marketing số với 10 năm kinh nghiệm'",
              "**Giáo viên/Mentor**: 'Bạn là một giáo viên kiên nhẫn và am hiểu'",
              "**Nhà tư vấn**: 'Bạn là nhà tư vấn chiến lược cho doanh nghiệp'",
              "**Người bạn**: 'Bạn là một người bạn thân thiết và hỗ trợ'",
            ],
          },
        ],
        keyTakeaways: [
          "Nhập vai giúp AI đưa ra phản hồi phù hợp và chuyên sâu hơn",
          "Chọn vai trò phù hợp với mục đích và đối tượng của bạn",
          "Kết hợp vai trò với ngữ cảnh để tăng hiệu quả",
        ],
      },
    },
  },
  "critical-thinking": {
    "ai-hallucination": {
      title: "Nhận diện Ảo giác của AI",
      description: "Cách phát hiện thông tin sai lệch từ AI",
      duration: "12 phút",
      type: "video",
      content: {
        introduction:
          "AI Hallucination là hiện tượng AI tạo ra thông tin không chính xác nhưng trình bày một cách tự tin. Đây là một trong những thách thức lớn nhất khi làm việc với AI.",
        sections: [
          {
            title: "AI Hallucination là gì?",
            content:
              "AI Hallucination xảy ra khi mô hình AI tạo ra thông tin không có trong dữ liệu huấn luyện hoặc không chính xác, nhưng trình bày một cách tự tin như thể đó là sự thật.",
            example:
              "Ví dụ: AI có thể tạo ra các trích dẫn sách không tồn tại, thống kê giả mạo, hoặc sự kiện lịch sử không chính xác.",
          },
          {
            title: "Các dấu hiệu nhận biết",
            content: "Làm thế nào để phát hiện AI đang 'ảo giác'?",
            list: [
              "**Thông tin quá cụ thể**: Số liệu, ngày tháng, tên riêng chi tiết bất thường",
              "**Thiếu nguồn**: AI không thể cung cấp nguồn tham khảo rõ ràng",
              "**Mâu thuẫn nội bộ**: Thông tin trong cùng một phản hồi không nhất quán",
              "**Quá tự tin**: Trình bày thông tin không chắc chắn như sự thật tuyệt đối",
            ],
          },
          {
            title: "Cách phòng tránh và kiểm chứng",
            content: "Chiến lược để giảm thiểu rủi ro từ AI Hallucination:",
            list: [
              "**Yêu cầu nguồn**: Luôn hỏi AI về nguồn thông tin",
              "**Kiểm chứng chéo**: So sánh với nhiều nguồn khác nhau",
              "**Chia nhỏ câu hỏi**: Tránh hỏi quá nhiều thông tin cùng lúc",
              "**Sử dụng prompt cảnh báo**: Nhắc AI thừa nhận khi không chắc chắn",
            ],
          },
        ],
        keyTakeaways: [
          "AI có thể tạo ra thông tin sai lệch một cách tự tin",
          "Luôn kiểm chứng thông tin quan trọng từ nhiều nguồn",
          "Sử dụng kỹ thuật prompt để giảm thiểu hallucination",
        ],
      },
    },
  },
};

const categoryInfo = {
  prompting: { title: "Kỹ năng Đặt câu hỏi", color: "purple" },
  "critical-thinking": { title: "Tư duy Phản biện", color: "blue" },
};

interface PageProps {
  params: Promise<{
    category: string;
    lessonId: string;
  }>;
}

export default async function LessonPage(props: PageProps) {
  const params = await props.params;
  const categoryData =
    lessonContent[params.category as keyof typeof lessonContent];
  const lesson = categoryData[params.lessonId as keyof typeof categoryData];
  const category = categoryInfo[params.category as keyof typeof categoryInfo];

  if (!lesson || !category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/skill-hub/${params.category}`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                Trở về
              </Link>

              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    category.color === "purple"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">{lesson.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {lesson.duration}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {lesson.type === "video" ? "Video" : "Tương tác"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <MessageCircle className="w-4 h-4" />
                Hỏi Gia sư
              </Button>
              <Button size="sm" className="gap-2">
                <CheckCircle className="w-4 h-4" />
                Hoàn thành
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video/Interactive Section */}
            {lesson.type === "video" && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                      <p className="text-lg font-medium">Video bài học</p>
                      <p className="text-sm opacity-80">
                        Thời lượng: {lesson.duration}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-b-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button size="sm" className="gap-2">
                          <Play className="w-4 h-4" />
                          Phát
                        </Button>
                        <Button variant="outline" size="sm">
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600">
                        0:00 / {lesson.duration}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Lesson Content */}
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-gray max-w-none">
                  {/* Introduction */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {lesson.content.introduction}
                    </p>
                  </div>

                  {/* Sections */}
                  {lesson.content.sections.map((section, index) => (
                    <div key={index} className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">
                        {section.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {section.content}
                      </p>

                      {section.example && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                          <h4 className="font-medium text-blue-900 mb-2">
                            Ví dụ:
                          </h4>
                          <pre className="text-sm text-blue-800 whitespace-pre-wrap font-mono">
                            {section.example}
                          </pre>
                        </div>
                      )}

                      {section.list && (
                        <ul className="space-y-2">
                          {section.list.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-3"
                            >
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p: ({ node, ...props }) => (
                                    <p
                                      className="text-md break-words whitespace-pre-wrap"
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
                                      className="text-md break-words whitespace-pre-wrap list-disc ml-4"
                                      {...props}
                                    />
                                  ),
                                }}
                              >
                                {item}
                              </ReactMarkdown>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  {/* Key Takeaways */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-purple-900">
                      Điểm quan trọng
                    </h3>
                    <ul className="space-y-2">
                      {lesson.content.keyTakeaways.map((takeaway, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ChevronLeft className="w-4 h-4" />
                Bài trước
              </Button>
              <Button className="gap-2">
                Bài tiếp theo
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Tiến độ bài học</h3>
                <Progress value={0} className="mb-3" />
                <p className="text-sm text-gray-600">0% hoàn thành</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Hành động nhanh</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <BookOpen className="w-4 h-4" />
                    Ghi chú
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 bg-transparent"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Thảo luận
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <TutorChat lessonContext={lesson.title} />
    </div>
  );
}
