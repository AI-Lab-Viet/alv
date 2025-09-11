"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DetailedProject } from "@/interfaces/project.interface";
import { CheckCircle, PanelLeft } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";
import projectSidebarImage from "@/public/images/mascot/project_sidebar.png";
interface ProjectSidebarProps {
  project: DetailedProject;
  completedObjectives: number[];
  onCompleteObjective: (index: number) => void;
  focusedPanel?: "sidebar" | "chat" | "note" | null;
  onPanelFocus?: (panel: "sidebar" | "chat" | "note" | null) => void;
}

export default function ProjectSidebar({
  project,
  completedObjectives,
  onCompleteObjective,
  focusedPanel,
  onPanelFocus,
}: ProjectSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on image
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sidebarRef.current) return;

    const rect = sidebarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - imagePosition.x;
    const y = e.clientY - rect.top - imagePosition.y;

    setDragOffset({ x, y });
    setIsDragging(true);
    e.preventDefault();
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sidebarRef.current) return;

    const rect = sidebarRef.current.getBoundingClientRect();
    const newX = Math.max(
      0,
      Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 100)
    );
    const newY = Math.max(
      0,
      Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 100)
    );

    setImagePosition({ x: newX, y: newY });
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={sidebarRef}
      className={`lg:col-span-1 h-full overflow-y-auto bg-white rounded-none relative border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-12"
      }`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Context */}
      <div className="flex items-center justify-between w-full h-12  pb-1 px-2 pt-2 sticky z-10 top-0 bg-zinc-50">
        {isOpen && (
          <h1 className="tracking-tighter text-md p-1 whitespace-nowrap">
            Thông tin dự án
          </h1>
        )}
        <button
          className={`text-sm p-0 mb-1 ${
            isOpen ? "mr-2" : "mx-auto"
          } cursor-pointer`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <PanelLeft className="w-4 h-4 text-gray-600 inline-block" />
        </button>
      </div>
      {isOpen && (
        <div className="px-2 pb-4 relative">
          {/* <Image
            // src={"@/public/images/mascot/project_sidebar.png"}
            src={projectSidebarImage}
            alt="Project Image"
            className={`absolute z-40 cursor-move select-none transition-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            style={{
              left: `${imagePosition.x}px`,
              top: `${imagePosition.y}px`,
            }}
            width={100}
            height={100}
            onMouseDown={handleMouseDown}
            onDragStart={(e) => e.preventDefault()} // Prevent default drag behavior
          /> */}
          <Card className="bg-white/80 backdrop-blur-sm border-none rounded-none shadow-none">
            <CardHeader className="">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className=" font-semibold">Bối cảnh</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 leading-relaxed">
                {project.context}
              </p>
            </CardContent>
          </Card>

          <Separator />

          {/* Objectives */}
          <Card className="bg-white/80 backdrop-blur-sm border-none rounded-none shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center gap-2">
                <span className=" font-semibold">
                  Mục tiêu ({completedObjectives.length}/
                  {project.learning_objectives.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {project.learning_objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <button
                      onClick={() => onCompleteObjective(index)}
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors ${
                        completedObjectives.includes(index)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {completedObjectives.includes(index) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </button>
                    <span
                      className={`text-sm ${
                        completedObjectives.includes(index)
                          ? "text-blue-700 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      {objective}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Separator />

          {/* Tips */}
          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-none rounded-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center gap-2">
                <span className=" font-semibold">Gợi ý</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {project.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 leading-relaxed"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-gradient-to-r from-slate-500 to-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>{tip}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
