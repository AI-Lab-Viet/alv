import {
  BookOpen,
  Briefcase,
  GraduationCap,
  Home,
  Merge,
  Palette,
  PersonStanding,
  SearchCode,
  Share2,
} from "lucide-react";

export const categories: string[] = [
  "Nghiên cứu & Học thuật",
  "Nghệ thuật & Sáng tạo",
  "Tiện ích Đời sống",
  "Phát triển sự nghiệp",
];

export const projectCategories = [
  {
    id: "academic",
    title: "Nghiên cứu & Học thuật",
    description: "Hỗ trợ học tập và nghiên cứu",
    icon: GraduationCap,
    gradient: "from-blue-500 to-cyan-400",
    bgGradient: "from-blue-50 to-cyan-50",
    count: 12,
    main_skills: [
      { icon: PersonStanding, label: "Nhận định" },
      { icon: SearchCode, label: "Trách nhiệm" },
    ],
  },
  {
    id: "creative",
    title: "Nghệ thuật & Sáng tạo",
    description: "Nghệ thuật và nội dung sáng tạo",
    icon: Palette,
    gradient: "from-purple-500 to-pink-400",
    bgGradient: "from-purple-50 to-pink-50",
    count: 8,
    main_skills: [
      { icon: BookOpen, label: "Mô tả" },
      { icon: Merge, label: "Tổng hợp" },
    ],
  },
  {
    id: "daily-life",
    title: "Tiện ích Đời sống",
    description: "Giải quyết vấn đề hàng ngày",
    icon: Home,
    gradient: "from-emerald-500 to-teal-400",
    bgGradient: "from-emerald-50 to-teal-50",
    count: 15,
    main_skills: [
      { icon: Share2, label: "Phân công" },
      { icon: BookOpen, label: "Mô tả" },
    ],
  },
  {
    id: "career",
    title: "Phát triển sự nghiệp",
    description: "Phát triển kỹ năng nghề nghiệp",
    icon: Briefcase,
    gradient: "from-orange-500 to-amber-400",
    bgGradient: "from-orange-50 to-amber-50",
    count: 10,
    main_skills: [
      { icon: Share2, label: "Phân công" },
      { icon: Merge, label: "Tổng hợp" },
    ],
  },
];
