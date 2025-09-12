from supabase import create_client
import os
from dotenv import load_dotenv
from datetime import datetime
import sys

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase = create_client(supabase_url, supabase_key)

# Tùy chọn chế độ hoạt động
OPERATION_MODE = "auto"  # "auto", "update_only", "insert_only"

def get_operation_mode():
    """Lấy chế độ hoạt động từ command line hoặc mặc định"""
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()
        if mode in ["auto", "update", "insert"]:
            return mode
    return OPERATION_MODE

# Dữ liệu 6 missions đầu tiên - tiếng Việt thuần với thuật ngữ tiếng Anh
missions = [
    { 
        "id": "01",
        "title": "Phân tích Tác động của AI đến Giáo dục Đại học",
        "description": "Thực hiện một bài nghiên cứu nhỏ, phân tích những cơ hội và thách thức mà Trí tuệ Nhân tạo mang lại cho môi trường giáo dục đại học tại Việt Nam trong 5 năm tới.",
        "category": "Nghiên cứu & Học thuật",
        "difficulty": "Intermediate",
        "estimated_hours": "25-30 giờ",
        "context": "Giảng viên của bạn yêu cầu một bài tiểu luận cuối kỳ về một chủ đề công nghệ có tác động xã hội. Bạn muốn chọn một chủ đề vừa thời sự, vừa có chiều sâu để đạt điểm cao.",
        "learning_objectives": [
            "Rèn luyện kỹ năng nghiên cứu và tổng hợp thông tin.",
            "Thực hành tư duy phản biện để đánh giá các nguồn tin.",
            "Học cách cấu trúc một bài luận học thuật mạch lạc.",
            "Áp dụng kỹ năng Tổng hợp để đưa ra góc nhìn riêng."
        ],
        "deliverables": [
            "Một dàn ý chi tiết cho bài tiểu luận.",
            "Bản nháp hoàn chỉnh của bài tiểu luận (khoảng 2000 từ).",
            "Danh mục tài liệu tham khảo đã được kiểm chứng."
        ],
        "tips": [
            "Bắt đầu bằng việc yêu cầu ALVA tạo một dàn ý đa chiều.",
            "Sử dụng 'Bộ câu hỏi Vàng' để kiểm chứng mọi số liệu và nhận định.",
            "Đừng quên thêm vào phần kết luận những suy ngẫm của riêng bạn."
        ],
        "prompt_starters": [
            {"title": "Lập dàn ý chi tiết", "prompt": "Hãy giúp tôi lập một dàn ý chi tiết cho bài tiểu luận về 'Tác động của AI đến Giáo dục Đại học', bao gồm 3 luận điểm chính."},
            {"title": "Tìm kiếm nguồn tài liệu", "prompt": "Hãy gợi ý cho tôi 5 nguồn tài liệu học thuật uy tín (bài báo, sách) về chủ đề tác động của AI đến giáo dục."},
            {"title": "Brainstorm góc nhìn phản biện", "prompt": "Ngoài những lợi ích, hãy brainstorm 3 thách thức hoặc góc nhìn phản biện lớn nhất khi áp dụng AI vào giáo dục đại học."}
        ],
        "participants": 42,
        "rating": 4.8,
        "domain_skills": ["Nghiên cứu", "Tư duy Phản biện", "Viết học thuật", "Phân tích"],
        "alv_skills": ["Discernment", "Diligence", "Synthesis"],
        "thumbnail": "/images/missions/academic-ai-impact.jpg",
        "featured": True
    },
    { 
        "id": "02",
        "title": "Tạo một bài thuyết trình so sánh hai tác phẩm văn học",
        "description": "Xây dựng một bài thuyết trình 10 phút, so sánh và đối chiếu hai nhân vật chính từ hai tác phẩm văn học Việt Nam khác nhau để làm nổi bật sự thay đổi trong tư tưởng xã hội.",
        "category": "Nghiên cứu & Học thuật",
        "difficulty": "Beginner",
        "estimated_hours": "15-20 giờ",
        "context": "Bạn cần chuẩn bị cho một bài thuyết trình nhóm trong môn Văn học. Bạn muốn có một cấu trúc logic và những luận điểm sắc bén để gây ấn tượng.",
        "learning_objectives": [
            "Học cách phân tích sâu nhân vật văn học.",
            "Rèn luyện kỹ năng lập dàn ý và cấu trúc bài nói.",
            "Thực hành kỹ năng Mô tả để khai thác thông tin từ AI."
        ],
        "deliverables": [
            "Dàn ý chi tiết cho bài thuyết trình.",
            "Nội dung (script) cho từng slide.",
            "Slide trình chiếu (định dạng text)."
        ],
        "tips": [
            "Yêu cầu ALVA đóng vai một nhà phê bình văn học để có những góc nhìn sâu sắc.",
            "Sử dụng kỹ năng 'chẻ củi' để chia bài nói thành các phần nhỏ."
        ],
        "prompt_starters": [
            {"title": "Xây dựng cấu trúc so sánh", "prompt": "Hãy gợi ý một cấu trúc (dàn ý) hiệu quả để so sánh hai nhân vật văn học trong một bài thuyết trình 10 phút."},
            {"title": "Tìm điểm tương đồng", "prompt": "Hãy đóng vai một nhà phê bình văn học, tìm ra 3 điểm tương đồng cốt lõi giữa nhân vật Chí Phèo và Thị Nở."},
            {"title": "Soạn thảo lời mở đầu", "prompt": "Hãy giúp tôi viết một đoạn mở đầu hấp dẫn cho bài thuyết trình so sánh hai tác phẩm văn học."}
        ],
        "participants": 78,
        "rating": 4.5,
        "domain_skills": ["Phân tích Văn học", "Thuyết trình", "Nghiên cứu"],
        "alv_skills": ["Delegation", "Description", "Discernment"],
        "thumbnail": "/images/missions/literature-comparison.jpg",
        "featured": False
    },
    { 
        "id": "03",
        "title": "Chiến dịch truyền thông cho CLB Sách",
        "description": "Xây dựng một kế hoạch truyền thông 3 tháng để thu hút thành viên mới cho Câu lạc bộ Sách của trường đại học. Dự án này sẽ giúp bạn hiểu sâu về marketing tích hợp và quản lý thương hiệu.",
        "category": "Nghệ thuật & Sáng tạo",
        "difficulty": "Intermediate",
        "estimated_hours": "35-40 giờ",
        "context": "Câu lạc bộ Sách đang gặp khó khăn trong việc thu hút thành viên mới. Cần một chiến lược truyền thông hiệu quả để tăng độ nhận biết và sức hấp dẫn của CLB.",
        "learning_objectives": [
            "Hiểu về chiến lược truyền thông tích hợp.",
            "Thực hành tư duy sáng tạo trong marketing.",
            "Phát triển kỹ năng lập kế hoạch chi tiết."
        ],
        "deliverables": [
            "Kế hoạch truyền thông chi tiết 3 tháng.",
            "Ba slogan sáng tạo cho chiến dịch.",
            "Nội dung mẫu cho 3 bài đăng mạng xã hội."
        ],
        "tips": [
            "Nghiên cứu các chiến dịch thành công của các CLB khác trước.",
            "Sử dụng ALVA để brainstorm các ý tưởng 'điên rồ' nhất có thể."
        ],
        "prompt_starters": [
            {"title": "Xác định đối tượng mục tiêu", "prompt": "Hãy giúp tôi phân tích và xác định các nhóm đối tượng mục tiêu chính cho một Câu lạc bộ Sách trong trường đại học."},
            {"title": "Brainstorm 3 ý tưởng slogan", "prompt": "Hãy brainstorm 3 slogan độc đáo và trẻ trung cho chiến dịch ra mắt CLB Sách."},
            {"title": "Lập dàn ý kế hoạch", "prompt": "Hãy tạo một dàn ý cơ bản cho một kế hoạch truyền thông 3 tháng, bao gồm các giai đoạn chính."}
        ],
        "participants": 28,
        "rating": 4.3,
        "domain_skills": ["Marketing", "Sáng tạo Nội dung", "Mạng xã hội"],
        "alv_skills": ["Delegation", "Description", "Synthesis"],
        "thumbnail": "/images/missions/book-club-campaign.jpg",
        "featured": True
    },
    { 
        "id": "04",
        "title": "Viết kịch bản cho một tập Podcast ngắn",
        "description": "Sáng tạo một kịch bản hoàn chỉnh cho một tập podcast dài 10 phút về chủ đề 'Sức khỏe tinh thần cho sinh viên', với cấu trúc mở đầu, thân bài và kết thúc rõ ràng.",
        "category": "Nghệ thuật & Sáng tạo",
        "difficulty": "Beginner",
        "estimated_hours": "10-15 giờ",
        "context": "Bạn muốn bắt đầu một kênh podcast của riêng mình nhưng chưa biết cách viết một kịch bản hấp dẫn và có cấu trúc.",
        "learning_objectives": [
            "Học cách xây dựng cấu trúc kể chuyện (Storytelling).",
            "Rèn luyện kỹ năng viết lời thoại tự nhiên.",
            "Áp dụng kỹ năng Tổng hợp để tạo ra một câu chuyện có hồn."
        ],
        "deliverables": [
            "Dàn ý chi tiết cho tập podcast.",
            "Kịch bản hoàn chỉnh với lời thoại và ghi chú âm thanh."
        ],
        "tips": [
            "Yêu cầu ALVA đóng vai nhiều nhân vật khác nhau để tạo ra các đoạn hội thoại thú vị.",
            "Đọc to kịch bản để kiểm tra độ trôi chảy."
        ],
        "prompt_starters": [
            {"title": "Tạo cấu trúc 3 hồi", "prompt": "Hãy giúp tôi xây dựng cấu trúc 3 hồi (mở đầu, thân bài, kết thúc) cho một tập podcast 10 phút về 'Sức khỏe tinh thần cho sinh viên'."},
            {"title": "Brainstorm các câu hỏi dẫn dắt", "prompt": "Hãy gợi ý 5 câu hỏi mở hoặc tình huống thú vị để thảo luận trong podcast về sức khỏe tinh thần."},
            {"title": "Viết đoạn giới thiệu", "prompt": "Hãy viết một đoạn giới thiệu (intro) hấp dẫn, khoảng 100 từ, cho tập podcast này."}
        ],
        "participants": 55,
        "rating": 4.9,
        "domain_skills": ["Viết kịch bản", "Sáng tạo Nội dung", "Kể chuyện"],
        "alv_skills": ["Description", "Synthesis"],
        "thumbnail": "/images/missions/podcast-script.jpg",
        "featured": False
    },
    { 
        "id": "05",
        "title": "Lập kế hoạch chi tiết cho chuyến du lịch 5 ngày",
        "description": "Tổ chức một chuyến du lịch 5 ngày 4 đêm đến một địa điểm bạn yêu thích. ALVA sẽ giúp bạn từ việc lên lịch trình, ước tính chi phí, đến việc tìm các hoạt động thú vị.",
        "category": "Tiện ích Đời sống",
        "difficulty": "Beginner",
        "estimated_hours": "5-10 giờ",
        "context": "Bạn và nhóm bạn đang lên kế hoạch cho kỳ nghỉ sắp tới nhưng bị rối trong việc sắp xếp lịch trình và dự trù ngân sách.",
        "learning_objectives": [
            "Thực hành kỹ năng lập kế hoạch và tổ chức.",
            "Học cách đưa ra các yêu cầu rõ ràng để thu thập thông tin.",
            "Rèn luyện kỹ năng ra quyết định dựa trên nhiều lựa chọn."
        ],
        "deliverables": [
            "Lịch trình chi tiết từng ngày.",
            "Bảng dự trù ngân sách cho chuyến đi.",
            "Danh sách các địa điểm ăn uống và vui chơi."
        ],
        "tips": [
            "Hãy cung cấp cho ALVA các ràng buộc rõ ràng: ngân sách, sở thích, số lượng người...",
            "Yêu cầu ALVA tạo ra nhiều phương án để bạn lựa chọn."
        ],
        "prompt_starters": [
            {"title": "Gợi ý lịch trình mẫu", "prompt": "Hãy gợi ý một lịch trình mẫu cho chuyến du lịch 5 ngày 4 đêm tại Đà Lạt, tập trung vào các hoạt động thiên nhiên và ẩm thực."},
            {"title": "Ước tính ngân sách", "prompt": "Hãy giúp tôi ước tính ngân sách cơ bản cho một người trong chuyến đi 5 ngày tại Đà Lạt, bao gồm các khoản chính."},
            {"title": "Tìm 5 quán ăn địa phương", "prompt": "Hãy đề xuất 5 quán ăn địa phương không thể bỏ qua ở Đà Lạt, kèm theo mô tả ngắn."}
        ],
        "participants": 150,
        "rating": 4.7,
        "domain_skills": ["Lập kế hoạch", "Tổ chức", "Nghiên cứu"],
        "alv_skills": ["Delegation", "Description"],
        "thumbnail": "/images/missions/travel-planning.jpg",
        "featured": True
    },
    { 
        "id": "06",
        "title": "Xây dựng kế hoạch học một kỹ năng mới trong 1 tháng",
        "description": "Bạn muốn học một kỹ năng mới (ví dụ: chơi guitar, học một ngôn ngữ lập trình cơ bản). Hãy cùng ALVA xây dựng một lộ trình học tập chi tiết và thực tế trong 30 ngày.",
        "category": "Tiện ích Đời sống",
        "difficulty": "Intermediate",
        "estimated_hours": "10-12 giờ",
        "context": "Bạn luôn muốn học thêm một kỹ năng mới nhưng không biết bắt đầu từ đâu và dễ dàng bỏ cuộc vì không có kế hoạch rõ ràng.",
        "learning_objectives": [
            "Học cách đặt mục tiêu SMART.",
            "Rèn luyện kỹ năng phân rã một mục tiêu lớn thành các bước nhỏ.",
            "Xây dựng tính kỷ luật và khả năng tự học."
        ],
        "deliverables": [
            "Lộ trình học tập chi tiết theo từng tuần.",
            "Danh sách các nguồn tài liệu học tập (sách, video, khóa học).",
            "Một hệ thống theo dõi tiến độ đơn giản."
        ],
        "tips": [
            "Hãy trung thực về thời gian bạn có thể dành ra mỗi ngày.",
            "Yêu cầu ALVA tìm các dự án nhỏ để bạn thực hành mỗi tuần."
        ],
        "prompt_starters": [
            {"title": "Phân rã mục tiêu", "prompt": "Tôi muốn học chơi guitar cơ bản trong 1 tháng. Hãy giúp tôi phân rã mục tiêu này thành các mục tiêu nhỏ hơn theo từng tuần."},
            {"title": "Tìm nguồn học liệu", "prompt": "Hãy gợi ý 3 kênh YouTube và 2 website miễn phí tốt nhất cho người mới bắt đầu học guitar."},
            {"title": "Tạo lịch học mẫu", "prompt": "Hãy tạo một lịch học mẫu trong 1 tuần, với mỗi ngày 1 tiếng, cho người mới học guitar."}
        ],
        "participants": 95,
        "rating": 4.6,
        "domain_skills": ["Tự học", "Lập kế hoạch", "Quản lý Thời gian"],
        "alv_skills": ["Delegation", "Discernment"],
        "thumbnail": "/images/missions/skill-learning-plan.jpg",
        "featured": False
    },
    { 
        "id": "07",
        "title": "Chuẩn bị bộ hồ sơ ứng tuyển vị trí Thực tập sinh",
        "description": "Xây dựng một bộ hồ sơ hoàn chỉnh để ứng tuyển vào vị trí thực tập sinh mơ ước, bao gồm CV, thư xin việc (cover letter) và chuẩn bị cho các câu hỏi phỏng vấn thường gặp.",
        "category": "Phát triển Sự nghiệp",
        "difficulty": "Intermediate",
        "estimated_hours": "20-25 giờ",
        "context": "Một công ty bạn rất yêu thích đang mở đợt tuyển thực tập sinh. Bạn muốn có một bộ hồ sơ nổi bật và sự chuẩn bị tốt nhất để tăng cơ hội thành công.",
        "learning_objectives": [
            "Học cách viết CV và Cover Letter chuyên nghiệp.",
            "Rèn luyện kỹ năng giao tiếp và trả lời phỏng vấn.",
            "Áp dụng kỹ năng Trách nhiệm để đảm bảo mọi thông tin là trung thực."
        ],
        "deliverables": [
            "Một bản CV hoàn chỉnh theo ngành nghề.",
            "Một thư xin việc được cá nhân hóa cho công ty.",
            "Danh sách 20 câu hỏi phỏng vấn thường gặp và dàn ý trả lời."
        ],
        "tips": [
            "Cung cấp cho ALVA bản mô tả công việc (Job Description) để nó có thể cá nhân hóa hồ sơ.",
            "Yêu cầu ALVA đóng vai nhà tuyển dụng để thực hành phỏng vấn thử."
        ],
        "prompt_starters": [
            {"title": "Tối ưu hóa phần 'Tóm tắt'", "prompt": "Dựa trên CV của tôi (tôi sẽ dán vào sau), hãy giúp tôi viết lại phần 'Tóm tắt bản thân' (Summary) cho vị trí Thực tập sinh Marketing."},
            {"title": "Soạn thảo dàn ý Cover Letter", "prompt": "Hãy tạo một dàn ý chi tiết cho một thư xin việc (cover letter), bao gồm 3 đoạn văn chính."},
            {"title": "Brainstorm câu hỏi phỏng vấn", "prompt": "Hãy liệt kê 5 câu hỏi phỏng vấn hành vi thường gặp cho vị trí Thực tập sinh Marketing."}
        ],
        "participants": 112,
        "rating": 4.9,
        "domain_skills": ["Viết CV", "Phỏng vấn", "Giao tiếp Chuyên nghiệp"],
        "alv_skills": ["Description", "Diligence", "Synthesis"],
        "thumbnail": "/images/missions/internship-application.jpg",
        "featured": True
    },
    { 
        "id": "08",
        "title": "Phân tích đối thủ cạnh tranh cho một ý tưởng kinh doanh",
        "description": "Bạn có một ý tưởng kinh doanh nhỏ. Hãy cùng ALVA thực hiện một bản phân tích 3 đối thủ cạnh tranh chính trên thị trường, tập trung vào điểm mạnh, điểm yếu và chiến lược của họ.",
        "category": "Phát triển Sự nghiệp",
        "difficulty": "Advanced",
        "estimated_hours": "40-50 giờ",
        "context": "Bạn và nhóm đang ấp ủ một dự án khởi nghiệp nhưng cần hiểu rõ hơn về thị trường và các đối thủ hiện có trước khi bắt tay vào làm.",
        "learning_objectives": [
            "Học về các mô hình phân tích kinh doanh (SWOT, Porter's Five Forces).",
            "Rèn luyện kỹ năng thu thập và phân tích thông tin thị trường.",
            "Phát triển tư duy chiến lược."
        ],
        "deliverables": [
            "Báo cáo phân tích chi tiết cho 3 đối thủ.",
            "Ma trận SWOT cho từng đối thủ.",
            "Đề xuất chiến lược cạnh tranh cho ý tưởng của bạn."
        ],
        "tips": [
            "Yêu cầu ALVA đóng vai một nhà phân tích kinh doanh của McKinsey.",
            "Sử dụng các nguồn tin uy tín và luôn kiểm chứng lại thông tin ALVA cung cấp."
        ],
        "prompt_starters": [
            {"title": "Xây dựng khung phân tích", "prompt": "Hãy đề xuất một khung (framework) để phân tích đối thủ cạnh tranh, bao gồm các tiêu chí chính cần xem xét."},
            {"title": "Tạo ma trận SWOT", "prompt": "Hãy giải thích cách xây dựng một ma trận SWOT và cho ví dụ."},
            {"title": "Đóng vai nhà phân tích", "prompt": "Hãy đóng vai một nhà phân tích kinh doanh và cho tôi biết 3 bước đầu tiên để bắt đầu phân tích một đối thủ."}
        ],
        "participants": 35,
        "rating": 4.8,
        "domain_skills": ["Phân tích Kinh doanh", "Tư duy Chiến lược", "Nghiên cứu Thị trường"],
        "alv_skills": ["Delegation", "Discernment", "Diligence"],
        "thumbnail": "/images/missions/competitor-analysis.jpg",
        "featured": False
    },
    { 
        "id": "09",
        "title": "Bài thuyết trình về Tác động của AI đến Lao động Việt Nam",
        "description": "Nghiên cứu, tổng hợp và xây dựng một bài thuyết trình 5 phút toàn diện, phân tích đa chiều về tác động của AI đến thị trường lao động Việt Nam. Đây là dự án tổng hợp, đòi hỏi vận dụng toàn bộ Năng lực AI.",
        "category": "Nghiên cứu & Học thuật",
        "difficulty": "Advanced",
        "estimated_hours": "45-55 giờ",
        "context": "Bạn được giao một bài tập lớn cuối kỳ, yêu cầu thực hiện một bài thuyết trình sâu sắc về một chủ đề thời sự. Đây là cơ hội để bạn thể hiện toàn bộ kỹ năng và đạt điểm số cao nhất.",
        "learning_objectives": [
            "Vận dụng toàn bộ Framework 4D+S vào một quy trình hoàn chỉnh.",
            "Thực hành kỹ năng Nhận định (Discernment) để đánh giá các nguồn tin phức tạp.",
            "Áp dụng kỹ năng Tổng hợp (Synthesis) để kiến tạo một câu chuyện có chiều sâu.",
            "Rèn luyện khả năng trình bày một vấn đề đa chiều một cách logic."
        ],
        "deliverables": [
            "Một dàn ý chi tiết cho bài thuyết trình, bao gồm cả luận điểm chính và phụ.",
            "Nội dung (script) hoàn chỉnh cho bài thuyết trình 5 phút.",
            "Danh mục các nguồn tài liệu tham khảo đã được kiểm chứng và trích dẫn đúng quy cách."
        ],
        "tips": [
            "Bắt đầu bằng việc yêu cầu ALVA tạo một dàn ý đa chiều, bao gồm cả mặt tích cực và tiêu cực.",
            "Luôn kiểm chứng lại các số liệu và báo cáo mà ALVA cung cấp từ các nguồn uy tín.",
            "Sản phẩm cuối cùng phải thể hiện được góc nhìn và sự đúc kết của riêng bạn, không chỉ là sự tổng hợp thông tin."
        ],
        "prompt_starters": [
            {"title": "Lập dàn ý đa chiều", "prompt": "Hãy giúp tôi lập một dàn ý chi tiết cho bài thuyết trình về 'Tác động của AI đến thị trường lao động Việt Nam', bao gồm cả cơ hội và thách thức."},
            {"title": "Soạn thảo lời mở đầu", "prompt": "Hãy viết một đoạn mở đầu ấn tượng, khoảng 150 từ, để thu hút sự chú ý của khán giả cho bài thuyết trình này."},
            {"title": "Tìm kiếm số liệu", "prompt": "Hãy gợi ý các từ khóa và nguồn uy tín để tôi có thể tìm kiếm các số liệu về thị trường lao động và AI tại Việt Nam."}
        ],
        "participants": 15,
        "rating": 4.9,
        "domain_skills": ["Thuyết trình", "Nghiên cứu", "Phân tích Dữ liệu", "Tư duy Phản biện"],
        "alv_skills": ["Delegation", "Description", "Discernment", "Diligence", "Synthesis"],
        "thumbnail": "/images/missions/ai-labor-impact.jpg",
        "featured": True
    },
    { 
        "id": "10",
        "title": "Thực hiện một Tổng quan Văn học (Literature Review)",
        "description": "Thực hiện một tổng quan văn học cho một chủ đề nghiên cứu cụ thể, bao gồm việc tìm kiếm, tóm tắt và tổng hợp ít nhất 5 bài báo khoa học liên quan.",
        "category": "Nghiên cứu & Học thuật",
        "difficulty": "Advanced",
        "estimated_hours": "50-60 giờ",
        "context": "Bạn đang bắt đầu làm khóa luận tốt nghiệp hoặc một dự án nghiên cứu và cần xây dựng một nền tảng kiến thức vững chắc về lĩnh vực của mình.",
        "learning_objectives": [
            "Nắm vững quy trình của một bài tổng quan văn học.",
            "Rèn luyện kỹ năng đánh giá và phê bình các bài báo khoa học.",
            "Áp dụng kỹ năng Trách nhiệm (Diligence) trong việc trích dẫn."
        ],
        "deliverables": [
            "Bản tóm tắt và phân tích 5 bài báo khoa học.",
            "Một bài tổng quan văn học hoàn chỉnh (khoảng 1500 từ)."
        ],
        "tips": [
            "Sử dụng ALVA để tóm tắt nhanh các bài báo và tìm ra luận điểm chính.",
            "Hãy là người quyết định cuối cùng về việc bài báo nào phù hợp và đáng tin cậy."
        ],
        "prompt_starters": [
            {"title": "Xác định từ khóa nghiên cứu", "prompt": "Tôi đang nghiên cứu về chủ đề 'Gamification trong giáo dục'. Hãy gợi ý 5 bộ từ khóa (keywords) bằng tiếng Anh để tôi tìm kiếm bài báo trên Google Scholar."},
            {"title": "Tạo cấu trúc bài tổng quan", "prompt": "Hãy đề xuất một cấu trúc (outline) chuẩn cho một bài tổng quan văn học."},
            {"title": "Tóm tắt một bài báo", "prompt": "Tôi sẽ dán một đoạn tóm tắt (abstract) của một bài báo khoa học. Hãy giúp tôi rút ra 3 luận điểm chính từ đó."}
        ],
        "participants": 25,
        "rating": 4.9,
        "domain_skills": ["Nghiên cứu Khoa học", "Viết học thuật", "Phê bình"],
        "alv_skills": ["Delegation", "Discernment", "Diligence"],
        "thumbnail": "/images/missions/literature-review.jpg",
        "featured": False
    },
    { 
        "id": "11",
        "title": "Thiết kế Bộ nhận diện Thương hiệu cho một Dự án Cá nhân",
        "description": "Bạn có một CLB, một kênh YouTube, hoặc một dự án cá nhân? Hãy cùng ALVA brainstorm và thiết kế một bộ nhận diện thương hiệu cơ bản, bao gồm logo, bảng màu và slogan.",
        "category": "Nghệ thuật & Sáng tạo",
        "difficulty": "Beginner",
        "estimated_hours": "10-15 giờ",
        "context": "Dự án của bạn cần một bộ mặt chuyên nghiệp và nhất quán để thu hút khán giả, nhưng bạn không phải là một nhà thiết kế chuyên nghiệp.",
        "learning_objectives": [
            "Hiểu về các yếu tố cơ bản của nhận diện thương hiệu.",
            "Thực hành kỹ năng Mô tả (Description) để tạo ra các prompt hình ảnh.",
            "Áp dụng kỹ năng Tổng hợp (Synthesis) để tạo ra một bộ nhận diện hài hòa."
        ],
        "deliverables": [
            "Ba ý tưởng logo (dưới dạng mô tả chi tiết).",
            "Một bảng màu gồm 5 màu chủ đạo.",
            "Ba phương án slogan."
        ],
        "tips": [
            "Hãy mô tả thật chi tiết về tính cách và giá trị của thương hiệu bạn.",
            "Sử dụng các công cụ tạo ảnh AI bên ngoài và dán kết quả vào để ALVA phân tích."
        ],
        "prompt_starters": [
            {"title": "Brainstorm 3 ý tưởng slogan", "prompt": "Hãy brainstorm 3 slogan cho một kênh YouTube về review sách, với phong cách trẻ trung và thông minh."},
            {"title": "Đề xuất bảng màu", "prompt": "Hãy đề xuất một bảng màu gồm 4 màu, phù hợp với một thương hiệu cá nhân về lối sống tối giản."},
            {"title": "Mô tả ý tưởng logo", "prompt": "Hãy giúp tôi viết một đoạn văn mô tả ý tưởng logo cho một CLB nhiếp ảnh, để tôi có thể đưa cho một công cụ tạo ảnh AI."}
        ],
        "participants": 88,
        "rating": 4.7,
        "domain_skills": ["Thiết kế Thương hiệu", "Sáng tạo", "Marketing"],
        "alv_skills": ["Description", "Synthesis"],
        "thumbnail": "/images/missions/brand-identity.jpg",
        "featured": False
    },
    { 
        "id": "12",
        "title": "Phát triển Cốt truyện cho một Truyện ngắn",
        "description": "Sáng tác một cốt truyện hoàn chỉnh cho một truyện ngắn (khoảng 1000 từ) thuộc thể loại bạn yêu thích, bao gồm việc xây dựng nhân vật, bối cảnh và các nút thắt chính.",
        "category": "Nghệ thuật & Sáng tạo",
        "difficulty": "Intermediate",
        "estimated_hours": "20-30 giờ",
        "context": "Bạn yêu thích viết lách nhưng thường bị 'bí' ý tưởng hoặc gặp khó khăn trong việc xây dựng một cốt truyện có chiều sâu và hấp dẫn.",
        "learning_objectives": [
            "Học về cấu trúc 3 hồi của một câu chuyện.",
            "Rèn luyện kỹ năng xây dựng nhân vật và phát triển tình tiết.",
            "Sử dụng AI như một đối tác 'động não' để vượt qua writer's block."
        ],
        "deliverables": [
            "Hồ sơ chi tiết cho 2 nhân vật chính.",
            "Dàn ý cốt truyện theo cấu trúc 3 hồi.",
            "Bản nháp của truyện ngắn."
        ],
        "tips": [
            "Hãy bắt đầu bằng cách yêu cầu ALVA tạo ra những tình huống oái oăm cho nhân vật của bạn.",
            "Bạn luôn là người quyết định cuối cùng về số phận của nhân vật."
        ],
        "prompt_starters": [
            {"title": "Tạo hồ sơ nhân vật", "prompt": "Hãy giúp tôi tạo một hồ sơ nhân vật chi tiết cho một thám tử tư ở Hà Nội những năm 1990, bao gồm cả điểm mạnh, điểm yếu và một bí mật."},
            {"title": "Brainstorm 3 nút thắt", "prompt": "Hãy brainstorm 3 nút thắt (plot twist) bất ngờ cho một câu chuyện trinh thám."},
            {"title": "Xây dựng dàn ý 3 hồi", "prompt": "Hãy xây dựng một dàn ý cốt truyện theo cấu trúc 3 hồi cho một truyện ngắn về tình bạn."}
        ],
        "participants": 41,
        "rating": 4.8,
        "domain_skills": ["Viết sáng tạo", "Kể chuyện", "Xây dựng Cốt truyện"],
        "alv_skills": ["Description", "Synthesis"],
        "thumbnail": "/images/missions/short-story-plot.jpg",
        "featured": False
    },
    { 
        "id": "13",
        "title": "Lên Kế hoạch Chi tiêu Cá nhân Hàng tháng",
        "description": "Xây dựng một bảng kế hoạch chi tiêu cá nhân chi tiết cho một tháng, bao gồm việc phân loại các khoản chi, đặt ra hạn mức và tìm cách tiết kiệm hiệu quả.",
        "category": "Tiện ích Đời sống",
        "difficulty": "Beginner",
        "estimated_hours": "5-8 giờ",
        "context": "Bạn cảm thấy mình thường xuyên 'cháy túi' vào cuối tháng và muốn quản lý tài chính cá nhân một cách thông minh hơn.",
        "learning_objectives": [
            "Hiểu về các nguyên tắc quản lý tài chính cơ bản.",
            "Thực hành kỹ năng lập kế hoạch và phân loại (Delegation).",
            "Sử dụng AI để tìm kiếm các mẹo tiết kiệm phù hợp với lối sống."
        ],
        "deliverables": [
            "Một bảng ngân sách chi tiết cho tháng.",
            "Danh sách 5 mẹo tiết kiệm được cá nhân hóa."
        ],
        "tips": [
            "Hãy cung cấp cho ALVA các khoản thu nhập và chi tiêu cố định của bạn.",
            "Yêu cầu ALVA phân tích và chỉ ra những khoản bạn có thể cắt giảm."
        ],
        "prompt_starters": [
            {"title": "Phân loại các khoản chi", "prompt": "Hãy liệt kê các danh mục chi tiêu phổ biến cho một sinh viên và gợi ý một phương pháp phân loại đơn giản."},
            {"title": "Gợi ý 3 mẹo tiết kiệm", "prompt": "Hãy gợi ý 3 mẹo tiết kiệm thực tế cho một sinh viên có thói quen hay uống cà phê ngoài."},
            {"title": "Tạo bảng ngân sách mẫu", "prompt": "Hãy tạo một cấu trúc bảng ngân sách đơn giản bằng markdown để tôi có thể theo dõi chi tiêu hàng tháng."}
        ],
        "participants": 210,
        "rating": 4.9,
        "domain_skills": ["Quản lý Tài chính", "Lập kế hoạch", "Tổ chức"],
        "alv_skills": ["Delegation", "Description"],
        "thumbnail": "/images/missions/personal-budget.jpg",
        "featured": False
    },
    { 
        "id": "14",
        "title": "Xây dựng một Lịch trình Luyện tập và Dinh dưỡng",
        "description": "Thiết kế một kế hoạch luyện tập thể thao và dinh dưỡng trong một tuần, phù hợp với mục tiêu cá nhân của bạn (tăng cơ, giảm cân, hay giữ dáng).",
        "category": "Tiện ích Đời sống",
        "difficulty": "Intermediate",
        "estimated_hours": "10-15 giờ",
        "context": "Bạn muốn cải thiện sức khỏe nhưng bị choáng ngợp trước vô vàn thông tin về luyện tập và ăn uống trên mạng.",
        "learning_objectives": [
            "Học cách đặt ra các mục tiêu sức khỏe thực tế.",
            "Rèn luyện kỹ năng Nhận định (Discernment) để đánh giá các lời khuyên.",
            "Áp dụng kỹ năng Trách nhiệm (Diligence) khi làm việc với các thông tin sức khỏe."
        ],
        "deliverables": [
            "Lịch tập luyện chi tiết cho 7 ngày.",
            "Thực đơn gợi ý cho 3 bữa chính mỗi ngày.",
            "Danh sách các lưu ý quan trọng về an toàn và sức khỏe."
        ],
        "tips": [
            "Luôn nhắc nhở ALVA rằng bạn không phải là chuyên gia và cần những lời khuyên an toàn.",
            "Hãy kiểm chứng lại các thông tin quan trọng với các nguồn y tế đáng tin cậy."
        ],
        "prompt_starters": [
            {"title": "Lập lịch tập cho người mới", "prompt": "Hãy tạo một lịch tập mẫu 3 buổi/tuần cho một người mới bắt đầu, tập trung vào các bài tập toàn thân (full-body)."},
            {"title": "Gợi ý 3 bữa ăn lành mạnh", "prompt": "Hãy gợi ý thực đơn cho 3 bữa chính (sáng, trưa, tối) trong một ngày, đảm bảo đủ dinh dưỡng và dễ chế biến."},
            {"title": "Tìm bài tập thay thế", "prompt": "Hãy gợi ý 3 bài tập cardio có thể thực hiện tại nhà mà không cần dụng cụ."}
        ],
        "participants": 130,
        "rating": 4.7,
        "domain_skills": ["Sức khỏe & Fitness", "Lập kế hoạch", "Nghiên cứu"],
        "alv_skills": ["Discernment", "Diligence"],
        "thumbnail": "/images/missions/fitness-plan.jpg",
        "featured": False
    },
    { 
        "id": "15",
        "title": "Chuẩn bị cho một Buổi phỏng vấn Tình huống (Case Interview)",
        "description": "Thực hành giải quyết một case study kinh doanh điển hình, từ việc phân tích vấn đề, xây dựng cấu trúc, đến việc trình bày giải pháp một cách thuyết phục.",
        "category": "Phát triển Sự nghiệp",
        "difficulty": "Advanced",
        "estimated_hours": "30-40 giờ",
        "context": "Bạn đang ứng tuyển vào các công ty tư vấn hoặc các vị trí đòi hỏi kỹ năng giải quyết vấn đề và cần chuẩn bị cho vòng phỏng vấn tình huống đầy thử thách.",
        "learning_objectives": [
            "Nắm vững các framework giải case phổ biến (VD: Profitability Framework).",
            "Rèn luyện tư duy cấu trúc và phân tích dữ liệu.",
            "Sử dụng AI như một đối tác để 'stress test' các giả thuyết của bạn."
        ],
        "deliverables": [
            "Một dàn ý chi tiết cho việc giải quyết case study.",
            "Một bản trình bày giải pháp hoàn chỉnh."
        ],
        "tips": [
            "Yêu cầu ALVA đóng vai người phỏng vấn và liên tục đặt câu hỏi 'Tại sao?'.",
            "Sử dụng ALVA để tính toán nhanh các con số nhưng hãy tự mình kiểm tra lại logic."
        ],
        "prompt_starters": [
            {"title": "Giải thích một framework", "prompt": "Hãy giải thích ngắn gọn về Profitability Framework và khi nào nên sử dụng nó trong một buổi phỏng vấn tình huống."},
            {"title": "Tạo một case study nhỏ", "prompt": "Hãy tạo một case study kinh doanh nhỏ về một công ty cà phê đang bị giảm lợi nhuận để tôi thực hành."},
            {"title": "Đóng vai người phỏng vấn", "prompt": "Hãy đóng vai một nhà tư vấn và đặt cho tôi 3 câu hỏi làm rõ (clarifying questions) đầu tiên cho một case study."}
        ],
        "participants": 45,
        "rating": 4.9,
        "domain_skills": ["Giải quyết Vấn đề", "Tư duy Phân tích", "Tư vấn Quản lý"],
        "alv_skills": ["Delegation", "Discernment", "Synthesis"],
        "thumbnail": "/images/missions/case-interview.jpg",
        "featured": False
    },
    { 
        "id": "16",
        "title": "Tối ưu hóa Hồ sơ LinkedIn và Soạn thảo Tin nhắn Kết nối",
        "description": "Chỉnh sửa và tối ưu hóa hồ sơ LinkedIn của bạn để thu hút nhà tuyển dụng, đồng thời soạn thảo các mẫu tin nhắn kết nối (networking message) chuyên nghiệp và hiệu quả.",
        "category": "Phát triển Sự nghiệp",
        "difficulty": "Beginner",
        "estimated_hours": "8-12 giờ",
        "context": "Bạn muốn xây dựng thương hiệu cá nhân và mở rộng mạng lưới quan hệ chuyên nghiệp trên LinkedIn nhưng chưa biết cách làm cho hồ sơ của mình thực sự nổi bật.",
        "learning_objectives": [
            "Hiểu về các yếu tố của một hồ sơ LinkedIn mạnh.",
            "Học cách viết một cách chuyên nghiệp và thuyết phục.",
            "Rèn luyện kỹ năng giao tiếp trong môi trường công việc."
        ],
        "deliverables": [
            "Một bản mô tả (About section) được viết lại hoàn chỉnh.",
            "Ba mẫu tin nhắn kết nối cho các tình huống khác nhau."
        ],
        "tips": [
            "Cung cấp cho ALVA CV và các thành tích của bạn để nó có ngữ cảnh.",
            "Yêu cầu ALVA viết lại một đoạn văn theo nhiều văn phong khác nhau (chuyên nghiệp, thân thiện...) để bạn lựa chọn."
        ],
        "prompt_starters": [
            {"title": "Viết lại phần 'Giới thiệu'", "prompt": "Hãy giúp tôi viết lại phần 'Giới thiệu' (About section) trên LinkedIn, với vai trò là một sinh viên năm cuối ngành Marketing đang tìm kiếm cơ hội thực tập."},
            {"title": "Soạn 3 mẫu tin nhắn kết nối", "prompt": "Hãy soạn 3 mẫu tin nhắn kết nối chuyên nghiệp để gửi cho: 1. Một nhà tuyển dụng, 2. Một cựu sinh viên, 3. Một người có cùng sở thích."},
            {"title": "Brainstorm các kỹ năng", "prompt": "Hãy liệt kê 10 kỹ năng quan trọng mà một sinh viên Marketing nên thêm vào hồ sơ LinkedIn của mình."}
        ],
        "participants": 180,
        "rating": 4.8,
        "domain_skills": ["Thương hiệu Cá nhân", "Mạng lưới Quan hệ", "Viết chuyên nghiệp"],
        "alv_skills": ["Description", "Synthesis"],
        "thumbnail": "/images/missions/linkedin-profile.jpg",
        "featured": False
    }


]

def process_missions():
    """Xử lý missions theo chế độ đã chọn"""
    mode = get_operation_mode()
    
    print(f"🚀 Bắt đầu xử lý dữ liệu missions - Chế độ: {mode.upper()}")
    print(f"📊 Tổng số missions: {len(missions)}")
    
    # Thống kê
    updated_count = 0
    inserted_count = 0
    error_count = 0
    
    for i, mission in enumerate(missions, 1):
        try:
            # Kiểm tra mission đã tồn tại chưa
            existing = supabase.table("missions").select("id").eq("id", mission["id"]).execute()
            mission_exists = existing.data and len(existing.data) > 0
            
            if mode == "update" and not mission_exists:
                print(f"⏭️  Bỏ qua mission {mission['id']} (chưa tồn tại, chế độ update only)")
                continue
                
            elif mode == "insert" and mission_exists:
                print(f"⏭️  Bỏ qua mission {mission['id']} (đã tồn tại, chế độ insert only)")
                continue
            
            if mission_exists:
                # Update mission đã tồn tại
                result = supabase.table("missions").update(mission).eq("id", mission["id"]).execute()
                print(f"✅ [{i:2d}/{len(missions)}] Đã cập nhật: {mission['title']}")
                updated_count += 1
            else:
                # Insert mission mới
                result = supabase.table("missions").insert(mission).execute()
                print(f"🆕 [{i:2d}/{len(missions)}] Đã tạo mới: {mission['title']}")
                inserted_count += 1
                
        except Exception as e:
            print(f"❌ [{i:2d}/{len(missions)}] Lỗi xử lý mission {mission['id']}: {e}")
            error_count += 1

    # Báo cáo kết quả
    print("\n" + "="*60)
    print(f"🎉 HOÀN TẤT! Kết quả xử lý:")
    print(f"   ✅ Đã cập nhật: {updated_count} missions")
    print(f"   🆕 Đã tạo mới:  {inserted_count} missions")
    print(f"   ❌ Lỗi:        {error_count} missions")
    print(f"   � Tổng cộng:   {updated_count + inserted_count + error_count}/{len(missions)}")
    
    if error_count == 0:
        print("✨ Tất cả missions đều được xử lý thành công!")
    
    print("\n📋 Tóm tắt missions:")
    for mission in missions:
        status = "🆕" if not supabase.table("missions").select("id").eq("id", mission["id"]).execute().data else "✅"
        print(f"   {status} {mission['id']}: {mission['title']} ({mission['category']})")
    
    print(f"\n💡 Để chạy lại với chế độ khác:")
    print(f"   python insertdata.py auto    # Tự động update/insert")
    print(f"   python insertdata.py update  # Chỉ update missions có sẵn")
    print(f"   python insertdata.py insert  # Chỉ insert missions mới")
    print(f"\n🧪 Test API bằng cách chạy:")
    print(f"   python test_api_examples.py")

if __name__ == "__main__":
    process_missions()