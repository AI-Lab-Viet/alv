"use client";
import MissionPageSkeletion from "@/components/skeleton/MissionPageSkeletion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useChatSession } from "@/contexts/chat-session-context";
import useToggleDialog from "@/hooks/useToggleDialog";
import { DetailedProject } from "@/interfaces/project.interface";
import { getProjectById } from "@/services/projects.service";
import { Clock, Loader2, Play, Star, Users } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectAccordionItem from "../components/ProjectAccordionItem";
import projectPageMascot from "@/public/images/mascot/project_page.png";
import Image from "next/image";

export default function ProjectDetailPage() {
  const params = useParams();
  const missionId =
    typeof params.projectId === "string" ? params.projectId : undefined;
  const [project, setProject] = useState<DetailedProject>();
  const [isStartingSession, setIsStartingSession] = useState(false);
  const router = useRouter();
  const { startNewSession, isLoading } = useChatSession();

  const handleStartProject = async () => {
    if (!missionId) {
      console.error("Mission ID is undefined");
      return;
    }
    try {
      setIsStartingSession(true);
      const sessionData = await startNewSession(missionId);
      console.log("newSessionId:", sessionData.sessionId);
      setIsStartingSession(false);
      router.push(`/ai-lab/${sessionData.sessionId}`);
      // sessionId will be set in the context and useEffect will handle navigation
    } catch (error) {
      console.error("Error starting new session:", error);
      setIsStartingSession(false);
      toast({
        title: "Error starting new session",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Navigate when sessionId becomes available
  // useEffect(() => {
  //   if (isStartingSession && sessionId) {
  //     router.push(`/ai-lab/${sessionId}`);
  //     setIsStartingSession(false);
  //   }
  // }, [sessionId, isStartingSession, router]);

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
    <div className="min-h-screen h-[calc(100vh-6rem)] bg-gray-50">
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
      <header className="w-full h-32 sm:h-40 lg:h-48 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm relative overflow-hidden px-4">
        <h1 className="font-semibold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl tracking-tighter mb-2 text-center leading-tight">
          {project.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">#{project.category}</p>
      </header>
      <Separator />
      <div className="mx-auto px-4 py-8 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-h-[calc(100vh-12rem)]">
        {/* left project info */}
        <div className="border border-zinc-200 rounded-2xl p-3 lg:p-2 h-fit lg:h-full flex flex-col bg-white/60 backdrop-blur-sm relative">
          <div className="border border-zinc-100 h-full p-4 lg:p-6 rounded-xl flex flex-col space-y-4 lg:space-y-6">
            {/* Badges and meta info */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 mb-2">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gradient-to-r from-sky-300 to-blue-500 text-white border-0 text-xs lg:text-sm">
                  {project.category}
                </Badge>
                <Badge className="bg-white/80 text-gray-700 border-white/40 text-xs lg:text-sm">
                  {project.difficulty}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-xs lg:text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="whitespace-nowrap">
                    {project.estimated_hours}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="whitespace-nowrap">
                    {project.participants.toLocaleString()} người
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 lg:w-4 lg:h-4 fill-yellow-400 text-yellow-400" />
                  <span>{project.rating}</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-base lg:text-xl text-gray-700 leading-relaxed">
              {project.description}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {(project.skills_required || project.domain_skills).map(
                (skill) => (
                  <Badge
                    key={skill}
                    variant={"outline"}
                    className="bg-white/80 text-gray-700 rounded-full text-xs lg:text-sm"
                  >
                    {skill}
                  </Badge>
                )
              )}
            </div>

            {/* Important note */}
            <div className="bg-blue-50/80 rounded-lg p-4 border border-blue-200/50">
              <h3 className="font-semibold text-base lg:text-lg tracking-tight mb-2 text-blue-900">
                Lưu ý quan trọng
              </h3>
              <p className="text-sm lg:text-base text-blue-800 leading-relaxed">
                Toàn bộ quá trình tương tác với AI sẽ được ghi lại để tạo thành
                portfolio của bạn. Hãy thực hiện một cách chỉn chu và sáng tạo.
              </p>
            </div>

            {/* Mascot - hidden on mobile, positioned better on larger screens */}
            <div className="hidden lg:block absolute bottom-4 right-4 pointer-events-none">
              <Image
                src={projectPageMascot}
                alt="Project Page Mascot"
                width={60}
                height={60}
                className="opacity-80"
              />
            </div>

            {/* Start button */}
            <div className="mt-auto pt-4">
              <Button
                size="lg"
                className="w-fit gap-2 bg-gradient-to-r from-sky-300 to-blue-500 hover:from-sky-400 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                onClick={handleStartProject}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                Bắt đầu trong AI Lab
              </Button>
            </div>
          </div>
        </div>

        {/* Right side - Project details */}
        <div className="h-fit lg:h-full lg:overflow-y-auto lg:pr-2 w-full">
          <Accordion
            type="multiple"
            className="grid gap-4"
            defaultValue={["context", "objectives"]}
          >
            <ProjectAccordionItem
              value="context"
              title="Bối cảnh dự án"
              type="text"
              content={project.context}
            />
            <ProjectAccordionItem
              value="objectives"
              title="Mục tiêu cần đạt"
              type="list"
              items={project.learning_objectives}
              listType="checkmarks"
            />
            <ProjectAccordionItem
              value="deliverables"
              title="Sản phẩm cần nộp"
              type="list"
              items={project.deliverables}
              listType="numbers"
            />
            <ProjectAccordionItem
              value="tips"
              title="Gợi ý thực hiện"
              type="list"
              items={project.tips}
              listType="dots"
            />
          </Accordion>
        </div>
      </div>
    </div>
  );
}
