"use client";
import AllProjectCard from "@/components/project-cards/AllProjectCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories } from "@/consts/categories";
import { DetailedProject } from "@/interfaces/project.interface";
import {
  getAllProject,
  getProjectByCategory,
} from "@/services/projects.service";
import { BookOpen } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AllProjects() {
  const [fetchedProject, setFetchedProject] = useState<DetailedProject[]>([]);
  const [listProject, setListProject] = useState<DetailedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  async function handleTabChange(category: string) {
    setIsLoading(true);
    try {
      if (category === "all") {
        // Small delay to show loading state even for cached data
        await new Promise((resolve) => setTimeout(resolve, 300));
        setListProject(fetchedProject);
      } else {
        const fetchedList = await getProjectByCategory({ category });
        setListProject(fetchedList);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  }
  function renderTabsTriggers() {
    return (
      <TabsList className="rounded-lg mb-6 w-full">
        <TabsTrigger value="all" onClick={() => handleTabChange("all")}>
          Tất cả
        </TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger
            key={category}
            value={category}
            onClick={() => handleTabChange(category)}
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    );
  }

  const renderTabsContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-54 rounded-lg bg-white" />
          <Skeleton className="h-54 rounded-lg bg-white" />
          <Skeleton className="h-54 rounded-lg bg-white" />
          <Skeleton className="h-54 rounded-lg bg-white" />
        </div>
      );
    }
    if (listProject.length === 0) {
      return <div className="text-center py-12">Không có dự án nào.</div>;
    }
    console.log(listProject);
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {listProject.map((project) => (
          <AllProjectCard project={project} key={project.id} />
        ))}
      </div>
    );
  }, [listProject, isLoading]); // Added isLoading to dependency array

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const projectsData = await getAllProject({});
        console.log(projectsData);
        setFetchedProject(projectsData);
        setListProject(projectsData);
      } catch (error) {
        console.error("Error fetching initial projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section>
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <h2 className=" font-bold text-3xl text-gray-900 mb-8 tracking-tight">
            Tất cả dự án
          </h2>
        </div>
        {renderTabsTriggers()}

        {renderTabsContent()}
      </Tabs>

      <div className="text-center mt-12">
        <Button
          variant="outline"
          size="lg"
          className="hover:bg-gradient-to-r hover:from-slate-600 hover:to-blue-600 hover:text-white hover:border-transparent transition-all duration-300 bg-transparent"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Tải thêm dự án
        </Button>
      </div>
    </section>
  );
}
