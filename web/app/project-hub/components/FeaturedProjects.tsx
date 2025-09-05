import FeaturedCard from "@/components/project-cards/FeaturedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DIFFICULTY } from "@/consts/common";
import { DetailedProject } from "@/interfaces/project.interface";
import { Zap, ChevronRight, Clock, Users, Star, Link } from "lucide-react";
const featuredProjects: DetailedProject[] = [
  {
    id: "c3356ab6-ecaf-4c14-b295-9140dd01bdc2",
    title: "Lập kế hoạch du lịch Việt Nam",
    description:
      "Tạo lịch trình chi tiết cho chuyến du lịch 3 ngày 2 đêm tại Đà Nẵng",
    category: "Đời sống",
    difficulty: DIFFICULTY.NORMAL,
    estimated_hours: "45 phút",
    context: "Lập kế hoạch du lịch hiệu quả và tiết kiệm cho chuyến đi Đà Nẵng",
    objectives: ["Tạo lịch trình 3 ngày 2 đêm", "Lựa chọn địa điểm tham quan"],
    deliverables: ["Lịch trình chi tiết", "Danh sách chi phí ước tính"],
    tips: ["Nghiên cứu thời tiết", "Đặt chỗ trước để có giá tốt"],
    participants: 1247,
    rating: 4.8,
    skills: ["Đặt câu hỏi", "Lập kế hoạch"],
    thumbnail: "/images/project-travel-planning.jpg",
  },
  {
    id: "13ad043d-42fc-4b1e-91db-dd679e562a68",
    title: "Viết bài luận về AI trong giáo dục",
    description:
      "Nghiên cứu và viết bài luận 1000 từ về tác động của AI trong giáo dục Việt Nam",
    category: "Học thuật",
    difficulty: "Trung bình",
    estimated_hours: "90 phút",
    context:
      "Phân tích tác động của công nghệ AI đối với hệ thống giáo dục Việt Nam",
    objectives: [
      "Viết bài luận 1000 từ",
      "Phân tích tác động tích cực và tiêu cực",
    ],
    deliverables: ["Bài luận hoàn chỉnh", "Danh sách tài liệu tham khảo"],
    tips: ["Tìm hiểu các ứng dụng AI hiện tại", "Sử dụng ví dụ cụ thể"],
    participants: 892,
    rating: 4.7,
    skills: ["Tư duy phản biện", "Nghiên cứu"],
    thumbnail: "/images/project-essay-writing.webp",
  },
  {
    id: "093907aa-8dfd-4699-b8d7-3ff4e9d5444c",
    title: "Kế hoạch kinh doanh quán cà phê",
    description:
      "Xây dựng kế hoạch kinh doanh chi tiết cho quán cà phê tại thành phố Hồ Chí Minh",
    category: "Hướng nghiệp",
    difficulty: "Nâng cao",
    estimated_hours: "120 phút",
    context:
      "Phát triển kế hoạch kinh doanh thực tế cho ngành F&B tại Việt Nam",
    objectives: ["Xây dựng business plan", "Phân tích thị trường"],
    deliverables: [
      "Kế hoạch kinh doanh hoàn chỉnh",
      "Bảng tính toán tài chính",
    ],
    tips: ["Nghiên cứu đối thủ cạnh tranh", "Xác định đúng target customer"],
    participants: 634,
    rating: 4.9,
    skills: ["Sáng tạo", "Phân tích"],
    thumbnail: "/images/project-business-plan.jpg",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="mb-20">
      <Carousel className="mx-auto">
        <CarouselContent className="w-full rounded-2xl">
          {featuredProjects.map((project) => (
            <FeaturedCard key={project.id} project={project} />
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
