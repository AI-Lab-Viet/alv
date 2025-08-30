'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
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
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

const knowledgeConcepts = [
  {
    id: 'tu-duy-muc-tieu',
    title: 'Tư duy Mục tiêu',
    category: 'Phân công',
    chapter: 'Chương 2',
    status: 'unlocked',
    definition: 'Khả năng xác định rõ ràng điểm đến trước khi bắt đầu hành trình với AI.',
    explanation:
      'Đây là bước đầu tiên và quan trọng nhất trong "Nghệ thuật Phân công". Việc xác định mục tiêu cụ thể giúp bạn định hướng rõ ràng cho quá trình làm việc với AI.',
    examples: [
      'Thay vì: "Viết về marketing" → Hãy: "Viết một bài blog 500 từ về chiến lược marketing số cho doanh nghiệp nhỏ"',
      'Thay vì: "Giúp tôi lập kế hoạch" → Hãy: "Lập kế hoạch 3 tháng để tăng 30% lượng khách hàng cho quán cà phê"'
    ],
    tags: ['mục tiêu', 'lập kế hoạch', 'định hướng'],
    icon: Target,
    color: 'from-blue-400 to-purple-600'
  },
  {
    id: 'rctc-framework',
    title: 'Công thức R.C.T.C',
    category: 'Mô tả',
    chapter: 'Chương 3',
    status: 'unlocked',
    definition:
      'Framework để tạo ra những prompt hiệu quả: Role (Vai trò), Context (Ngữ cảnh), Task (Nhiệm vụ), Criteria (Tiêu chí).',
    explanation:
      'R.C.T.C là công thức "vàng" để viết prompt hiệu quả. Mỗi thành phần có vai trò riêng trong việc hướng dẫn AI hiểu đúng ý định của bạn.',
    examples: [
      'Role: "Bạn là một chuyên gia marketing có 10 năm kinh nghiệm"',
      'Context: "Cho một công ty khởi nghiệp về công nghệ giáo dục"',
      'Task: "Viết một email marketing để giới thiệu sản phẩm mới"',
      'Criteria: "Tối đa 200 từ, tông giọng thân thiện, có call-to-action rõ ràng"'
    ],
    tags: ['prompt', 'framework', 'cấu trúc', 'vai trò', 'ngữ cảnh'],
    icon: Lightbulb,
    color: 'from-green-400 to-blue-500'
  },
  {
    id: 'biet-minh-biet-ta',
    title: 'Biết mình, biết ta',
    category: 'Phân công',
    chapter: 'Chương 2',
    status: 'unlocked',
    definition: 'Hiểu rõ điểm mạnh của con người và AI để phân công hiệu quả.',
    explanation:
      'Năng lực Phân tích Kép giúp bạn tận dụng thế mạnh của cả con người và AI. Con người giỏi sáng tạo, ra quyết định, cảm xúc. AI giỏi xử lý dữ liệu, tạo nội dung, phân tích.',
    examples: [
      'Thế mạnh Con người: Đặt tầm nhìn chiến lược, quyết định cuối cùng, kiểm soát chất lượng',
      'Thế mạnh AI: Nghiên cứu dữ liệu, tạo nhiều phương án, phân tích thông tin',
      'Ví dụ phân công: Bạn đặt mục tiêu → AI nghiên cứu → Bạn lựa chọn → AI triển khai → Bạn kiểm tra'
    ],
    tags: ['phân tích', 'thế mạnh', 'phân công', 'hợp tác'],
    icon: Brain,
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'hallucination',
    title: 'AI Hallucination (Ảo giác)',
    category: 'Nhận định',
    chapter: 'Chương 4',
    status: 'locked',
    definition: 'Hiện tượng AI tạo ra thông tin không chính xác nhưng trình bày một cách tự tin.',
    explanation:
      'AI có thể tạo ra các trích dẫn sách không tồn tại, thống kê giả mạo, hoặc sự kiện lịch sử không chính xác. Đây là hạn chế tự nhiên của công nghệ AI hiện tại.',
    examples: [
      'AI có thể tạo ra tên sách và tác giả không tồn tại',
      'Đưa ra số liệu thống kê không có nguồn gốc thực tế',
      'Mô tả chi tiết những sự kiện lịch sử chưa từng xảy ra'
    ],
    tags: ['ảo giác', 'thông tin sai', 'kiểm chứng', 'phản biện'],
    icon: Shield,
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'che-cui',
    title: 'Kỹ năng "Chẻ củi"',
    category: 'Phân công',
    chapter: 'Chương 2',
    status: 'unlocked',
    definition: 'Chia một vấn đề lớn, phức tạp thành các nhiệm vụ nhỏ, cụ thể.',
    explanation:
      'Thay vì giao cho AI một nhiệm vụ khổng lồ, hãy chia nhỏ thành các bước có thể quản lý được. Điều này giúp AI hiểu rõ hơn và cho kết quả chất lượng cao hơn.',
    examples: [
      'Thay vì: "Viết cho tôi một cuốn tiểu thuyết"',
      'Hãy chia: "Tạo outline → Phát triển nhân vật → Viết chương 1 → Xem xét và chỉnh sửa"',
      'Ví dụ khác: "Lập kế hoạch kinh doanh" → "Phân tích thị trường → Xác định đối tượng → Chiến lược marketing → Dự báo tài chính"'
    ],
    tags: ['chia nhỏ', 'quản lý', 'từng bước', 'hiệu quả'],
    icon: Sparkles,
    color: 'from-teal-400 to-green-500'
  }
];

const categories = ['Tất cả', 'Phân công', 'Mô tả', 'Nhận định', 'Trách nhiệm'];
const chapters = ['Tất cả', 'Chương 1', 'Chương 2', 'Chương 3', 'Chương 4', 'Chương 5', 'Chương 6'];

export default function KnowledgeVaultPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedChapter, setSelectedChapter] = useState('Tất cả');

  const filteredConcepts = useMemo(() => {
    return knowledgeConcepts.filter((concept) => {
      if (concept.status === 'locked') return false;

      const matchesSearch =
        concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concept.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concept.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'Tất cả' || concept.category === selectedCategory;
      const matchesChapter = selectedChapter === 'Tất cả' || concept.chapter === selectedChapter;

      return matchesSearch && matchesCategory && matchesChapter;
    });
  }, [searchQuery, selectedCategory, selectedChapter]);

  const unlockedCount = knowledgeConcepts.filter((c) => c.status === 'unlocked').length;
  const totalCount = knowledgeConcepts.length;

  return (
    <div className='bg-background text-foreground transition-colors'>
      <div className='max-w-7xl mx-auto px-4 py-4 lg:px-8'>
        <div className='mb-8'>
          <div className='flex items-center gap-4 mb-4'>
            <Button variant='ghost' size='sm' asChild className='gap-2'>
              <Link href='/skill-hub'>
                <ArrowLeft className='w-4 h-4' />
                Quay lại Trung tâm
              </Link>
            </Button>
          </div>

          <div className='flex items-center gap-3 mb-4'>
            <div className='w-12 h-12 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl flex items-center justify-center'>
              <BookOpen className='w-6 h-6 text-secondary' />
            </div>
            <div>
              <h1 className='text-4xl font-bold text-foreground'>Kho Báu Tri thức</h1>
              <p className='text-lg text-muted-foreground'>
                Thư viện kiến thức cá nhân từ hành trình học tập của bạn
              </p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className='flex items-center gap-6 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='w-4 h-4 text-green-500' />
              <span>{unlockedCount} khái niệm đã mở khóa</span>
            </div>
            <div className='flex items-center gap-2'>
              <BookOpen className='w-4 h-4' />
              <span>Tổng cộng {totalCount} khái niệm</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className='mb-8 bg-card text-card-foreground border-border'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Search className='w-5 h-5' />
              Tìm kiếm & Bộ lọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col md:flex-row gap-4'>
              {/* Search Bar */}
              <div className='flex-1'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                  <Input
                    placeholder='Tìm kiếm khái niệm, từ khóa... (VD: "R.C.T.C", "Tư duy Mục tiêu")'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10 bg-background'
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className='w-full md:w-48 bg-background'>
                  <Filter className='w-4 h-4 mr-2' />
                  <SelectValue placeholder='Danh mục' />
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
              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger className='w-full md:w-48 bg-background'>
                  <BookOpen className='w-4 h-4 mr-2' />
                  <SelectValue placeholder='Chương' />
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
        <div className='mb-6'>
          <p className='text-sm text-muted-foreground'>
            Hiển thị {filteredConcepts.length} khái niệm
            {searchQuery && ` cho "${searchQuery}"`}
            {selectedCategory !== 'Tất cả' && ` trong danh mục "${selectedCategory}"`}
            {selectedChapter !== 'Tất cả' && ` từ "${selectedChapter}"`}
          </p>
        </div>

        {/* Knowledge Cards Grid */}
        <div className='space-y-6'>
          {filteredConcepts.length === 0 ? (
            <Card className='bg-card text-card-foreground border-border'>
              <CardContent className='py-12 text-center pr-6'>
                <BookOpen className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>Không tìm thấy khái niệm nào</h3>
                <p className='text-muted-foreground mb-4'>
                  Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc
                </p>
                <Button
                  variant='outline'
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Tất cả');
                    setSelectedChapter('Tất cả');
                  }}>
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Accordion type='multiple' className='space-y-4'>
              {filteredConcepts.map((concept) => {
                const IconComponent = concept.icon;

                return (
                  <AccordionItem key={concept.id} value={concept.id} className='border-0'>
                    <Card className='bg-card text-card-foreground border-border hover:shadow-lg transition-all duration-300'>
                      <AccordionTrigger className='hover:no-underline pr-8'>
                        <CardHeader className='w-full'>
                          <div className='flex items-start gap-4 flex-1 text-left'>
                            <div
                              className={`p-3 rounded-lg bg-gradient-to-br ${concept.color} text-white flex-shrink-0`}>
                              <IconComponent className='w-5 h-5' />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <div className='flex items-center gap-2 mb-2'>
                                <CardTitle className='text-lg font-semibold'>
                                  {concept.title}
                                </CardTitle>
                                <Badge variant='outline' className='text-xs'>
                                  {concept.chapter}
                                </Badge>
                                <Badge variant='secondary' className='text-xs'>
                                  {concept.category}
                                </Badge>
                              </div>
                              <p className='text-sm text-muted-foreground leading-relaxed'>
                                {concept.definition}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                      </AccordionTrigger>

                      <AccordionContent>
                        <CardContent className='pt-0 space-y-6'>
                          {/* Detailed Explanation */}
                          <div>
                            <h4 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2'>
                              Giải thích chi tiết
                            </h4>
                            <p className='text-foreground leading-relaxed'>{concept.explanation}</p>
                          </div>

                          {/* Examples */}
                          <div>
                            <h4 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3'>
                              Ví dụ minh họa
                            </h4>
                            <div className='space-y-3'>
                              {concept.examples.map((example, index) => (
                                <div
                                  key={index}
                                  className='p-4 bg-muted/50 rounded-lg border-l-4 border-primary/50'>
                                  <p className='text-sm text-foreground'>{example}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tags */}
                          <div>
                            <h4 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2'>
                              Từ khóa liên quan
                            </h4>
                            <div className='flex flex-wrap gap-2'>
                              {concept.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant='outline'
                                  className='text-xs cursor-pointer hover:bg-primary/10'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery(tag);
                                  }}>
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
        <Card className='mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20'>
          <CardContent className='py-8 text-center'>
            <BookOpen className='w-12 h-12 text-primary mx-auto mb-4' />
            <h3 className='text-xl font-semibold mb-2'>Mở khóa thêm nhiều khái niệm</h3>
            <p className='text-muted-foreground mb-6 max-w-2xl mx-auto'>
              Tiếp tục hành trình học tập để mở khóa thêm nhiều khái niệm quan trọng khác. Mỗi chặng
              hoàn thành sẽ bổ sung thêm kiến thức vào kho báu của bạn.
            </p>
            <Button asChild size='lg' className='gap-2'>
              <Link href='/skill-hub'>
                <ArrowLeft className='w-4 h-4' />
                Tiếp tục Hành trình
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
