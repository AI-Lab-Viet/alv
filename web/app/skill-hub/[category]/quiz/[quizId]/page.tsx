import Quiz from "@/modules/skill-hub/Quiz";
import { QuizList } from "@/types/skill-hub-type";
import { notFound } from "next/navigation";

const quizData: QuizList[] = [
  {
    id: "prompt-basics-quiz",
    title: "Chương 1: Nền tảng tư duy cho kỷ nguyên AI",
    description:
      "Kiểm tra hiểu biết về cấu trúc và nguyên tắc cơ bản của prompt",
    duration: "10 phút",
    category: "prompting",
    questions: [
      {
        id: 1,
        question:
          "Theo giáo trình, mục tiêu cuối cùng của một nhà cộng tác AI xuất sắc là gì?",
        choices: [
          "Sáng tạo nhanh hơn, nhiều hơn và rẻ hơn.",
          "Đồng hành để dẫn lối sự sáng tạo một cách Hiệu quả, Hiệu suất, Có Đạo đức và An toàn.",
          "Thay thế hoàn toàn các công việc thủ công bằng AI.",
          "Trở thành một chuyên gia viết prompt cho mọi tình huống.",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Bốn trụ cột của 'Năng lực AI' (AI Fluency) là gì?",
        choices: [
          "Nhanh, Mạnh, Chính xác, Sáng tạo",
          "Tự động hóa, Phân tích, Tối ưu, Báo cáo",
          "Hiệu quả, Hiệu suất, Có Đạo đức, An toàn",
          "Hỏi, Đáp, Kiểm tra, Lặp lại",
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question:
          "Việc ý thức được về các vấn đề như 'thiên kiến (bias) hay thông tin sai lệch' thuộc về trụ cột nào của Năng lực AI?",
        choices: [
          "Hiệu quả (Effective)",
          "Hiệu suất (Efficient)",
          "Có Đạo đức & An toàn (Ethical & Safe)",
          "Cả ba phương án trên",
        ],
        correctAnswer: 2,
      },
      {
        id: 4,
        question:
          "Khi bạn giao cho AI một công việc lặp đi lặp lại với chỉ dẫn rõ ràng (ví dụ: 'Dịch email này sang tiếng Anh'), bạn đang hợp tác theo phương thức nào?",
        choices: [
          "Tăng cường (Augmentation)",
          "Ủy quyền (Agency)",
          "Tự động hóa (Automation)",
          "Sáng tạo (Creation)",
        ],
        correctAnswer: 2,
      },
      {
        id: 5,
        question:
          "Một sinh viên và AI cùng nhau 'động não' (brainstorm) để tìm ý tưởng cho một dự án, trao đổi qua lại nhiều lần để hoàn thiện ý tưởng. Mối quan hệ này được gọi là gì?",
        choices: [
          "Bạn là Người Ra lệnh (Automation)",
          "Bạn là Người Đồng đội (Augmentation)",
          "Bạn là Người Kiến tạo (Agency)",
          "Bạn là Người Dùng (User)",
        ],
        correctAnswer: 1,
      },
      {
        id: 6,
        question:
          "Một lập trình viên cấu hình một 'agent' AI để tự động quét các email mới, phân loại chúng thành 'Khẩn cấp', 'Thông tin', 'Spam' và chuyển vào các thư mục tương ứng. Đây là ví dụ điển hình nhất cho phương thức hợp tác nào?",
        choices: [
          "Tự động hóa (Automation)",
          "Tăng cường (Augmentation)",
          "Ủy quyền (Agency)",
          "Phân tích (Analysis)",
        ],
        correctAnswer: 2,
      },
      {
        id: 7,
        question: "Framework 4D là viết tắt của bốn kỹ năng cốt lõi nào?",
        choices: [
          "Define, Develop, Deploy, Debug",
          "Data, Dialogue, Decision, Design",
          "Delegation, Description, Discernment, Diligence",
          "Discover, Describe, Debate, Deliver",
        ],
        correctAnswer: 2,
      },
      {
        id: 8,
        question:
          "Trong Framework 4D, kỹ năng viết các câu lệnh (prompt) chi tiết, cụ thể để AI hiểu đúng ý bạn được gọi là gì?",
        choices: [
          "Delegation (Phân công)",
          "Description (Mô tả)",
          "Discernment (Nhận định)",
          "Diligence (Trách nhiệm)",
        ],
        correctAnswer: 1,
      },
      {
        id: 9,
        question:
          "Khi bạn kiểm tra lại thông tin do AI cung cấp để phát hiện lỗi sai hoặc thiên kiến, bạn đang thực hành kỹ năng nào của Framework 4D?",
        choices: [
          "Delegation (Phân công)",
          "Description (Mô tả)",
          "Discernment (Nhận định)",
          "Diligence (Trách nhiệm)",
        ],
        correctAnswer: 2,
      },
      {
        id: 10,
        question:
          "Theo giáo trình, bốn năng lực trong Framework 4D được mô tả như thế nào?",
        choices: [
          "Là bốn bước riêng rẽ, thực hiện tuần tự từ đầu đến cuối.",
          "Là một vòng lặp tư duy liên tục, không phải là các bước riêng rẽ.",
          "Là bốn kỹ năng có thể chọn một để thành thạo.",
          "Là bộ quy tắc chỉ dành cho các chuyên gia AI.",
        ],
        correctAnswer: 1,
      },
      {
        id: 11,
        question: "Câu chuyện của Quý ở đầu chương nói lên điều gì?",
        choices: [
          "AI rất dễ sử dụng và không cần học.",
          "Nếu không có hệ thống tư duy, người dùng AI dễ trở nên bị động và thiếu tự chủ.",
          "Chỉ có những người xây dựng AI Lab Việt mới gặp khó khăn khi dùng AI.",
          "AI luôn cho ra kết quả chính xác 100%.",
        ],
        correctAnswer: 1,
      },
      {
        id: 12,
        question:
          "Vai trò 'Người chịu trách nhiệm cuối cùng' về chất lượng và đạo đức của sản phẩm thuộc về kỹ năng nào trong Framework 4D?",
        choices: [
          "Delegation (Phân công)",
          "Description (Mô tả)",
          "Discernment (Nhận định)",
          "Diligence (Trách nhiệm)",
        ],
        correctAnswer: 3,
      },
      {
        id: 13,
        question:
          "Một người dùng sao chép nguyên văn một đoạn văn do AI tạo ra mà không kiểm tra, sau đó phát hiện thông tin đó chứa định kiến giới tiêu cực. Người dùng này đã vi phạm trụ cột nào quan trọng nhất của 'Năng lực AI'?",
        choices: [
          "Hiệu quả (Effective)",
          "Hiệu suất (Efficient)",
          "Có Đạo đức & An toàn (Ethical & Safe)",
          "Tự động hóa (Automation)",
        ],
        correctAnswer: 2,
      },
      {
        id: 14,
        question:
          "Sự khác biệt cơ bản nhất giữa phương thức 'Tự động hóa' (Automation) và 'Tăng cường' (Augmentation) là gì?",
        choices: [
          "Automation nhanh hơn Augmentation.",
          "Automation là mối quan hệ một chiều (ra lệnh - thực thi), trong khi Augmentation là mối quan hệ hai chiều (hợp tác, trao đổi).",
          "Chỉ có chuyên gia mới dùng được Augmentation.",
          "Automation dùng cho việc sáng tạo, còn Augmentation dùng cho việc lặp lại.",
        ],
        correctAnswer: 1,
      },
      {
        id: 15,
        question:
          "Phương thức hợp tác nào đòi hỏi người dùng phải có sự hiểu biết sâu sắc nhất về năng lực, giới hạn của AI và phải đặt sự an toàn, giám sát lên hàng đầu?",
        choices: [
          "Tự động hóa (Automation)",
          "Tăng cường (Augmentation)",
          "Ủy quyền (Agency)",
          "Phân tích (Analysis)",
        ],
        correctAnswer: 2,
      },
      {
        id: 16,
        question:
          "Một nhà báo sử dụng AI để dịch nhanh các tài liệu nước ngoài, sau đó tự mình phân tích, viết bài và đưa ra bình luận sắc sảo. Quá trình này là sự kết hợp của những phương thức nào?",
        choices: [
          "Chỉ có Tự động hóa (Automation).",
          "Chỉ có Tăng cường (Augmentation).",
          "Tự động hóa (cho việc dịch) và tư duy độc lập của nhà báo.",
          "Chỉ có Ủy quyền (Agency).",
        ],
        correctAnswer: 2,
      },
      {
        id: 17,
        question:
          "Mối quan hệ giữa hai kỹ năng 'Description' (Mô tả) và 'Discernment' (Nhận định) trong vòng lặp 4D có thể được mô tả tốt nhất là gì?",
        choices: [
          "Chúng là hai kỹ năng độc lập, không liên quan.",
          "Description là hành động ra lệnh, còn Discernment là hành động phản biện, kiểm tra và yêu cầu cải thiện kết quả.",
          "Bạn chỉ cần giỏi một trong hai kỹ năng là đủ.",
          "Description quan trọng hơn Discernment.",
        ],
        correctAnswer: 1,
      },
      {
        id: 18,
        question:
          "Một học sinh yêu cầu AI: 'Viết cho em một bài luận về Truyện Kiều'. Sau khi nhận được kết quả chung chung, học sinh tiếp tục yêu cầu: 'Rất tốt. Bây giờ hãy tập trung phân tích sâu hơn về nhân vật Thúy Kiều qua 3 lần nàng bán mình'. Lời nhắc thứ hai này thể hiện rõ nhất kỹ năng nào?",
        choices: [
          "Chỉ có Delegation (Phân công).",
          "Chỉ có Diligence (Trách nhiệm).",
          "Sự kết hợp giữa Description (cụ thể hóa yêu cầu) và Discernment (nhận ra câu trả lời đầu chưa đủ sâu).",
          "Ủy quyền (Agency).",
        ],
        correctAnswer: 2,
      },
      {
        id: 19,
        question:
          "Mục đích cuối cùng của việc thực hành vòng lặp 4D liên tục là gì?",
        choices: [
          "Để chứng minh rằng AI luôn sai.",
          "Để chuyển từ vai trò người dùng bị động thành một người kiến tạo, một người dẫn dắt có tư duy phản biện.",
          "Để tìm ra công cụ AI tốt nhất trên thị trường.",
          "Để viết được những prompt dài nhất có thể.",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "role-playing-quiz",
    title: "Chương 2: Nghệ thuật phân công",
    description:
      "Đánh giá khả năng sử dụng vai trò để cải thiện chất lượng phản hồi",
    duration: "12 phút",
    category: "prompting",
    questions: [
      {
        id: 20,
        question:
          "Theo Chương 2, vai trò cốt lõi của bạn khi làm việc nhóm với AI là gì?",
        choices: [
          "Thành viên thực thi mọi chỉ dẫn",
          "Người kiểm tra lỗi chính tả",
          "Trưởng nhóm, người vạch ra chiến lược",
          "Người cung cấp dữ liệu thô",
        ],
        correctAnswer: 2,
      },
      {
        id: 21,
        question:
          "Bước đầu tiên và quan trọng nhất trong 'Nghệ thuật Phân công' là gì?",
        choices: [
          "Viết một prompt thật chi tiết",
          "Biết rõ Đích đến (xác định mục tiêu)",
          "Chia nhỏ công việc",
          "Đánh giá năng lực của AI",
        ],
        correctAnswer: 1,
      },
      {
        id: 22,
        question:
          "Điều gì có thể xảy ra nếu bạn bỏ qua bước 'Biết rõ Đích đến' trước khi bắt đầu dùng AI?",
        choices: [
          "AI sẽ từ chối trả lời.",
          "Bạn sẽ nhận được các câu trả lời sáng tạo hơn.",
          "Quá trình làm việc sẽ hiệu quả hơn vì không tốn thời gian lập kế hoạch.",
          "Bạn sẽ lãng phí thời gian và công sức vào những kết quả không phù hợp hoặc sai hướng.",
        ],
        correctAnswer: 3,
      },
      {
        id: 23,
        question:
          "Khái niệm 'Biết mình, biết ta' (Năng lực Phân tích Kép) ám chỉ điều gì?",
        choices: [
          "Hiểu rõ điểm mạnh, điểm yếu của bản thân và của AI để phân công hợp lý.",
          "Biết mình muốn gì và biết AI có thể làm gì.",
          "Biết cách ra lệnh cho AI và biết cách AI sẽ phản hồi.",
          "Chỉ cần biết điểm mạnh của AI để giao hết việc cho nó.",
        ],
        correctAnswer: 0,
      },
      {
        id: 24,
        question:
          "Theo giáo trình, việc nào sau đây thuộc về thế mạnh của 'Thành viên AI'?",
        choices: [
          "Đặt ra Tầm nhìn và mục tiêu chiến lược cho dự án.",
          "Chịu trách nhiệm cuối cùng về mặt đạo đức của sản phẩm.",
          "Brainstorm ý tưởng, tổng hợp thông tin, soạn thảo bản nháp.",
          "Ra quyết định cuối cùng dựa trên ngữ cảnh sâu sắc.",
        ],
        correctAnswer: 2,
      },
      {
        id: 25,
        question:
          "Kỹ năng 'Chẻ củi' trong giáo trình tương ứng với hành động nào sau đây?",
        choices: [
          "Đặt ra một mục tiêu lớn và đầy tham vọng.",
          "Chia một vấn đề lớn, phức tạp thành các nhiệm vụ nhỏ, cụ thể.",
          "Loại bỏ những thông tin không cần thiết do AI tạo ra.",
          "Kiểm tra kỹ lưỡng sản phẩm cuối cùng.",
        ],
        correctAnswer: 1,
      },
      {
        id: 26,
        question:
          "Một người dùng đưa ra prompt: 'Hãy viết cho tôi một cuốn tiểu thuyết'. Cách tiếp cận này đã bỏ qua kỹ năng quan trọng nào được nhấn mạnh trong chương 2?",
        choices: [
          "Kỹ năng 'Chẻ củi' (Phân rã vấn đề)",
          "Tư duy Mục tiêu",
          "Năng lực Phân tích Kép",
          "Tất cả các kỹ năng trên",
        ],
        correctAnswer: 3,
      },
      {
        id: 27,
        question:
          "Trong dự án 'lập kế hoạch cho chiến dịch môi trường', tại sao việc 'Lựa chọn Chủ đề' lại được giao cho con người?",
        choices: [
          "Vì AI không thể đưa ra ý tưởng nào.",
          "Vì con người có khả năng đánh giá ý tưởng dựa trên bối cảnh thực tế của trường học, điều mà AI có thể không nắm được.",
          "Vì đây là công việc dễ nhất.",
          "Vì AI đã làm hết các việc khác rồi.",
        ],
        correctAnswer: 1,
      },
      {
        id: 28,
        question:
          "Giáo trình mô tả quá trình phân công hiệu quả là một 'điệu nhảy'. Điều này có nghĩa là gì?",
        choices: [
          "Đây là một quá trình cứng nhắc, có quy tắc rõ ràng.",
          "Đây là một sự phối hợp nhịp nhàng, linh hoạt và tương tác qua lại giữa người và AI.",
          "Đây là một hoạt động mang tính giải trí.",
          "Chỉ có một người dẫn dắt và người kia phải tuân theo tuyệt đối.",
        ],
        correctAnswer: 1,
      },
      {
        id: 29,
        question:
          "Hành động 'rà soát và hoàn thiện' bản kế hoạch chi tiết do AI tạo ra thể hiện vai trò nào của 'Trưởng nhóm'?",
        choices: [
          "Vai trò ra lệnh.",
          "Vai trò kiểm soát chất lượng và tư duy phản biện.",
          "Vai trò cung cấp dữ liệu.",
          "Vai trò tự động hóa.",
        ],
        correctAnswer: 1,
      },
      {
        id: 30,
        question:
          "Theo giáo trình, một 'trưởng nhóm' tồi khi làm việc với AI sẽ có hành vi nào sau đây?",
        choices: [
          "Phân công các nhiệm vụ một cách chiến lược.",
          "Giao hết mọi việc cho AI mà không cần suy nghĩ và tin tưởng tuyệt đối vào kết quả.",
          "Giữ lại các nhiệm vụ đòi hỏi tư duy phản biện cho mình.",
          "Chia nhỏ một vấn đề lớn thành các bước nhỏ.",
        ],
        correctAnswer: 1,
      },
      {
        id: 31,
        question:
          "Trước khi lên kế hoạch cho chuyến du lịch bằng AI, một người dùng đã tự liệt kê: ngân sách tối đa, thời gian đi, và các loại hoạt động ưa thích. Hành động này trực tiếp thể hiện bước nào trong 'Nghệ thuật Phân công'?",
        choices: [
          "Bước 1: Biết rõ Đích đến",
          "Bước 2: 'Biết mình, biết ta'",
          "Bước 3: Kỹ năng 'Chẻ củi'",
          "Thực chiến trong Xưởng Dự án",
        ],
        correctAnswer: 0,
      },
      {
        id: 32,
        question:
          "Theo nguyên tắc 'Biết mình, biết ta', tác vụ nào sau đây phù hợp nhất để con người (trưởng nhóm) đảm nhận?",
        choices: [
          "Tạo ra 50 tiêu đề blog khác nhau cho một bài viết.",
          "Dịch một tài liệu kỹ thuật dài 10 trang.",
          "Tóm tắt 20 bài đánh giá của khách hàng.",
          "Xác định và quyết định Tầm nhìn chiến lược cho một thương hiệu.",
        ],
        correctAnswer: 3,
      },
      {
        id: 33,
        question:
          "'Năng lực Phân tích Kép' (Biết mình, biết ta) hàm ý rằng kết quả tốt nhất đến từ đâu?",
        choices: [
          "Việc để AI tự quyết định mọi thứ.",
          "Việc con người tự làm mọi thứ và chỉ dùng AI để kiểm tra lỗi.",
          "Việc tận dụng thế mạnh của cả con người và AI một cách bổ trợ cho nhau.",
          "Việc chỉ chọn những công cụ AI mạnh nhất.",
        ],
        correctAnswer: 2,
      },
      {
        id: 34,
        question:
          "Một người muốn tạo một kế hoạch kinh doanh. Thay vì hỏi 'Tạo cho tôi một kế hoạch kinh doanh', người đó thực hiện theo chuỗi: 1. 'Liệt kê các mục chính của một kế hoạch kinh doanh chuẩn'. 2. 'Với mục 'Phân tích thị trường', hãy tìm 3 đối thủ cạnh tranh chính cho một quán cà phê ở Hà Nội'. 3. 'Soạn thảo phần tóm tắt dự án dựa trên các ý chính sau...'. Người dùng này đang thể hiện xuất sắc kỹ năng nào?",
        choices: [
          "Tư duy Mục tiêu",
          "Kỹ năng 'Chẻ củi' (Phân rã vấn đề)",
          "Năng lực Phân tích Kép",
          "Tất cả các phương án trên",
        ],
        correctAnswer: 1,
      },
      {
        id: 35,
        question:
          "Trong ví dụ về chiến dịch môi trường, quá trình làm việc được mô tả là một 'điệu nhảy' phối hợp nhịp nhàng. Điều này có nghĩa là gì?",
        choices: [
          "Con người và AI thay phiên nhau làm việc một cách độc lập.",
          "Đây là một quá trình tương tác liên tục, trong đó đầu ra của người này là đầu vào của người kia, tạo thành một vòng lặp sáng tạo.",
          "Quá trình này rất phức tạp và khó thực hiện.",
          "AI là người dẫn dắt chính trong 'điệu nhảy' này.",
        ],
        correctAnswer: 1,
      },
      {
        id: 36,
        question:
          "Một người dùng muốn viết một bài báo. Đầu tiên, họ xác định đối tượng độc giả và thông điệp chính (Biết đích đến). Tiếp theo, họ giao AI nghiên cứu số liệu trong khi họ tự phác thảo luận điểm chính (Biết mình, biết ta). Cuối cùng, họ yêu cầu AI soạn thảo từng phần nhỏ của bài báo (Chẻ củi). Quy trình này hiệu quả vì:",
        choices: [
          "Người dùng đã để AI làm hết mọi việc khó.",
          "Người dùng đã áp dụng một cách có hệ thống cả ba bước cốt lõi của 'Nghệ thuật Phân công'.",
          "Người dùng đã sử dụng công cụ AI đắt tiền nhất.",
          "Người dùng đã viết những prompt rất dài.",
        ],
        correctAnswer: 1,
      },
    ],
  },
];

interface PageProps {
  params: Promise<{
    category: string;
    quizId: string;
  }>;
}

export default async function QuizPage(props: PageProps) {
  const params = await props.params;
  const quiz = quizData.find((q) => q.id === params.quizId);

  if (!quiz) {
    notFound();
  }

  return <Quiz quiz={quiz} category={params.category} />;
}
