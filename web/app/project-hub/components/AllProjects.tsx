"use client";
import AllProjectCard from "@/components/project-cards/AllProjectCard";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/components/ui/use-mobile";
import { categories } from "@/consts/categories";
import { DetailedProject } from "@/interfaces/project.interface";
import {
  getAllProject,
  getProjectByCategory,
} from "@/services/projects.service";
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
  }, [activeTab]);

  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= (pagination[activeTab]?.totalPages || 1)) {
      fetchProjectsForTab(activeTab, page);
    }
  }, [activeTab, pagination]);

  const renderPagination = () => {
    const { currentPage = 1, totalPages = 0 } = pagination[activeTab] || {};

    // Debug logging


    const pages = [];
    const delta = 2; // Number of pages to show around current page

    // Ensure we have at least 1 page for debugging
    const effectiveTotalPages = Math.max(1, totalPages);

    // Always show first page
    if (1 < currentPage - delta) {
      pages.push(1);
      if (2 < currentPage - delta) {
        pages.push("ellipsis");
      }
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(effectiveTotalPages, currentPage + delta); i++) {
      pages.push(i);
    }

    // Always show last page
    if (effectiveTotalPages > currentPage + delta) {
      if (effectiveTotalPages - 1 > currentPage + delta) {
        pages.push("ellipsis");
      }
      pages.push(effectiveTotalPages);
    }

    // If no pages were added, add page 1
    if (pages.length === 0) {
      pages.push(1);
    }

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => { if (currentPage > 1) handlePageChange(currentPage - 1); }}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && currentPage > 1) {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }
              }}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              tabIndex={currentPage <= 1 ? -1 : 0}
              aria-disabled={currentPage <= 1}
              aria-label="Go to previous page"
            />
          </PaginationItem>
          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(Number(page))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePageChange(Number(page));
                    }
                  }}
                  className="cursor-pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => { if (currentPage < effectiveTotalPages) handlePageChange(currentPage + 1); }}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && currentPage < effectiveTotalPages) {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }
              }}
              className={currentPage >= effectiveTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              tabIndex={currentPage >= effectiveTotalPages ? -1 : 0}
              aria-disabled={currentPage >= effectiveTotalPages}
              aria-label="Go to next page"
            />
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

        {/* Debug info
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <p>Debug Info:</p>
          <p>Active Tab: {activeTab}</p>
          <p>Current Page: {pagination[activeTab]?.currentPage || 'N/A'}</p>
          <p>Total Pages: {pagination[activeTab]?.totalPages || 'N/A'}</p>
          <p>Projects Count: {projects.length}</p>
        </div> */}

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
