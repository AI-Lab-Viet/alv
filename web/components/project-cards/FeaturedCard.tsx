"use client";
import { Clock, Users, Star, Link, ChevronRight, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Project } from "@/interfaces/project.interface";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function FeaturedCard({ project }: { project: Project }) {
  const router = useRouter();
  return (
    <CarouselItem
      className="shadow-none "
      onClick={() => router.push(`/project-hub/${project.id}`)}
    >
      <div
        className="w-full group relative h-64 bg-cover bg-center rounded-2xl flex flex-col justify-end p-6 text-white"
        style={{ backgroundImage: `url(${project.thumbnail})` }}
      >
        <CarouselPrevious className="absolute left-4 top-1/2 text-black group-hover:flex hidden" />
        <CarouselNext className="absolute right-4 top-1/2 text-black group-hover:flex hidden" />
        <div className="absolute left-4 h-20 bottom-4 w-[calc(100%-var(--spacing)*8)] flex items-center justify-between flex-row bg-white/20 backdrop-blur-2xl border rounded-sm border-zinc-50 p-4">
          <div className="">
            <h3 className="text-2xl tracking-tight font-semibold">
              {project.title}
            </h3>
            <p className="text-sm ">{project.description}</p>
          </div>
          <div className="flex flex-row items-center h-full">
            <Separator orientation="vertical" className="mx-4 bg-white/20" />
            <div className="">
              <h3 className="text-sm tracking-tight ">Thể loại</h3>
              <p className="text-xl font-semibold ">{project.category}</p>
            </div>
            <Separator orientation="vertical" className="mx-4 bg-white/20" />
            <div className="">
              <h3 className="text-sm tracking-tight ">Độ khó</h3>
              <p className="text-xl font-semibold ">{project.difficulty}</p>
            </div>
            <Separator orientation="vertical" className="mx-4 bg-white/20" />
            <div className="">
              <h3 className="text-sm tracking-tight ">Đánh giá</h3>
              <p className="text-xl font-semibold ">{project.rating}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex flex-wrap">
          {project.skills.map((skill) => {
            return (
              <div
                className="w-fit p-1 rounded-full bg-white/20 backdrop-blur-2xl text-xs font-medium text-white inline-block mr-2 mb-2 border border-white/30"
                key={skill}
              >
                {skill}
              </div>
            );
          })}
        </div>
      </div>
    </CarouselItem>
  );
}
