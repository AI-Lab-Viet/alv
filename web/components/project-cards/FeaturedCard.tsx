"use client";
import { Clock, Users, Star, Link, ChevronRight, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { DetailedProject } from "@/interfaces/project.interface";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function FeaturedCard({
  project,
}: {
  project: DetailedProject;
}) {
  const router = useRouter();
  console.log(project);
  return (
    <CarouselItem className="shadow-none">
      <div
        className="w-full group relative h-72 bg-cover bg-center rounded-2xl flex flex-col justify-end p-6 text-white cursor-pointer"
        style={{ backgroundImage: `url(${project.thumbnail})` }}
        onClick={() => router.push(`/project-hub/${project.id}`)}
      >
        {/* Black overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>

        <div className="absolute left-4 h-20 top-36 flex flex-col gap-2 w-[calc(100%-2rem)] z-10">
          <div className="ml-4">
            <h3 className="text-4xl tracking-tight font-semibold">
              {project.title}
            </h3>
          </div>
          <div className="flex-grow w-full flex items-center justify-between flex-row  p-4">
            {/* <Separator orientation="vertical" className="mx-4 bg-white/20" /> */}

            <div className="flex flex-row items-center h-full w-fit">
              <div className="col-span-2">
                <h3 className="text-sm tracking-tight ">Thể loại</h3>
                <p className="text-lg font-semibold ">{project.category}</p>
              </div>
              <Separator orientation="vertical" className="mx-4 bg-white/20" />

              <div className="">
                <h3 className="text-sm tracking-tight ">Độ khó</h3>
                <p className="text-xl font-semibold ">{project.difficulty}</p>
              </div>
              <Separator orientation="vertical" className="mx-4 bg-white/20" />
              <div className="min-w-18">
                <h3 className="text-sm tracking-tight ">Đánh giá</h3>
                <p className="text-xl font-semibold ">{project.rating}</p>
              </div>
              <Separator orientation="vertical" className="mx-4 bg-white/20" />
              <div className="min-w-18">
                <h3 className="text-sm tracking-tight ">Kỹ năng</h3>
                <p className="text-md font-semibold ">
                  {project.skills_required.join(", ").length > 60 ? (
                    <>{project.skills_required.join(", ").slice(0, 60)}...</>
                  ) : (
                    project.skills_required.join(", ")
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CarouselItem>
  );
}
