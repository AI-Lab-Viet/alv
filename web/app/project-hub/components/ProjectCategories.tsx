import { Card, CardContent } from "@/components/ui/card";
import {
  Badge,
  BookOpen,
  Briefcase,
  ChevronRight,
  Clock,
  GraduationCap,
  Home,
  Palette,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
export default function ProjectCategories() {
  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className=" font-bold text-3xl text-gray-900 mb-4">
          Danh mục dự án
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Chọn lĩnh vực phù hợp với mục tiêu học tập của bạn
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {projectCategories.map((category) => {
          const IconComponent = category.icon;

          return (
            <Card
              key={category.id}
              className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
            >
              <CardContent className="p-0">
                <div
                  className={`bg-gradient-to-br ${category.bgGradient} p-6 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>

                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  <div className="text-center relative z-10">
                    <h3 className=" font-bold text-xl mb-2 text-gray-900">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="flex items-center justify-center gap-2">
                      <Badge
                        className={`bg-gradient-to-r ${category.gradient} text-white border-0 shadow-sm`}
                      >
                        {category.count} dự án
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Target className="w-3 h-3" />
                        <span>Thực hành</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white">
                  <Button
                    variant="ghost"
                    className={`w-full group-hover:bg-gradient-to-r ${category.gradient} group-hover:text-white transition-all duration-300`}
                  >
                    Khám phá dự án
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
