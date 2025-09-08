import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DetailedProject } from "@/interfaces/project.interface";
import { ChevronLeft, Clock, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  project: DetailedProject;
  projectId: string;
  elapsedTime: number;
  progress: number;
  onSubmissionClick: () => void;
}

export default function Header({
  project,
  projectId,
  elapsedTime,
  progress,
  onSubmissionClick,
}: HeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 shrink-0">
      <div className="max-w-7xl mx-auto px-4 py-3 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/project-hub/${projectId}`}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Trở về
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
            <div>
              <h1 className="font-semibold text-lg bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
                {project.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <Badge className="bg-gradient-to-r from-slate-100 to-blue-100 text-slate-700 border-slate-200">
                  {project.category}
                </Badge>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium">
                {Math.round(progress)}% hoàn thành
              </div>
              <Progress value={progress} className="w-32 h-2" />
            </div>
            <Button
              onClick={onSubmissionClick}
              disabled={progress < 100}
              className="gap-2 bg-gradient-to-r from-sky-300 to-blue-500 hover:from-slate-700 hover:to-blue-700 transition-all duration-200"
            >
              <Upload className="w-4 h-4" />
              Nộp bài
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
