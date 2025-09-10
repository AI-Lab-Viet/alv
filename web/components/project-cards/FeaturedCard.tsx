"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DetailedProject } from "@/interfaces/project.interface";
import { ChevronRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function FeaturedCard({
  project,
}: {
  project: DetailedProject;
}) {
  const router = useRouter();
  // console.log(project);
  return (
    <Card
      className="w-full group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow duration-300 p-2"
      onClick={() => router.push(`/project-hub/${project.id}`)}
    >
      <CardHeader
        className=" rounded-lg overflow-hidden h-48 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${project.thumbnail})` }}
      >
        <Badge
          variant="outline"
          className="text-xs text-white absolute top-2 left-2 bg-black/50 border-none"
        >
          <Star className="inline mr-1" fill="currentColor" /> {project.rating}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-3 ">
        <CardTitle className="text-black tracking-tight text-xl font-semibold line-clamp-2">
          {project.title}
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {project.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {project.difficulty}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Kỹ năng: </span>
            <span className="text-foreground">
              {(project.skills_required || project.domain_skills).join(", ").length > 50 ? (
                <>{(project.skills_required || project.domain_skills).join(", ").slice(0, 50)}...</>
              ) : (
                (project.skills_required || project.domain_skills).join(", ")
              )}
            </span>
          </div>
        </div>
        <CardFooter className="p-0 mt-2">
          <Button
            className="flex flex-row items-center w-full cursor-pointer"
            variant={"outline"}
            onClick={() => router.push(`/project-hub/${project.id}`)}
          >
            Thực hành ngay
            <ChevronRight className="w-4 h-4 inline-block ml-1" />
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
