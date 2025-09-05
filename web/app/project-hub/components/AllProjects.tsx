"use client";
import AllProjectCard from "@/components/project-cards/AllProjectCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailedProject } from "@/interfaces/project.interface";
import { getAllProject } from "@/services/projects.service";
import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Home,
  Palette,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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

const allProjects: DetailedProject[] = [
  {
    id: "recipe-creation",
    title: "Tạo công thức món ăn Việt",
    description:
      "Phát triển công thức nấu ăn mới kết hợp ẩm thực truyền thống và hiện đại",
    category: "Sáng tạo",
    difficulty: "Cơ bản",
    estimated_hours: "30 phút",
    context: "Khám phá và tạo ra các món ăn Việt Nam độc đáo",
    objectives: ["Tạo công thức mới", "Kết hợp truyền thống và hiện đại"],
    deliverables: ["Công thức hoàn chỉnh", "Hướng dẫn nấu ăn"],
    tips: ["Chú ý đến hương vị cân bằng", "Sử dụng nguyên liệu tươi"],
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
    estimated_hours: "60 phút",
    context:
      "Chuẩn bị cho phỏng vấn vị trí Marketing tại các công ty công nghệ",
    objectives: [
      "Luyện tập câu trả lời",
      "Chuẩn bị câu hỏi cho nhà tuyển dụng",
    ],
    deliverables: ["Kịch bản phỏng vấn", "Danh sách câu hỏi"],
    tips: ["Nghiên cứu công ty trước", "Chuẩn bị ví dụ cụ thể"],
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
    estimated_hours: "75 phút",
    context: "Khám phá và thể hiện vẻ đẹp của phố cổ Hà Nội qua văn chương",
    objectives: ["Viết truyện ngắn 500 từ", "Thể hiện đặc trưng phố cổ"],
    deliverables: ["Bản thảo truyện ngắn", "Bài phân tích bối cảnh"],
    tips: ["Quan sát chi tiết môi trường", "Sử dụng ngôn ngữ sinh động"],
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
    estimated_hours: "40 phút",
    context: "Quản lý tài chính cá nhân hiệu quả cho sinh viên",
    objectives: ["Tạo bảng chi tiêu", "Xác định mức tiết kiệm"],
    deliverables: ["Bảng ngân sách Excel", "Kế hoạch tiết kiệm"],
    tips: ["Theo dõi chi tiêu hàng ngày", "Ưu tiên các khoản chi cần thiết"],
    participants: 987,
    rating: 4.7,
    skills: ["Quản lý tài chính", "Lập kế hoạch", "Excel"],
    thumbnail: "/images/project-travel-planning.jpg",
  },
];

export default function AllProjects() {
  const [fetchedProject, setFetchedProject] = useState<DetailedProject[]>([]);
  const [listProject, setListProject] = useState<DetailedProject[]>([]);
  function handleTabChange(category: string) {
    if (category === "all") {
      setListProject(fetchedProject);
    } else {
      setListProject(
        fetchedProject.filter((project) => project.category === category)
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
    console.log(listProject);
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {listProject.map((project) => (
          <AllProjectCard project={project} key={project.id} />
        ))}
      </div>
    );
  }, [listProject]);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsData = await getAllProject({});
      console.log(projectsData);
      setFetchedProject(projectsData);
      setListProject(projectsData);
    };
    fetchProjects();
  }, []);

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
