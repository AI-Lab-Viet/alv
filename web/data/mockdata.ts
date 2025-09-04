import { DetailedProject } from "@/interfaces/project.interface";

export const projectData: DetailedProject[] = [
  {
    id: "c3356ab6-ecaf-4c14-b295-9140dd01bdc2",
    title: "Lập kế hoạch du lịch Việt Nam",
    description:
      "Tạo lịch trình chi tiết cho chuyến du lịch 3 ngày 2 đêm tại Đà Nẵng",
    category: "Đời sống",
    difficulty: "Cơ bản",
    duration: "45 phút",
    context: `Bạn là một sinh viên đại học tại Hà Nội và có kế hoạch đi du lịch Đà Nẵng cùng 3 người bạn trong dịp nghỉ lễ. 
    Nhóm bạn có ngân sách khoảng 8 triệu đồng cho cả chuyến đi và muốn trải nghiệm cả văn hóa, ẩm thực và thiên nhiên.`,
    objectives: [
      "Lập lịch trình chi tiết cho 3 ngày 2 đêm",
      "Tìm kiếm và đề xuất địa điểm tham quan phù hợp",
      "Lên kế hoạch ăn uống và lưu trú trong ngân sách",
      "Tính toán chi phí tổng thể và phân bổ hợp lý",
    ],
    deliverables: [
      "Lịch trình từng ngày với thời gian cụ thể",
      "Danh sách địa điểm tham quan và hoạt động",
      "Bảng tính chi phí chi tiết",
      "Gợi ý về phương tiện di chuyển",
    ],
    tips: [
      "Sử dụng kỹ thuật nhập vai: 'Hãy đóng vai một hướng dẫn viên du lịch chuyên nghiệp'",
      "Yêu cầu AI phân tích từng khía cạnh: thời tiết, giao thông, giá cả",
      "Đặt câu hỏi cụ thể về từng địa điểm để có thông tin chi tiết",
    ],
    participants: 1247,
    rating: 4.8,
    skills: ["Đặt câu hỏi", "Lập kế hoạch", "Nghiên cứu"],
    thumbnail: "/project-travel-planning.png",
  },
  {
    id: "13ad043d-42fc-4b1e-91db-dd679e562a68",
    title: "Viết bài luận về AI trong giáo dục",
    description:
      "Nghiên cứu và viết bài luận 1000 từ về tác động của AI trong giáo dục Việt Nam",
    category: "Học thuật",
    difficulty: "Trung bình",
    duration: "90 phút",
    context: `Bạn là sinh viên ngành Sư phạm và được giao nhiệm vụ viết bài luận về tác động của trí tuệ nhân tạo 
    trong hệ thống giáo dục Việt Nam. Bài luận cần có tính học thuật và dựa trên các nguồn tài liệu đáng tin cậy.`,
    objectives: [
      "Nghiên cứu tình hình ứng dụng AI trong giáo dục Việt Nam",
      "Phân tích ưu điểm và thách thức của AI trong giáo dục",
      "Đưa ra quan điểm cá nhân có căn cứ",
      "Viết bài luận 1000 từ với cấu trúc rõ ràng",
    ],
    deliverables: [
      "Bài luận hoàn chỉnh 1000 từ",
      "Danh sách tài liệu tham khảo",
      "Outline chi tiết của bài luận",
      "Tóm tắt các điểm chính",
    ],
    tips: [
      "Yêu cầu AI đóng vai nhà nghiên cứu giáo dục để có góc nhìn chuyên sâu",
      "Kiểm chứng thông tin bằng cách hỏi về nguồn gốc và độ tin cậy",
      "Sử dụng chuỗi suy nghĩ để phân tích từng khía cạnh một cách logic",
    ],
    participants: 892,
    rating: 4.7,
    skills: ["Tư duy phản biện", "Nghiên cứu"],
    thumbnail: "/images/project-essay-writing.webp",
  },
];
