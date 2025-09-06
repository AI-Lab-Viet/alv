"use client";
import FeaturedCard from "@/components/project-cards/FeaturedCard";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { DIFFICULTY } from "@/consts/common";
import { DetailedProject } from "@/interfaces/project.interface";
import { getFeaturedProject } from "@/services/projects.service";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

export default function FeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState<DetailedProject[]>(
    []
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      const projects = await getFeaturedProject({});
      setFeaturedProjects(projects);
    };
    fetchFeaturedProjects();
  }, []);
  if (featuredProjects.length === 0) {
    return <Skeleton className="w-full h-64 mb-8" />; // Or a loading spinner, or a placeholder
  }
  return (
    <section className="mb-20">
      <Carousel
        className="mx-auto relative group"
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselPrevious className="absolute left-4 top-1/2 text-white group-hover:flex hidden z-10 bg-transparent" />
        <CarouselNext className="absolute right-8 top-1/2 text-white group-hover:flex hidden z-10 bg-transparent" />
        <CarouselContent className="w-full rounded-2xl">
          {featuredProjects.map((project) => (
            <FeaturedCard key={project.id} project={project} />
          ))}
        </CarouselContent>
      </Carousel>
      <div className="text-muted-foreground py-2 text-center text-sm">
        {Array.from({ length: count }).map((_, index) => (
          <span
            key={index}
            className={`inline-block w-8 h-2 rounded-full mx-1 ${
              index === current - 1 ? "bg-current" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
