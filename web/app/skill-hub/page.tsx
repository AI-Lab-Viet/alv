import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Brain,
  Lightbulb,
  Shield,
  Clock,
  Play,
  BookOpen,
  ChevronRight,
  Star,
  Search,
  Filter,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/nav-bar";

const skillCategories = [
  {
    id: "prompting",
    title: "Kỹ năng Đặt câu hỏi",
    description: "Học cách tạo ra những câu lệnh hiệu quả cho AI",
    icon: MessageSquare,
    gradient: "from-blue-500 to-cyan-400",
    bgGradient: "from-blue-50 to-cyan-50",
    lessons: 12,
    duration: "2.5 giờ",
    progress: 0,
    difficulty: "Cơ bản",
  },
  {
    id: "critical-thinking",
    title: "Tư duy Phản biện",
    description: "Nhận diện và kiểm chứng thông tin từ AI",
    icon: Brain,
    gradient: "from-emerald-500 to-teal-400",
    bgGradient: "from-emerald-50 to-teal-50",
    lessons: 10,
    duration: "2 giờ",
    progress: 0,
    difficulty: "Trung bình",
  },
  {
    id: "creativity",
    title: "Sáng tạo & Giải quyết",
    description: "Sử dụng AI để brainstorm và lập kế hoạch",
    icon: Lightbulb,
    gradient: "from-purple-500 to-pink-400",
    bgGradient: "from-purple-50 to-pink-50",
    lessons: 14,
    duration: "3 giờ",
    progress: 0,
    difficulty: "Nâng cao",
  },
  {
    id: "ethics",
    title: "Đạo đức AI",
    description: "Sử dụng AI có trách nhiệm và đúng đắn",
    icon: Shield,
    gradient: "from-orange-500 to-amber-400",
    bgGradient: "from-orange-50 to-amber-50",
    lessons: 8,
    duration: "1.5 giờ",
    progress: 0,
    difficulty: "Cơ bản",
  },
];

const featuredLessons = [
  {
    id: "prompt-basics",
    title: "Cơ bản về Prompt Engineering",
    category: "Đặt câu hỏi",
    duration: "8 phút",
    difficulty: "Cơ bản",
    thumbnail: "/ai-prompt-engineering.png",
    rating: 4.9,
    students: 2847,
  },
  {
    id: "ai-hallucination",
    title: "Nhận diện Ảo giác của AI",
    category: "Tư duy Phản biện",
    duration: "12 phút",
    difficulty: "Trung bình",
    thumbnail: "/ai-hallucination-detection.png",
    rating: 4.8,
    students: 1923,
  },
  {
    id: "creative-brainstorm",
    title: "Brainstorm với AI",
    category: "Sáng tạo",
    duration: "10 phút",
    difficulty: "Cơ bản",
    thumbnail: "/ai-brainstorming.png",
    rating: 4.7,
    students: 3156,
  },
];

export default function SkillHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <NavBar currentPath="/skill-hub" />

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-600">
                Học tập với AI
              </span>
            </div>

            <h1 className="font-bold text-4xl lg:text-6xl mb-6">
              <span className="bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent">
                Trung tâm Kỹ năng
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Nền tảng kiến thức toàn diện về AI Fluency với các bài học ngắn,
              tương tác và thực tiễn. Phát triển 4 kỹ năng cốt lõi để thành thạo
              AI.
            </p>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto flex gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tìm kiếm bài học..."
                  className="pl-10 bg-white/80 backdrop-blur-sm border-white/20 focus:bg-white transition-all"
                />
              </div>
              <Select>
                <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-white/20">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Lọc theo kỹ năng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả kỹ năng</SelectItem>
                  <SelectItem value="prompting">Đặt câu hỏi</SelectItem>
                  <SelectItem value="critical-thinking">
                    Tư duy Phản biện
                  </SelectItem>
                  <SelectItem value="creativity">Sáng tạo</SelectItem>
                  <SelectItem value="ethics">Đạo đức AI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Overall Progress */}
            <div className="max-w-md mx-auto bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Tiến độ tổng thể
                </span>
                <span className="text-sm font-bold text-slate-600">
                  0/44 bài học
                </span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </div>
        </div>

        {/* Skill Categories */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className=" font-bold text-3xl text-gray-900 mb-4">
              4 Kỹ năng Cốt lõi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Phát triển toàn diện các kỹ năng cần thiết để thành thạo AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillCategories.map((category) => {
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

                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Badge
                            className={`bg-gradient-to-r ${category.gradient} text-white border-0 shadow-sm`}
                          >
                            {category.lessons} bài học
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{category.duration}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Tiến độ</span>
                            <span className="font-medium">
                              {category.progress}%
                            </span>
                          </div>
                          <Progress value={category.progress} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white">
                      <Link href={`/skill-hub/${category.id}`}>
                        <Button
                          variant="ghost"
                          className={`w-full group-hover:bg-gradient-to-r ${category.gradient} group-hover:text-white transition-all duration-300`}
                        >
                          {category.progress > 0
                            ? "Tiếp tục học"
                            : "Bắt đầu học"}
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Featured Lessons */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className=" font-bold text-3xl text-gray-900 mb-2">
                Bài học nổi bật
              </h2>
              <p className="text-gray-600">
                Những bài học được yêu thích nhất bởi cộng đồng
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-slate-600 hover:bg-slate-50"
            >
              <Zap className="w-4 h-4 mr-2" />
              Xem tất cả
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden border-0 bg-white/90 backdrop-blur-sm"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={lesson.thumbnail || "/placeholder.svg"}
                    alt={lesson.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-sky-300/50 to-blue-500/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-5 h-5 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                      {lesson.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="outline"
                      className="bg-white/90 backdrop-blur-sm border-white/50"
                    >
                      {lesson.difficulty}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-slate-600 transition-colors">
                    {lesson.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {lesson.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {lesson.students.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {lesson.rating}
                    </span>
                  </div>

                  <Link
                    href={`/skill-hub/${lesson.category.toLowerCase()}/${
                      lesson.id
                    }`}
                  >
                    <Button className="w-full bg-gradient-to-r from-sky-300 to-blue-500 hover:from-slate-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                      Bắt đầu học
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
