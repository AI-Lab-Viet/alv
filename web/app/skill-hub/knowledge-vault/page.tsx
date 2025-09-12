"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Search,
  Filter,
  Lightbulb,
  Brain,
  Target,
  Shield,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Users,
  Zap,
  Crown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const knowledgeConcepts = [
  // Chapter 1 concepts from output.json
  {
    id: "nang-luc-ai",
    title: "Năng lực AI (AI Fluency)",
    category: "Nền tảng",
    chapter: "Chương 1",
    status: "unlocked",
    definition:
      "Khả năng hợp tác với các hệ thống AI một cách Hiệu quả, Hiệu suất, Có Đạo đức, và An toàn.",
    explanation:
      "Năng lực AI bao gồm 4 trụ cột cốt lõi: Hiệu quả & Hiệu suất (làm ra sản phẩm tốt nhất mà không lãng phí thời gian), và Có đạo đức & An toàn (tương tác trung thực, có trách nhiệm, bảo vệ sự riêng tư).",
    examples: [
      "Hiệu quả: Đặt vấn đề thẳng vào trọng tâm thay vì hỏi lan man",
      "Hiệu suất: Sử dụng đúng công cụ AI cho đúng mục đích",
      "Đạo đức: Ý thức về thiên kiến và thông tin sai lệch",
      "An toàn: Bảo vệ thông tin cá nhân và dữ liệu nhạy cảm",
    ],
    tags: ["nền tảng", "hiệu quả", "đạo đức", "an toàn"],
    icon: Brain,
    color: "from-blue-400 to-purple-600",
  },
  {
    id: "ba-phuong-thuc-hop-tac",
    title: "Ba phương thức hợp tác với AI",
    category: "Nền tảng",
    chapter: "Chương 1",
    status: "unlocked",
    definition:
      "Hành trình tiến hóa từ Người Ra lệnh → Người Đồng đội → Người Kiến tạo.",
    explanation:
      "Tùy vào bản chất công việc, mối quan hệ hợp tác thay đổi: Tự động hóa (Automation), Tăng cường (Augmentation), và Ủy quyền (Agency).",
    examples: [
      "Tự động hóa: Tóm tắt báo cáo, dịch email, viết code đơn giản",
      "Tăng cường: Brainstorm ý tưởng, phân tích vấn đề phức tạp",
      "Ủy quyền: Tạo chatbot, thiết kế agent tự động",
    ],
    tags: ["hợp tác", "tự động hóa", "tăng cường", "ủy quyền"],
    icon: Users,
    color: "from-green-400 to-blue-500",
  },
  {
    id: "framework-4d-s",
    title: "Framework 4D+S",
    category: "Nền tảng",
    chapter: "Chương 1",
    status: "unlocked",
    definition:
      "Hệ thống 5 kỹ năng nền tảng: Phân công, Mô tả, Nhận định, Trách nhiệm, và Tổng hợp.",
    explanation:
      'Framework được phát triển từ 4D của Anthropic, bổ sung thêm "+S" (Synthesis) - khả năng tổng hợp và tạo ra sản phẩm mang dấu ấn cá nhân.',
    examples: [
      "Phân công: Quyết định ai làm gì trong nhóm người-AI",
      "Mô tả: Viết prompt chi tiết, cụ thể",
      "Nhận định: Kiểm tra thông tin, phát hiện lỗi sai",
      "Trách nhiệm: Chịu trách nhiệm về chất lượng và đạo đức",
      "Tổng hợp: Tạo sản phẩm cuối mang dấu ấn cá nhân",
    ],
    tags: [
      "framework",
      "phân công",
      "mô tả",
      "nhận định",
      "trách nhiệm",
      "tổng hợp",
    ],
    icon: Crown,
    color: "from-yellow-400 to-orange-500",
  },
  // Existing concepts
  {
    id: "tu-duy-muc-tieu",
    title: "Tư duy Mục tiêu",
    category: "Phân công",
    chapter: "Chương 2",
    status: "unlocked",
    definition:
      "Khả năng xác định rõ ràng điểm đến trước khi bắt đầu hành trình với AI.",
    explanation:
      'Đây là bước đầu tiên và quan trọng nhất trong "Nghệ thuật Phân công". Việc xác định mục tiêu cụ thể giúp bạn định hướng rõ ràng cho quá trình làm việc với AI.',
    examples: [
      'Thay vì: "Viết về marketing" → Hãy: "Viết một bài blog 500 từ về chiến lược marketing số cho doanh nghiệp nhỏ"',
      'Thay vì: "Giúp tôi lập kế hoạch" → Hãy: "Lập kế hoạch 3 tháng để tăng 30% lượng khách hàng cho quán cà phê"',
    ],
    tags: ["mục tiêu", "lập kế hoạch", "định hướng"],
    icon: Target,
    color: "from-blue-400 to-purple-600",
  },
  {
    id: "rctc-framework",
    title: "Công thức R.C.T.C",
    category: "Mô tả",
    chapter: "Chương 3",
    status: "unlocked",
    definition:
      "Framework để tạo ra những prompt hiệu quả: Role (Vai trò), Context (Ngữ cảnh), Task (Nhiệm vụ), Criteria (Tiêu chí).",
    explanation:
      'R.C.T.C là công thức "vàng" để viết prompt hiệu quả. Mỗi thành phần có vai trò riêng trong việc hướng dẫn AI hiểu đúng ý định của bạn.',
    examples: [
      'Role: "Bạn là một chuyên gia marketing có 10 năm kinh nghiệm"',
      'Context: "Cho một công ty khởi nghiệp về công nghệ giáo dục"',
      'Task: "Viết một email marketing để giới thiệu sản phẩm mới"',
      'Criteria: "Tối đa 200 từ, tông giọng thân thiện, có call-to-action rõ ràng"',
    ],
    tags: ["prompt", "framework", "cấu trúc", "vai trò", "ngữ cảnh"],
    icon: Lightbulb,
    color: "from-green-400 to-blue-500",
  },
  {
    id: "biet-minh-biet-ta",
    title: "Biết mình, biết ta",
    category: "Phân công",
    chapter: "Chương 2",
    status: "unlocked",
    definition: "Hiểu rõ điểm mạnh của con người và AI để phân công hiệu quả.",
    explanation:
      "Năng lực Phân tích Kép giúp bạn tận dụng thế mạnh của cả con người và AI. Con người giỏi sáng tạo, ra quyết định, cảm xúc. AI giỏi xử lý dữ liệu, tạo nội dung, phân tích.",
    examples: [
      "Thế mạnh Con người: Đặt tầm nhìn chiến lược, quyết định cuối cùng, kiểm soát chất lượng",
      "Thế mạnh AI: Nghiên cứu dữ liệu, tạo nhiều phương án, phân tích thông tin",
      "Ví dụ phân công: Bạn đặt mục tiêu → AI nghiên cứu → Bạn lựa chọn → AI triển khai → Bạn kiểm tra",
    ],
    tags: ["phân tích", "thế mạnh", "phân công", "hợp tác"],
    icon: Brain,
    color: "from-purple-400 to-pink-500",
  },
  {
    id: "bo-cau-hoi-vang",
    title: "Bộ câu hỏi Vàng",
    category: "Nhận định",
    chapter: "Chương 4",
    status: "unlocked",
    definition: "Bộ công cụ đánh giá sản phẩm AI theo 5 tiêu chí cốt lõi.",
    explanation:
      "Năm câu hỏi then chốt để kiểm tra chất lượng mọi sản phẩm từ AI: Tính Chính xác, Tính Phù hợp, Tính Mạch lạc, Tính Đầy đủ, và Tính An toàn.",
    examples: [
      "1. Tính Chính xác: Thông tin có chính xác không?",
      "2. Tính Phù hợp: Nội dung có phù hợp với mục tiêu không?",
      "3. Tính Mạch lạc: Logic có rõ ràng, dễ hiểu không?",
      "4. Tính Đầy đủ: Có thiếu thông tin quan trọng không?",
      "5. Tính An toàn: Có rủi ro hay nội dung có hại không?",
    ],
    tags: ["đánh giá", "chất lượng", "phản biện", "tiêu chí"],
    icon: Search,
    color: "from-orange-400 to-red-500",
  },
  {
    id: "co-do-tu-duy-ai",
    title: "Cờ đỏ trong Tư duy AI",
    category: "Nhận định",
    chapter: "Chương 4",
    status: "unlocked",
    definition: "Các dấu hiệu cảnh báo về sự bất thường trong lập luận của AI.",
    explanation:
      "Học cách nhận diện khi AI mắc lỗi logic, mâu thuẫn, hoặc đưa ra thông tin thiếu cơ sở.",
    examples: [
      "Mâu thuẫn logic trong cùng một câu trả lời",
      'Thông tin quá tuyệt đối ("luôn luôn", "không bao giờ")',
      "Thiếu nguồn gốc cho các số liệu cụ thể",
      "Lập luận vòng vo, không có bằng chứng",
      "Kết luận vội vàng từ dữ liệu hạn chế",
    ],
    tags: ["cảnh báo", "lỗi logic", "mâu thuẫn", "kiểm tra"],
    icon: Shield,
    color: "from-red-400 to-pink-500",
  },
  {
    id: "cong-thuc-phan-hoi",
    title: "Công thức Phản hồi",
    category: "Nhận định",
    chapter: "Chương 4",
    status: "unlocked",
    definition: "Quy trình 4 bước để đưa ra phản hồi xây dựng cho AI.",
    explanation:
      "Cách tiếp cận có hệ thống để cải thiện chất lượng sản phẩm từ AI thông qua phản hồi hiệu quả.",
    examples: [
      "1. Xác định Vấn đề: Chỉ ra cụ thể điều gì sai",
      "2. Giải thích Lý do: Tại sao điều đó là vấn đề",
      "3. Đưa ra Gợi ý: Hướng dẫn cách sửa",
      "4. Yêu cầu Cập nhật: Đặt ra quy tắc cho lần sau",
    ],
    tags: ["phản hồi", "cải thiện", "hệ thống", "tinh chỉnh"],
    icon: Target,
    color: "from-green-400 to-teal-500",
  },
  {
    id: "che-cui",
    title: 'Kỹ năng "Chẻ củi"',
    category: "Phân công",
    chapter: "Chương 2",
    status: "unlocked",
    definition: "Chia một vấn đề lớn, phức tạp thành các nhiệm vụ nhỏ, cụ thể.",
    explanation:
      "Thay vì giao cho AI một nhiệm vụ khổng lồ, hãy chia nhỏ thành các bước có thể quản lý được. Điều này giúp AI hiểu rõ hơn và cho kết quả chất lượng cao hơn.",
    examples: [
      'Thay vì: "Viết cho tôi một cuốn tiểu thuyết"',
      'Hãy chia: "Tạo outline → Phát triển nhân vật → Viết chương 1 → Xem xét và chỉnh sửa"',
      'Ví dụ khác: "Lập kế hoạch kinh doanh" → "Phân tích thị trường → Xác định đối tượng → Chiến lược marketing → Dự báo tài chính"',
    ],
    tags: ["chia nhỏ", "quản lý", "từng bước", "hiệu quả"],
    icon: Sparkles,
    color: "from-teal-400 to-green-500",
  },
];

const categories = [
  "Tất cả",
  "Nền tảng",
  "Phân công",
  "Mô tả",
  "Nhận định",
  "Trách nhiệm",
];
const chapters = [
  "Tất cả",
  "Chương 1",
  "Chương 2",
  "Chương 3",
  "Chương 4",
  "Chương 5",
  "Chương 6",
];

export default function KnowledgeVaultPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedChapter, setSelectedChapter] = useState("Tất cả");

  const filteredConcepts = useMemo(() => {
    return knowledgeConcepts.filter((concept) => {
      if (concept.status === "locked") return false;

      const matchesSearch =
        concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concept.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concept.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "Tất cả" || concept.category === selectedCategory;
      const matchesChapter =
        selectedChapter === "Tất cả" || concept.chapter === selectedChapter;

      return matchesSearch && matchesCategory && matchesChapter;
    });
  }, [searchQuery, selectedCategory, selectedChapter]);

  const unlockedCount = knowledgeConcepts.filter(
    (c) => c.status === "unlocked"
  ).length;
  const totalCount = knowledgeConcepts.length;

  return (
    <div className="bg-background text-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link href="/skill-hub">
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại Trung tâm
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  Kho Báu Tri thức
                </h1>
                <p className="text-lg text-muted-foreground">
                  Thư viện kiến thức cá nhân từ hành trình học tập của bạn
                </p>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{unlockedCount} khái niệm đã mở khóa</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Tổng cộng {totalCount} khái niệm</span>
              </div>
            </div>
          </div>
          <Image
            src="/images/alva-book.png"
            alt="Knowledge Vault Illustration"
            width={150}
            height={150}
            className="hidden md:block"
          />
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="w-5 h-5" />
              Tìm kiếm & Bộ lọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder='Tìm kiếm khái niệm, từ khóa... (VD: "Framework 4D+S", "Năng lực AI")'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-48 bg-background">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Chapter Filter */}
              <Select
                value={selectedChapter}
                onValueChange={setSelectedChapter}
              >
                <SelectTrigger className="w-full md:w-48 bg-background">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Chương" />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter} value={chapter}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Hiển thị {filteredConcepts.length} khái niệm
            {searchQuery && ` cho "${searchQuery}"`}
            {selectedCategory !== "Tất cả" &&
              ` trong danh mục "${selectedCategory}"`}
            {selectedChapter !== "Tất cả" && ` từ "${selectedChapter}"`}
          </p>
        </div>

        {/* Knowledge Cards Grid */}
        <div className="space-y-6">
          {filteredConcepts.length === 0 ? (
            <Card className="bg-card text-card-foreground border-border">
              <CardContent className="py-12 text-center pr-6">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Không tìm thấy khái niệm nào
                </h3>
                <p className="text-muted-foreground mb-4">
                  Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Tất cả");
                    setSelectedChapter("Tất cả");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {filteredConcepts.map((concept) => {
                const IconComponent = concept.icon;

                return (
                  <AccordionItem
                    key={concept.id}
                    value={concept.id}
                    className="border-0"
                  >
                    <Card className="bg-card text-card-foreground border-border hover:shadow-lg transition-all duration-300">
                      <AccordionTrigger className="hover:no-underline pr-8">
                        <CardHeader className="w-full">
                          <div className="flex items-start gap-4 flex-1 text-left">
                            <div
                              className={`p-3 rounded-lg bg-gradient-to-br ${concept.color} text-white flex-shrink-0`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg font-semibold">
                                  {concept.title}
                                </CardTitle>
                                <Badge variant="outline" className="text-xs">
                                  {concept.chapter}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {concept.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {concept.definition}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                      </AccordionTrigger>

                      <AccordionContent>
                        <CardContent className="pt-0 space-y-6">
                          {/* Detailed Explanation */}
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                              Giải thích chi tiết
                            </h4>
                            <p className="text-foreground leading-relaxed">
                              {concept.explanation}
                            </p>
                          </div>

                          {/* Examples */}
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                              Ví dụ minh họa
                            </h4>
                            <div className="space-y-3">
                              {concept.examples.map((example, index) => (
                                <div
                                  key={index}
                                  className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary/50"
                                >
                                  <p className="text-sm text-foreground">
                                    {example}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tags */}
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                              Từ khóa liên quan
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {concept.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs cursor-pointer hover:bg-primary/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery(tag);
                                  }}
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>

        {/* Bottom CTA */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="py-8 text-center">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Mở khóa thêm nhiều khái niệm
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Tiếp tục hành trình học tập để mở khóa thêm nhiều khái niệm quan
              trọng khác. Mỗi chặng hoàn thành sẽ bổ sung thêm kiến thức vào kho
              báu của bạn.
            </p>
            <Button asChild size="lg" className="gap-2">
              <Link href="/skill-hub">
                <ArrowLeft className="w-4 h-4" />
                Tiếp tục Hành trình
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
