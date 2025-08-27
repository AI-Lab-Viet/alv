import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MessageSquare,
  Target,
  FileText,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const projectDetails = {
  "travel-planner-001": {
    title: "Kế hoạch du lịch Đà Nẵng 3N2Đ",
    description:
      "Lập kế hoạch chi tiết cho chuyến du lịch nhóm với ngân sách 8 triệu đồng",
    category: "Đời sống",
    completedDate: "2024-03-15",
    duration: "42 phút",
    skills: ["Đặt câu hỏi", "Lập kế hoạch", "Nghiên cứu"],
    keyPrompts: [
      {
        prompt:
          "Hãy đóng vai một hướng dẫn viên du lịch chuyên nghiệp và đề xuất lịch trình 3 ngày tại Đà Nẵng cho nhóm 4 sinh viên với ngân sách 8 triệu đồng",
        reasoning:
          "Sử dụng kỹ thuật nhập vai để có được góc nhìn chuyên nghiệp và lời khuyên thực tế",
      },
      {
        prompt:
          "Phân tích chi phí chi tiết cho từng hoạt động và đưa ra gợi ý tối ưu ngân sách, bao gồm cả phương án dự phòng",
        reasoning:
          "Yêu cầu phân tích cụ thể để đảm bảo tính khả thi của kế hoạch",
      },
      {
        prompt:
          "Đánh giá thời tiết và điều kiện giao thông tại Đà Nẵng vào tháng 4, đưa ra lời khuyên về trang phục và lịch trình phù hợp",
        reasoning: "Tính đến các yếu tố thực tế có thể ảnh hưởng đến chuyến đi",
      },
    ],
    finalProduct: `**LỊCH TRÌNH DU LỊCH ĐÀ NẴNG 3N2Đ**
*Dành cho nhóm 4 sinh viên - Ngân sách: 8 triệu VNĐ*

## NGÀY 1: KHÁM PHÁ HỘI AN CỔ KÍNH
**Sáng:**
- 06:00: Khởi hành từ Hà Nội bằng máy bay (1.2 triệu/người)
- 08:30: Đến sân bay Đà Nẵng
- 09:00: Di chuyển về khách sạn bằng taxi (150k)
- 10:00: Check-in khách sạn Hoàng Anh Gia Lai (800k/đêm/2 phòng)

**Chiều:**
- 14:00: Khởi hành đến Hội An (Grab: 200k)
- 15:00-17:30: Tham quan phố cổ Hội An
  - Chùa Cầu Nhật Bản
  - Nhà cổ Tấn Ký
  - Hội quán Phúc Kiến
- 18:00: Thưởng thức đặc sản Hội An
  - Cao lầu: 50k/suất
  - White rose: 40k/suất
  - Bánh mì Phượng: 25k/suất

**Tối:**
- 19:30: Thả đèn hoa đăng trên sông Hoài (30k/đèn)
- 21:00: Về khách sạn nghỉ ngơi

*Chi phí ngày 1: 2.1 triệu VNĐ*

## NGÀY 2: BÀ NÀ HILLS VÀ BIỂN MỸ KHÊ
**Sáng:**
- 07:30: Ăn sáng tại khách sạn
- 08:30: Khởi hành đến Bà Nà Hills
- 09:00: Mua vé cáp treo Bà Nà (750k/người)

**Cả ngày tại Bà Nà:**
- 09:30-12:00: Khám phá Làng Pháp
- 12:00-13:00: Ăn trưa tại nhà hàng buffet (300k/người)
- 13:30-15:30: Tham quan Cầu Vàng và chụp ảnh
- 15:30-17:00: Trải nghiệm các trò chơi tại Fantasy Park

**Tối:**
- 17:30: Về khách sạn
- 19:00: Tắm biển Mỹ Khê và BBQ hải sản (400k/người)
- 21:30: Dạo bộ trên bãi biển

*Chi phí ngày 2: 1.8 triệu VNĐ*

## NGÀY 3: CHÙA LINH ỨNG VÀ MUA SẮM
**Sáng:**
- 08:00: Ăn sáng và check-out khách sạn
- 09:00: Tham quan chùa Linh Ứng Bãi Bụt
- 10:30: Ngắm toàn cảnh Đà Nẵng từ bán đảo Sơn Trà

**Chiều:**
- 12:00: Ăn trưa tại nhà hàng hải sản (300k/người)
- 14:00: Mua sắm đặc sản tại chợ Hàn
  - Mắm ruốc: 50k/hộp
  - Bánh tráng cuốn thịt heo: 100k/kg
  - Mứt dừa non: 80k/hộp
- 15:30: Ra sân bay
- 17:00: Bay về Hà Nội

*Chi phí ngày 3: 800k VNĐ*

## TỔNG KẾT CHI PHÍ
- **Vé máy bay:** 4.8 triệu (1.2tr x 4 người)
- **Khách sạn:** 1.6 triệu (800k x 2 đêm)
- **Ăn uống:** 1.2 triệu
- **Tham quan:** 600k
- **Di chuyển:** 400k
- **Mua sắm:** 400k

**TỔNG CỘNG: 7.8 TRIỆU VNĐ**
*(Dư 200k cho các chi phí phát sinh)*

## GỢI Ý QUAN TRỌNG
1. **Thời tiết:** Tháng 4 là mùa khô, nhiệt độ 25-30°C, thích hợp du lịch
2. **Trang phục:** Mang theo áo khoác nhẹ cho buổi tối và giày đi bộ thoải mái
3. **Lưu ý:** Đặt vé máy bay và khách sạn trước 2 tuần để có giá tốt
4. **Phương án dự phòng:** Nếu thời tiết xấu, có thể thay thế Bà Nà bằng Ngũ Hành Sơn

*Kế hoạch này đảm bảo trải nghiệm đầy đủ văn hóa, thiên nhiên và ẩm thực Đà Nẵng trong ngân sách cho phép.*`,
    processHighlights: [
      "Sử dụng kỹ thuật nhập vai để có góc nhìn chuyên nghiệp",
      "Phân tích chi tiết từng yếu tố: thời tiết, giao thông, chi phí",
      "Tạo ra nhiều phương án và so sánh để chọn tối ưu",
      "Kiểm chứng thông tin về giá cả và thời gian di chuyển",
    ],
  },
};

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectDetailPage(props: PageProps) {
  const params = await props.params;
  const project =
    projectDetails[params.projectId as keyof typeof projectDetails];

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/profile"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
              Trở về hồ sơ
            </Link>

            <Button variant="outline" className="gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Chia sẻ dự án
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8">
        {/* Project Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-purple-100 text-purple-700">
                    {project.category}
                  </Badge>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.completedDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {project.duration}
                  </span>
                </div>
                <h1 className="font-bold text-3xl text-gray-900 mb-3">
                  {project.title}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Final Product */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Sản phẩm cuối cùng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 font-sans">
                    {project.finalProduct}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Prompt nổi bật
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.keyPrompts.map((item, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-purple-200 pl-4"
                    >
                      <div className="bg-gray-50 rounded-lg p-3 mb-2">
                        <p className="text-sm text-gray-700 italic">
                          "{item.prompt}"
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">{item.reasoning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Process Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Điểm nổi bật trong quá trình
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {project.processHighlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Share */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Chia sẻ dự án này</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Cho thầy cô, bạn bè xem cách bạn làm việc với AI
                </p>
                <Button size="sm" className="w-full gap-2">
                  <Share2 className="w-4 h-4" />
                  Sao chép link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
