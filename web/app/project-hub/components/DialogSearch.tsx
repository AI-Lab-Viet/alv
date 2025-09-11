"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DetailedProject } from "@/interfaces/project.interface";
import { getProjectByName } from "@/services/projects.service";
import { Filter, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";

// Types for better state management
interface SearchState {
  query: string;
  results: DetailedProject[];
  isLoading: boolean;
  isLoadingMore: boolean;
  currentPage: number;
  hasMore: boolean;
  lastRequestId: number;
}

interface DialogProps {
  isOpen: boolean;
  toggle: () => void;
}

const DialogSearch = (props: DialogProps) => {
  const { isOpen, toggle } = props;

  // Consolidated state for better race condition management
  const [searchState, setSearchState] = useState<SearchState>({
    query: "",
    results: [],
    isLoading: false,
    isLoadingMore: false,
    currentPage: 1,
    hasMore: false,
    lastRequestId: 0,
  });

  // Refs for managing ongoing operations
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentRequestIdRef = useRef<number>(0);

  // Function to cancel ongoing requests
  const cancelOngoingRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Enhanced search function with request cancellation and ID tracking
  const performSearch = useCallback(async (
    query: string,
    page: number = 1,
    isLoadMore: boolean = false,
    requestId: number
  ) => {
    // Cancel any ongoing request
    cancelOngoingRequests();

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Update loading state
      setSearchState(prev => ({
        ...prev,
        isLoading: !isLoadMore,
        isLoadingMore: isLoadMore,
      }));

      const response = await getProjectByName({
        name: query,
        page,
        pageSize: 3,
      });

      // Check if this request is still the most recent one
      if (requestId !== currentRequestIdRef.current) {
        // This response is stale, ignore it
        return;
      }

      setSearchState(prev => {
        // Double-check request ID to prevent race conditions
        if (requestId !== currentRequestIdRef.current) {
          return prev;
        }

        if (isLoadMore) {
          return {
            ...prev,
            results: [...prev.results, ...response.missions],
            currentPage: page,
            hasMore: response.total_missions > page * 3,
            isLoadingMore: false,
            lastRequestId: requestId,
          };
        } else {
          return {
            ...prev,
            results: response.missions,
            currentPage: 1,
            hasMore: response.total_missions > 3,
            isLoading: false,
            isLoadingMore: false,
            lastRequestId: requestId,
          };
        }
      });

    } catch (error) {
      // Check if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Silently ignore aborted requests
      }

      // Only show error if this is still the current request
      if (requestId === currentRequestIdRef.current) {
        toast.error(`Có lỗi xảy ra ${JSON.stringify(error)}`);
        setSearchState(prev => ({
          ...prev,
          isLoading: false,
          isLoadingMore: false,
        }));
      }
    }
  }, [cancelOngoingRequests]);

  // Debounced search with race condition protection
  const debouncedSearch = useCallback((query: string) => {
    if (query.trim() === "") {
      setSearchState(prev => ({
        ...prev,
        query: "",
        results: [],
        isLoading: false,
        isLoadingMore: false,
        hasMore: false,
        currentPage: 1,
      }));
      return;
    }

    // Increment request ID to track the latest request
    const requestId = ++currentRequestIdRef.current;

    setSearchState(prev => ({
      ...prev,
      query,
      lastRequestId: requestId,
    }));

    performSearch(query, 1, false, requestId);
  }, [performSearch]);

  // Load more handler with proper state management
  const handleLoadMore = useCallback(async () => {
    if (searchState.isLoadingMore || !searchState.hasMore) return;

    const requestId = ++currentRequestIdRef.current;
    const nextPage = searchState.currentPage + 1;

    // Use the current query from state to avoid stale closures
    await performSearch(searchState.query, nextPage, true, requestId);
  }, [searchState.query, searchState.currentPage, searchState.isLoadingMore, searchState.hasMore, performSearch]);
  // Effect to handle search input changes with debouncing
  useEffect(() => {
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      debouncedSearch(searchState.query);
    }, 300); // 300ms debounce delay

    // Cleanup function to clear timeout
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchState.query, debouncedSearch]);

  // Cleanup on unmount and dialog close
  useEffect(() => {
    return () => {
      // Cancel any ongoing requests
      cancelOngoingRequests();

      // Clear any pending timeouts
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [cancelOngoingRequests]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      cancelOngoingRequests();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      setSearchState({
        query: "",
        results: [],
        isLoading: false,
        isLoadingMore: false,
        currentPage: 1,
        hasMore: false,
        lastRequestId: 0,
      });
      currentRequestIdRef.current = 0;
    }
  }, [isOpen, cancelOngoingRequests]);

  const renderSearchResults = useCallback(() => {
    if (searchState.isLoading && searchState.results.length === 0) {
      return (
        <div className="text-sm text-gray-600 flex flex-row items-center justify-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang tìm kiếm...
        </div>
      );
    }
    if (searchState.results.length === 0 && searchState.query.trim() !== "") {
      return (
        <div className="text-sm text-gray-600 text-center">
          Không tìm thấy dự án
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-2">
        {searchState.results.map((mission) => (
          <div
            key={mission.id}
            className="bg-white/80 backdrop-blur-sm border-white/20 p-2 rounded-md"
          >
            <div className="flex flex-col items-start gap-2">
              <h3 className="font-semibold text-md tracking-tight">
                {mission.title}
              </h3>
              <p className="text-sm text-gray-600">
                {mission.description.slice(0, 30)}...
              </p>
            </div>
          </div>
        ))}
        {searchState.isLoadingMore && (
          <div className="text-sm text-gray-600 flex flex-row items-center justify-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang tải thêm...
          </div>
        )}
        {searchState.hasMore && !searchState.isLoadingMore && (
          <div className="w-full h-12 flex items-center justify-center">
            <Button
              variant={"ghost"}
              className="mx-auto"
              onClick={handleLoadMore}
              disabled={searchState.isLoadingMore}
            >
              Tải thêm
            </Button>
          </div>
        )}
      </div>
    );
  }, [searchState.results, searchState.isLoading, searchState.isLoadingMore, searchState.query, searchState.hasMore, handleLoadMore]);

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogPortal>
        <DialogOverlay />

        <DialogContent className="border-8 rounded-2xl">
          <DialogHeader>
            <DialogTitle>Tìm kiếm dự án</DialogTitle>
            <DialogDescription>
              Thử tìm kiếm theo tên, hoặc theo nhóm kỹ năng bạn muốn rèn luyện
            </DialogDescription>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Label>Tìm kiếm theo tên</Label>
                <Input
                  placeholder="Nhập tên dự án"
                  className="bg-white/80 backdrop-blur-sm"
                  value={searchState.query}
                  onChange={(e) => setSearchState(prev => ({ ...prev, query: e.target.value }))}
                />
              </div>
              <div>
                <Label>Lọc theo danh mục</Label>

                <Select>
                  <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-white/20">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="academic">Học thuật</SelectItem>
                    <SelectItem value="creative">Sáng tạo</SelectItem>
                    <SelectItem value="daily-life">Đời sống</SelectItem>
                    <SelectItem value="career">Hướng nghiệp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogHeader>
          {renderSearchResults()}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default DialogSearch;
