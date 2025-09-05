import { DetailedProject } from "@/interfaces/project.interface";
import { Card, CardContent } from "../ui/card";
import { Clock, Users, Star, ChevronRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

export default function AllProjectCard({
  project,
}: {
  project: DetailedProject;
}) {
  return (
    <Card
      key={project.id}
      className="group shadow-none hover:-translate-y-0.5 transition-all duration-300 bg-white/40 backdrop-blur-sm border border-zinc-200 p-2"
    >
      <CardContent className="p-6 border border-zinc-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-700"
              >
                {project.category}
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-200">
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
            {project.estimated_hours}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {project.participants.toString()}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {project.rating}
          </span>
        </div>

        <Link href={`/project-hub/${project.id}`}>
          <Button variant="outline" className="w-full">
            Xem chi tiết
            <ChevronRight className="w-4 h-4 ml-2 hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
