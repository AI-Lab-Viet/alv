"use client";
import FeaturedCard from "@/components/project-cards/FeaturedCard";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailedProject } from "@/interfaces/project.interface";
import { getFeaturedProject } from "@/services/projects.service";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function FeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState<DetailedProject[]>(
    []
  );
  const [autoplayPlugin, setAutoplayPlugin] = useState<any>(null);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      const projects = await getFeaturedProject({});
      console.log(projects);
      setFeaturedProjects(projects.missions);
    };
    fetchFeaturedProjects();
  }, []);
  if (featuredProjects.length === 0) {
    return <Skeleton className="w-full h-64 mb-8" />; // Or a loading spinner, or a placeholder
  }
  const handleMouseEnter = () => {
    if (autoplayPlugin) {
      autoplayPlugin.stop();
    }
  };

  const handleMouseLeave = () => {
    if (autoplayPlugin) {
      autoplayPlugin.play();
    }
  };


  return (
    <section className="mb-20">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Dự án nổi bật</h1>
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
            }),
          ]}
          setApi={(api) => {
            if (api) {
              const autoplayInstance = api.plugins()?.autoplay;
              setAutoplayPlugin(autoplayInstance);
            }
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredProjects.map((project) => (
              <CarouselItem
                key={project.id}
                className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <FeaturedCard project={project} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="left-2"
          // onClick={handleNavigationClick}
          />
          <CarouselNext
            className="right-2"
          // onClick={handleNavigationClick}
          />
        </Carousel>
      </div>
    </section>
  );
}
