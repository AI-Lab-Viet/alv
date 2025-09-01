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
import { Project } from "@/interfaces/project";
import { Zap, ChevronRight, Clock, Users, Star, Link } from "lucide-react";
const featuredProjects: Project[] = [
  {
    id: "c3356ab6-ecaf-4c14-b295-9140dd01bdc2",
    title: "Lập kế hoạch du lịch Việt Nam",
    description:
      "Tạo lịch trình chi tiết cho chuyến du lịch 3 ngày 2 đêm tại Đà Nẵng",
    category: "Đời sống",
    difficulty: DIFFICULTY.NORMAL,
    duration: "45 phút",
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
    duration: "90 phút",
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
    duration: "120 phút",
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
