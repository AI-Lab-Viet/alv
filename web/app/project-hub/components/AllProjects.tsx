"use client";
import AllProjectCard from "@/components/project-cards/AllProjectCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { categories } from "@/consts/categories";
import { DetailedProject } from "@/interfaces/project.interface";
import { useIsMobile } from "@/components/ui/use-mobile";
import {
  getAllProject,
  getProjectByCategory,
} from "@/services/projects.service";
import { BookOpen } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function AllProjects() {
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState<Record<string, { currentPage: number; totalPages: number; projects: DetailedProject[] }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const pageSize = 10;

  const fetchProjectsForTab = async (tab: string, page: number = 1) => {
    setIsLoading(true);
    try {
      let result;
      if (tab === "all") {
        result = await getAllProject({ currentPage: page, pageSize });
      } else {
        result = await getProjectByCategory({ category: tab, currentPage: page, pageSize });
      }
      const totalPages = Math.ceil(result.total / pageSize);
      setPagination((prev) => ({
        ...prev,
        [tab]: { currentPage: page, totalPages, projects: result.missions },
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!pagination[activeTab]) {
      fetchProjectsForTab(activeTab);
    }
  }, [activeTab, pagination]);

  const handlePageChange = (page: number) => {
    fetchProjectsForTab(activeTab, page);
  };

  const renderPagination = () => {
    const { currentPage = 1, totalPages = 0 } = pagination[activeTab] || {};
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === totalPages - 1) {
        pages.push("ellipsis");
      }
    }

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => { if (currentPage > 1) handlePageChange(currentPage - 1); }} />
          </PaginationItem>
          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(Number(page))}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => { if (currentPage < totalPages) handlePageChange(currentPage + 1); }} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderTabsContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: pageSize }).map((_, index) => (
            <Skeleton key={index} className="h-54 rounded-lg bg-white" />
          ))}
        </div>
      );
    }

    const projects = pagination[activeTab]?.projects || [];

    if (projects.length === 0) {
      return <div className="text-center py-12">Không có dự án nào.</div>;
    }

    return (
      <>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <AllProjectCard project={project} key={project.id} />
          ))}
        </div>
        {renderPagination()}
      </>
    );
  }, [isLoading, pagination, activeTab]);

  const getCategoryDisplayName = (value: string) => {
    if (value === "all") return "Tất cả";
    return value;
  };

  return (
    <section>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <h2 className=" font-bold text-3xl text-gray-900 mb-8 tracking-tight">
            Tất cả dự án
          </h2>
        </div>

        {/* Mobile Select Component */}
        {isMobile ? (
          <div className="mb-6">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn danh mục">
                  {getCategoryDisplayName(activeTab)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          /* Desktop Tabs Component */
          <TabsList className="rounded-lg mb-6 w-full">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {renderTabsContent()}
      </Tabs>
    </section>
  );
}
