"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, SearchIcon } from "lucide-react";
import { useState } from "react";

export default function SearchModal() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  return (
    <Select>
      <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-white/20">
        <Filter className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Lọc theo danh mục" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả danh mục</SelectItem>
        <SelectItem value="academic">Học thuật</SelectItem>
        <SelectItem value="creative">Sáng tạo</SelectItem>
        <SelectItem value="daily-life">Đời sống</SelectItem>
        <SelectItem value="career">Hướng nghiệp</SelectItem>
      </SelectContent>
    </Select>
  );
}
