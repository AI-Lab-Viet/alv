"use client";
import MissionPageSkeletion from "@/components/skeleton/MissionPageSkeletion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useChatSession } from "@/contexts/chat-session-context";
import useToggleDialog from "@/hooks/useToggleDialog";
import { DetailedProject } from "@/interfaces/project.interface";
import { getProjectById } from "@/services/projects.service";
import {
  Clock,
  Loader2,
  Play,
  Star,
  Users,
} from "lucide-react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AnalysisModal from "../components/AnalysisModal";
import ProjectAccordionItem from "../components/ProjectAccordionItem";

export default function ProjectDetailPage() {
  const params = useParams();
  const missionId =
    typeof params.projectId === "string" ? params.projectId : undefined;
  const [project, setProject] = useState<DetailedProject>();
  const [isStartingSession, setIsStartingSession] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFinished = searchParams.get("finished") === "true";
  const { startNewSession, isLoading, analysis } = useChatSession();
  const [showAnalysis, toggleShowAnalysis, shouldRenderShowAnalysis] = useToggleDialog();

  const handleStartProject = async () => {
    if (!missionId) {
      console.error("Mission ID is undefined");
      return;
    }
    try {
      setIsStartingSession(true);
      const newSessionId = await startNewSession(missionId);
      console.log("newSessionId:", newSessionId);
      setIsStartingSession(false);
      router.push(`/ai-lab/${newSessionId}`);
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

  useEffect(() => {
    console.log("analysis:", analysis);
    if (analysis && isFinished && !showAnalysis) {
      toggleShowAnalysis();
    }
  }, []);

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
      <header className="w-full h-48 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
        <h1 className="font-semibold text-4xl lg:text-5xl tracking-tighter mb-2">
          {project.title}
        </h1>
        <p className="text-sm text-gray-500">
          #{project.category}
        </p>
      </header>
      <Separator />
      <div className="mx-auto px-4 py-8 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-(6rem+var(--spacing)*48))]">
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
                  {project.estimated_hours}
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


            <p className="text-xl text-gray-700 mb-6">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {(project.skills_required || project.domain_skills).map((skill) => (
                <Badge
                  key={skill}
                  variant={"outline"}
                  className="bg-white/80 text-gray-700 rounded-full"
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="mt-auto">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-sky-300 to-blue-500 hover:from-sky-400 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleStartProject}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                Bắt đầu trong AI Lab
              </Button>
            </div>
          </div>
        </div>

        <div className="h-full col-span-1 md:overflow-y-auto pr-2 w-full">
          <Accordion type="multiple" className="grid gap-4" defaultValue={["context", "note"]}>
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
            <ProjectAccordionItem
              value="note"
              title="Lưu ý quan trọng"
              type="text"
              content="Toàn bộ quá trình tương tác với AI sẽ được ghi lại để tạo thành portfolio của bạn. Hãy thực hiện một cách chỉn chu và sáng tạo."
            />
          </Accordion>
        </div>
      </div>
      {shouldRenderShowAnalysis && (
        <AnalysisModal
          isOpen={showAnalysis}
          toggleAnalysis={toggleShowAnalysis}
          analysis={analysis}
        />
      )}
    </div>
  );
}
