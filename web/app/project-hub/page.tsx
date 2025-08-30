import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Search,
  Filter,
  Clock,
  Users,
  Star,
  ChevronRight,
  BookOpen,
  Briefcase,
  Palette,
  GraduationCap,
  Home,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/nav-bar";

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

const featuredProjects = [
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

const allProjects = [
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
  },
];

export default function ProjectHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                Thực hành với AI
              </span>
            </div>
            <h1 className="font-bold text-4xl lg:text-6xl mb-6">
              <span className="bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent">
                Xưởng Dự án
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Áp dụng kiến thức AI vào các dự án thực tế. Từ lập kế hoạch du
              lịch đến viết bài luận, mỗi nhiệm vụ giúp bạn rèn luyện kỹ năng AI
              Fluency.
            </p>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto flex gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tìm kiếm dự án..."
                  className="pl-10 bg-white/80 backdrop-blur-sm border-white/20 focus:bg-white transition-all"
                />
              </div>
              <Select>
                <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-white/20">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Lọc theo danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  <SelectItem value="academic">Học thuật</SelectItem>
                  <SelectItem value="creative">Sáng tạo</SelectItem>
                  <SelectItem value="daily-life">Đời sống</SelectItem>
                  <SelectItem value="career">Hướng nghiệp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Project Categories */}
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

        {/* Featured Projects */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className=" font-bold text-3xl text-gray-900 mb-2">
                Dự án nổi bật
              </h2>
              <p className="text-gray-600">
                Những dự án được yêu thích nhất bởi cộng đồng
              </p>
            </div>
            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
              <Zap className="w-4 h-4 mr-2" />
              Xem tất cả
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-sm"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.thumbnail || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                      {project.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="outline"
                      className="bg-white/90 backdrop-blur-sm border-white/50"
                    >
                      {project.difficulty}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {project.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {project.participants.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {project.rating}
                    </span>
                  </div>

                  <Link href={`/project-hub/${project.id}`}>
                    <Button className="w-full bg-gradient-to-r from-sky-300 to-blue-500 hover:from-sky-400 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300">
                      Bắt đầu dự án
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Projects */}
        <section>
          <h2 className=" font-bold text-3xl text-gray-900 mb-8">
            Tất cả dự án
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {allProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 bg-white/90 backdrop-blur-sm border-0"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-50 text-blue-700"
                        >
                          {project.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs border-gray-200"
                        >
                          {project.difficulty}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {project.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {project.participants.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {project.rating}
                    </span>
                  </div>

                  <Link href={`/project-hub/${project.id}`}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-gradient-to-r from-sky-300 to-blue-500 hover:from-sky-400 hover:to-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 bg-transparent"
                    >
                      Xem chi tiết
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

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
      </div>
    </div>
  );
}
