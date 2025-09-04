"use client";
import AllProjectCard from "@/components/project-cards/AllProjectCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Project } from "@/interfaces/project.interface";
import {
  Clock,
  Users,
  Star,
  Link,
  ChevronRight,
  BookOpen,
  Briefcase,
  GraduationCap,
  Home,
  Palette,
} from "lucide-react";
import { useCallback, useState } from "react";

const projectCategories = [
  {
    id: "academic",
    title: "Học thuật",
    description: "Hỗ trợ học tập và nghiên cứu",
    icon: GraduationCap,
    gradient: "from-blue-500 to-cyan-400",
    bgGradient: "from-blue-50 to-cyan-50",
    count: 12,
  },
  {
    id: "creative",
    title: "Sáng tạo",
    description: "Nghệ thuật và nội dung sáng tạo",
    icon: Palette,
    gradient: "from-purple-500 to-pink-400",
    bgGradient: "from-purple-50 to-pink-50",
    count: 8,
  },
  {
    id: "daily-life",
    title: "Đời sống",
    description: "Giải quyết vấn đề hàng ngày",
    icon: Home,
    gradient: "from-emerald-500 to-teal-400",
    bgGradient: "from-emerald-50 to-teal-50",
    count: 15,
  },
  {
    id: "career",
    title: "Hướng nghiệp",
    description: "Phát triển kỹ năng nghề nghiệp",
    icon: Briefcase,
    gradient: "from-orange-500 to-amber-400",
    bgGradient: "from-orange-50 to-amber-50",
    count: 10,
  },
];

const allProjects: Project[] = [
  {
    id: "recipe-creation",
    title: "Tạo công thức món ăn Việt",
    description:
      "Phát triển công thức nấu ăn mới kết hợp ẩm thực truyền thống và hiện đại",
    category: "Sáng tạo",
    difficulty: "Cơ bản",
    duration: "30 phút",
    participants: 756,
    rating: 4.6,
    skills: ["Nấu ăn", "Sáng tạo", "Lên ý tưởng"],
    thumbnail: "/images/project-travel-planning.jpg",
  },
  {
    id: "job-interview-prep",
    title: "Chuẩn bị phỏng vấn việc làm",
    description:
      "Luyện tập câu hỏi phỏng vấn cho vị trí Marketing tại công ty công nghệ",
    category: "Hướng nghiệp",
    difficulty: "Trung bình",
    duration: "60 phút",
    participants: 1123,
    rating: 4.8,
    skills: ["Giao tiếp", "Phân tích", "Marketing"],
    thumbnail: "/images/project-travel-planning.jpg",
  },
  {
    id: "story-writing",
    title: "Viết truyện ngắn về Hà Nội",
    description: "Sáng tác truyện ngắn 500 từ lấy bối cảnh phố cổ Hà Nội",
    category: "Sáng tạo",
    difficulty: "Trung bình",
    duration: "75 phút",
    participants: 445,
    rating: 4.5,
    skills: ["Viết lách", "Sáng tạo", "Biên tập"],
    thumbnail: "/images/project-travel-planning.jpg",
  },
  {
    id: "budget-planning",
    title: "Lập ngân sách sinh viên",
    description: "Tạo kế hoạch chi tiêu hàng tháng cho sinh viên tại Hà Nội",
    category: "Đời sống",
    difficulty: "Cơ bản",
    duration: "40 phút",
    participants: 987,
    rating: 4.7,
    skills: ["Quản lý tài chính", "Lập kế hoạch", "Excel"],
    thumbnail: "/images/project-travel-planning.jpg",
  },
];

export default function AllProjects() {
  const [listProject, setListProject] = useState<Project[]>(allProjects);
  function handleTabChange(category: string) {
    if (category === "all") {
      setListProject(allProjects);
    } else {
      setListProject(
        allProjects.filter((project) => project.category === category)
      );
    }
  }
  function renderTabsTriggers() {
    return (
      <TabsList className="rounded-lg mb-6">
        <TabsTrigger value="all" onClick={() => handleTabChange("all")}>
          Tất cả
        </TabsTrigger>
        {projectCategories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            onClick={() => handleTabChange(category.title)}
          >
            {category.title}
          </TabsTrigger>
        ))}
      </TabsList>
    );
  }

  const renderTabsContent = useCallback(() => {
    if (listProject.length === 0) {
      return <div className="text-center py-12">Không có dự án nào.</div>;
    }
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {listProject.map((project) => (
          <AllProjectCard project={project} key={project.id} />
        ))}
      </div>
    );
  }, [listProject]);

  return (
    <section>
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <h2 className=" font-bold text-3xl text-gray-900 mb-8 tracking-tight">
            Tất cả dự án
          </h2>
          {renderTabsTriggers()}
        </div>
        {renderTabsContent()}
      </Tabs>

      <div className="text-center mt-12">
        <Button
          variant="outline"
          size="lg"
          className="hover:bg-gradient-to-r hover:from-slate-600 hover:to-blue-600 hover:text-white hover:border-transparent transition-all duration-300 bg-transparent"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Tải thêm dự án
        </Button>
      </div>
    </section>
  );
}
