"use client";
import MissionPageSkeletion from "@/components/skeleton/MissionPageSkeletion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChatSession } from "@/contexts/chat-session-context";
import { projectData } from "@/data/mockdata";
import { DetailedProject } from "@/interfaces/project.interface";
import { getProjectById } from "@/services/projects.service";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Lightbulb,
  Play,
  Star,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectDetailPage() {
  const params = useParams();
  const missionId =
    typeof params.projectId === "string" ? params.projectId : undefined;
  const [project, setProject] = useState<DetailedProject>();
  const [isStartingSession, setIsStartingSession] = useState(false);
  const router = useRouter();
  const { startNewSession, sessionId } = useChatSession();

  const handleStartProject = async () => {
    if (!missionId) {
      console.error("Mission ID is undefined");
      return;
    }
    try {
      setIsStartingSession(true);
      await startNewSession(missionId);
      // sessionId will be set in the context and useEffect will handle navigation
    } catch (error) {
      console.error("Error starting new session:", error);
      setIsStartingSession(false);
    }
  };

  // Navigate when sessionId becomes available
  useEffect(() => {
    if (isStartingSession && sessionId) {
      router.push(`/ai-lab/${sessionId}`);
      setIsStartingSession(false);
    }
  }, [sessionId, isStartingSession, router]);

  useEffect(() => {
    async function fetchProject() {
      if (!missionId) {
        notFound();
        return;
      }
      try {
        const response = await getProjectById({ missionId });
        console.log(response);
        setProject(response);
      } catch (error) {
        console.error("Failed to fetch project:", error);
        notFound();
      }
    }
    fetchProject();
  }, [missionId]);
  if (!project) {
    return <MissionPageSkeletion />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      {/* <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
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
      </header> */}

      <div className="mx-auto px-4 py-8 lg:px-8 grid grid-cols-2 gap-8 h-[calc(100vh-6rem)]">
        {/* Project Header */}
        <div className=" border border-zinc-200  rounded-2xl p-2 h-full flex flex-col  bg-white/60 backdrop-blur-sm">
          <div className="border border-zinc-100 h-full p-6 rounded-xl flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-gradient-to-r from-sky-300 to-blue-500 text-white border-0">
                {project.category}
              </Badge>
              <Badge className="bg-white/80 text-gray-700 border-white/40">
                {project.difficulty}
              </Badge>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {project.estimated_hours} giờ
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

            <h1 className="font-bold text-4xl lg:text-4xl bg-gradient-to-r tracking-tight from-sky-300 to-blue-500 bg-clip-text text-transparent mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-gray-700 mb-6">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.skills_required.map((skill) => (
                <Badge
                  key={skill}
                  variant={"outline"}
                  className="bg-white/80 text-gray-700 rounded-full"
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-none border border-zinc-150  mb-4 h-fit">
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
            <div className="mt-auto">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-sky-300 to-blue-500 hover:from-sky-400 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleStartProject}
              >
                <Play className="w-5 h-5" />
                Bắt đầu trong AI Lab
              </Button>
            </div>
          </div>
        </div>

        <div className="h-full overflow-y-auto pr-2 w-full">
          <div className="grid">
            {/* Main Content */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-4">
              {/* Context */}
              <div className="border border-zinc-200 rounded-2xl p-2 bg-white/60 backdrop-blur-sm">
                <Card className="border border-zinc-100 shadow-none">
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
              </div>

              {/* Objectives */}
              <div className="border border-zinc-200 rounded-2xl p-2 bg-white/60 backdrop-blur-sm">
                <Card className="border border-zinc-100 shadow-none">
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
                      {project.learning_objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Deliverables */}
              <div className="border border-zinc-200 rounded-2xl p-2 bg-white/60 backdrop-blur-sm">
                <Card className="border border-zinc-100 shadow-none">
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
              </div>
              <div className="border border-zinc-200 rounded-2xl p-2 bg-gradient-to-r from-blue-50 to-slate-50">
                <Card className="border border-zinc-100 shadow-none backdrop-blur-sm">
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
                          Toàn bộ quá trình tương tác với AI sẽ được ghi lại để
                          tạo thành portfolio của bạn. Hãy thực hiện một cách
                          chỉn chu và sáng tạo.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
