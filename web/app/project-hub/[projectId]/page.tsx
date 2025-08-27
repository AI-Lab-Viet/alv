import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Star,
  ChevronLeft,
  Play,
  CheckCircle,
  Target,
  FileText,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

const projectData = [
  {
    id: "c3356ab6-ecaf-4c14-b295-9140dd01bdc2",
    title: "Lập kế hoạch du lịch Việt Nam",
    description:
      "Tạo lịch trình chi tiết cho chuyến du lịch 3 ngày 2 đêm tại Đà Nẵng",
    category: "Đời sống",
    difficulty: "Cơ bản",
    duration: "45 phút",
    participants: 1247,
    rating: 4.8,
    skills: ["Đặt câu hỏi", "Lập kế hoạch", "Nghiên cứu"],
    thumbnail: "/project-travel-planning.png",
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
    participants: 892,
    rating: 4.7,
    skills: ["Tư duy phản biện", "Nghiên cứu", "Viết lách"],
    thumbnail: "/project-essay-writing.png",
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

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailPage(props: PageProps) {
  const params = await props.params;
  const project = projectData.find((p) => p.id === params.projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/project-hub"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Trở về Xưởng Dự án
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
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
        {/* Project Header */}
        <div className="mb-8 bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg rounded-2xl p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-gradient-to-r from-sky-300 to-blue-500 text-white border-0">
              {project.category}
            </Badge>
            <Badge className="bg-white/80 text-gray-700 border-white/40">
              {project.difficulty}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {project.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {project.participants.toLocaleString()} người tham gia
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {project.rating}
              </span>
            </div>
          </div>

          <h1 className=" font-bold text-3xl lg:text-4xl bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent mb-4">
            {project.title}
          </h1>
          <p className="text-xl text-gray-700 mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.skills.map((skill) => (
              <Badge
                key={skill}
                className="bg-white/80 text-gray-700 border-white/40"
              >
                {skill}
              </Badge>
            ))}
          </div>

          <Link href={`/ai-lab/${params.projectId}`}>
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-sky-300 to-blue-500 hover:from-sky-400 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Bắt đầu trong AI Lab
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Context */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-300 to-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Bối cảnh dự án
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {project.context}
                </p>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-300 to-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  Mục tiêu cần đạt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Deliverables */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Sản phẩm cần nộp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {project.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-white text-sm font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-gray-700">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200/50 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Lưu ý quan trọng
                    </h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Toàn bộ quá trình tương tác với AI sẽ được ghi lại để tạo
                      thành portfolio của bạn. Hãy thực hiện một cách chỉn chu
                      và sáng tạo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  Gợi ý thực hiện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {project.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 leading-relaxed"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{tip}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
