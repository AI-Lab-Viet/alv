"use client";

import { Button } from "@/components/ui/button";
import {
  Share2,
  ExternalLink,
  Target,
  Zap,
  Trophy,
  Brain,
  BrainIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/nav-bar";
import { useState, useEffect } from "react";
import { getPortfolioPage } from "@/services/portfolio.service";
import { PortfolioProject } from "@/interfaces/project.interface";

// Extended interface to handle both API and mock data
interface DisplayProject extends PortfolioProject {
  title?: string;
  description?: string;
  finalProduct?: string;
  keyPrompts?: string[];
  skills?: string[];
}

// Mock user data - in real app this would come from database
const userData = {
  id: "le-minh-quy",
  name: "Lê Minh Qúy",
  initials: "LMQ",
  bio: "Học sinh tiên phong trong kỷ nguyên AI, sẵn sàng kiến tạo tương lai.",
  platformSlogan:
    'Xây dựng trên nền tảng "Đồng hành cùng AI - Dẫn lối sáng tạo Việt"',
};

// Mock project data for fallback - will be replaced by API data
const mockCompletedProjects = [
  {
    id: "marketing-campaign-001",
    title: "Chiến dịch truyền thông cho CLB Sách",
    description:
      "Nhiệm vụ: Xây dựng một chiến dịch truyền thông toàn diện để thu hút học sinh tham gia Câu lạc bộ Sách của trường, bao gồm slogan, poster và kế hoạch hoạt động cụ thể.",
    final_product: `**Slogan:** "Mở Sách - Mở Tâm Hồn, Đọc Sách - Đọc Tương Lai"

**Kế hoạch 3 tháng:** Tuần 1-2: Ra mắt slogan và poster tại các điểm nóng. Tuần 3-4: Tổ chức "Ngày hội sách mini" với các hoạt động tương tác. Tháng 2-3: Chương trình "Đại sứ sách" - học sinh chia sẻ sách yêu thích, xây dựng thư viện trao đổi sách.`,
    key_prompts: [
      "Hãy tạo ra một slogan cho câu lạc bộ sách của trường THPT, yêu cầu: 1) Dễ nhớ, có vần điệu 2) Thể hiện tác dụng của việc đọc sách với tương lai 3) Phù hợp với lứa tuổi 16-18. Đưa ra 3 phương án và giải thích tại sao chọn.",
      "Với slogan đã chọn, hãy xây dựng kế hoạch truyền thông 3 tháng. Chia thành các giai đoạn cụ thể, mỗi giai đoạn có mục tiêu rõ ràng và hoạt động khả thi với ngân sách hạn chế của học sinh.",
    ],
    skills_applied: [
      "#TưDuyPhảnBiện",
      "#KỹThuậtPrompt",
      "#SángTạoNộiDung",
      "#LậpKếHoạch",
      "#TruyềnThông",
    ],
  },
  {
    id: "literature-analysis-001",
    title: "Phân tích nhân vật Lão Hạc",
    description:
      "Nhiệm vụ: Viết một bài luận phân tích tâm lý nhân vật Lão Hạc trong truyện ngắn cùng tên của Nam Cao, tập trung vào mâu thuẫn nội tâm và ý nghĩa hiện đại của tác phẩm.",
    final_product: `Lão Hạc không chỉ là một người cha nghèo khổ, mà là biểu tượng của những con người bị xã hội bỏ quên. Mâu thuẫn giữa tình yêu thương con và nỗi tuyệt vọng về nghèo đói đã tạo nên bi kịch sâu sắc. Qua việc bán con chó Vàng - người bạn duy nhất - Lão Hạc thể hiện sự hy sinh cao cả nhưng cũng là tiếng kêu thầm lặng trước thực tại tàn khốc...`,
    key_prompts: [
      "Hãy giúp em phân tích các lớp nghĩa trong hành động Lão Hạc bán con chó Vàng. Xem xét từ góc độ: 1) Tâm lý học 2) Xã hội học 3) Triết học về phẩm giá con người. Đưa ra những câu hỏi sâu sắc để em tự suy ngẫm.",
      "Với những phân tích trên, hãy đề xuất dàn bài cho một bài luận 1000 từ. Mỗi phần cần có ít nhất 2 ví dụ cụ thể từ văn bản gốc. Hướng dẫn cách viết mở bài ấn tượng và kết luận có tính thời sự.",
    ],
    skills_applied: [
      "#PhânTíchVănBản",
      "#TưDuyPhảnBiện",
      "#ViếtLuận",
      "#KỹThuậtPrompt",
      "#NghiênCứuSâu",
    ],
  },
  {
    id: "mid-autumn-festival-001",
    title: "Lập kế hoạch cho chiến dịch Tết Trung thu của lớp",
    description:
      "Nhiệm vụ: Tổ chức một chương trình Tết Trung thu ý nghĩa cho lớp học, bao gồm các hoạt động truyền thống, hiện đại và kế hoạch thực hiện chi tiết phù hợp với ngân sách học sinh.",
    final_product: `**"Trung Thu Ấm Áp - Lớp Mình Gắn Kết"**

Kế hoạch 3 tuần: Tuần 1 - Làm đèn lồng tái chế và bánh trung thu mini. Tuần 2 - Thi "Hát về trăng" và kể chuyện cổ tích. Tuần 3 - Đêm hội trung thu với trò chơi dân gian: bịt mắt bắt dê, ô ăn quan, đập niêu. Điểm nhấn: "Góc ước nguyện trăng sao" - mỗi bạn viết ước nguyện gửi lên trăng, và "Bánh trung thu yêu thương" tặng các em nhỏ vùng khó khăn.`,
    key_prompts: [
      "Nghiên cứu ý nghĩa và các hoạt động truyền thống của Tết Trung thu Việt Nam. Phân tích: 1) Nguồn gốc lịch sử 2) Các trò chơi dân gian phù hợp lứa tuổi THPT 3) Cách kết hợp truyền thống với hiện đại 4) Hoạt động có ý nghĩa xã hội. Đề xuất 10 ý tưởng sáng tạo.",
      "Lập timeline chi tiết cho sự kiện Trung thu lớp học 40 người, ngân sách 500k. Bao gồm: phân công nhiệm vụ, danh sách vật dụng, dự phòng rủi ro, cách đánh giá hiệu quả. Ưu tiên tính khả thi và sự tham gia của tất cả học sinh.",
    ],
    skills_applied: [
      "#TổChứcSựKiện",
      "#VănHóaTruyềnThống",
      "#LậpKếHoạch",
      "#KỹThuậtPrompt",
      "#LãnhĐạoNhóm",
      "#SángTạoNộiDung",
    ],
  },
  {
    id: "tran-hung-dao-research-001",
    title: "Nghiên cứu về anh hùng Trần Hưng Đạo và soạn bài thuyết trình",
    description:
      "Nhiệm vụ: Sử dụng AI để thu thập và phân tích thông tin về Đại tướng Trần Hưng Đạo, sau đó tạo ra một bài thuyết trình 10 phút với góc nhìn mới, phù hợp để trình bày trước lớp.",
    final_product: `**Bài thuyết trình: "Trần Hưng Đạo - Thiên tài quân sự hay nhà lãnh đạo tâm lý học?"**

Góc nhìn độc đáo: Phân tích 3 kỹ năng leadership của Trần Hưng Đạo qua lăng kính tâm lý học hiện đại: 1) Emotional Intelligence - cách ông động viên tinh thần quân dân, 2) Strategic Thinking - phân tích sâu chiến thuật "vờn địch", 3) Change Management - cách ông thay đổi tư duy từ phòng thủ sang tấn công. Kết thúc bằng 5 bài học leadership áp dụng cho học sinh thế kỷ 21.`,
    key_prompts: [
      "Phân tích Trần Hưng Đạo không chỉ như một anh hùng dân tộc mà còn là một nhà lãnh đạo. So sánh phong cách lãnh đạo của ông với các lý thuyết leadership hiện đại: transformational leadership, servant leadership, situational leadership. Đưa ra ví dụ cụ thể từ sử sách.",
      "Thiết kế structure cho bài thuyết trình 10 phút về Trần Hưng Đạo dành cho học sinh THPT. Yêu cầu: 1) Hook mở đầu bắt mắt 2) 3 điểm chính với câu chuyện minh họa 3) Kết nối với hiện tại 4) Call-to-action cho thế hệ trẻ. Gợi ý visual aids và interactive elements.",
    ],
    skills_applied: [
      "#NghiênCứuLịchSử",
      "#KỹNăngThuyếtTrình",
      "#TưDuyPhảnBiện",
      "#KỹThuậtPrompt",
      "#Storytelling",
      "#KếtNốiQuáKhứ-HiệnTại",
    ],
  },
];

export default function ProfilePage() {
  const [portfolioProjects, setPortfolioProjects] = useState<DisplayProject[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const portfolioData = await getPortfolioPage();
        console.log("portfolioData:", portfolioData);
        setPortfolioProjects(portfolioData.projects);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
        setError("Failed to load portfolio data");
        // Fallback to mock data if API fails
        setPortfolioProjects(mockCompletedProjects as DisplayProject[]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Combine API data with mock data structure for display
  const displayProjects: DisplayProject[] =
    portfolioProjects.length > 0
      ? portfolioProjects
      : (mockCompletedProjects as DisplayProject[]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error && portfolioProjects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Showing mock data as fallback</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {userData.initials}
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {userData.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              {userData.bio}
            </p>
            <p className="text-sm text-blue-600 font-medium opacity-80">
              {userData.platformSlogan}
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
              Chia sẻ hồ sơ
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500">
              <ExternalLink className="w-4 h-4" />
              Xem công khai
            </Button>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 relative">
            Dự Án Nổi Bật
            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
          </h2>

          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            {displayProjects.map((project, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {project.mission_name || `Project ${project.id}`}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {project.mission_description ||
                    "Project description not available"}
                </p>

                <div className="mb-8">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                    <Target className="w-5 h-5" />
                    Phần 1: Sản phẩm cuối cùng
                  </div>
                  <blockquote className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg italic text-gray-800 leading-relaxed relative">
                    <div className="absolute top-[-10px] left-4 text-3xl text-blue-500 opacity-30 font-serif">
                      "
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          project.final_product ||
                          project.finalProduct ||
                          "No final product available",
                      }}
                    />
                  </blockquote>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-2 text-lg font-semibold text-red-600 mb-4">
                    <Zap className="w-5 h-5" />
                    Phần 2: Những câu lệnh nổi bật
                  </div>
                  <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm leading-relaxed">
                    <div className="flex items-center gap-2 mb-4 text-gray-400 text-xs">
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span>AI Terminal</span>
                    </div>

                    {(project.key_prompts || project.keyPrompts || []).map(
                      (prompt, idx) => (
                        <div key={idx} className="mb-4">
                          <div className="text-cyan-400 mb-2">
                            user@creativity:~$ prompt_optimize
                          </div>
                          <div className="text-black bg-white bg-opacity-5 p-3 rounded border-l-2 border-cyan-400 ml-4">
                            {prompt}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2">
                    <BrainIcon className="w-5 h-5" />
                    Phần 3: Bài học tự rút ra
                  </div>
                  <div className="flex flex-wrap gap-3 text-ellipsis mb-2">
                    <p>
                      "{project.reflection ? project.reflection : "Không có"}"
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4">
                    <Trophy className="w-5 h-5" />
                    Phần 4: Kỹ năng đã áp dụng
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(project.skills_applied || project.skills || []).map(
                      (skill) => (
                        <span
                          key={skill}
                          className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:from-blue-200 hover:to-cyan-200 hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
