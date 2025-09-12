import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  BookOpen,
  Briefcase,
  ChevronRight,
  Clock,
  GraduationCap,
  Home,
  Merge,
  Palette,
  PersonStanding,
  SearchCode,
  Share2,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projectCategories } from "@/consts/categories";

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
              className={`group hover:shadow-2xl bg-gradient-to-br hover:-translate-y-2 transition-all duration-500 cursor-pointer border-0 backdrop-blur-sm overflow-hidden ${category.bgGradient}`}
            >
              <CardContent className="p-0 h-full flex flex-col justify-between">
                <div className="flex w-full flex-row items-start justify-between gap-2 px-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Target className="w-3 h-3" />
                    <span>Thực hành</span>
                  </div>
                </div>
                <div className={`  px-6 pt-6 pb-2 relative overflow-hidden`}>
                  {/* <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div> */}
                  {/* <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div> */}

                  <div className="text-left relative z-10">
                    <h3 className=" font-semibold text-2xl tracking-tight mb-2 text-gray-900">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
                {/* Main Skills */}
                <div className="px-6 pt-0 pb-4 flex flex-wrap items-center">
                  {category.main_skills.map((skill, index) => {
                    const SkillIcon = skill.icon;
                    return (
                      <Badge
                        key={index}
                        className="bg-white/80 text-gray-700 rounded-full mr-2 mb-2"
                      >
                        <SkillIcon className="w-3 h-3 mr-1" />
                        {skill.label}
                      </Badge>
                    );
                  })}
                </div>

                <CardFooter>
                  <div className=" w-full pt-4 border-t border-zinc-300 flex flex-row justify-between items-center">
                    <Badge
                      className={`bg-transparent text-black border-0 shadow-none`}
                    >
                      {category.count} dự án
                    </Badge>
                    <Button
                      variant="ghost"
                      className={`w-fit group-hover:bg-gradient-to-r ${category.gradient} group-hover:text-white transition-all duration-300`}
                    >
                      Khám phá
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardFooter>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
