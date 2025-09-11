export const mockAgentResponses: Record<number, {
  state: number;
  response_text: string;
  task_id?: string;
  progress?: number;
  chapter_data?: any;
}> = {
  // GREETING = 0
  0: {
    state: 0,
    response_text: "Xin chào! Tôi là ALVA, trợ lý AI của AI Lab Việt. Tôi sẽ đồng hành cùng bạn trong hành trình học tập. Bạn đã sẵn sàng khám phá chương này chưa?",
    progress: 0
  },
  
  // EXPLAINING_WHAT = 1
  1: {
    state: 1,
    response_text: "Tuyệt vời! Chúng ta sẽ bắt đầu với việc tìm hiểu khái niệm cơ bản của chương này.",
    progress: 15,
    chapter_data: {
      title: "Khái niệm Cơ bản",
      concept: "Hiểu rõ nền tảng",
      definition: "Đây là những kiến thức nền tảng bạn cần nắm vững để tiếp tục học tập hiệu quả.",
      key_points: [
        "Xác định vai trò của bạn trong quá trình học",
        "Hiểu cách thức hoạt động của AI",
        "Nắm vững các nguyên tắc cơ bản"
      ],
      explanation: "Việc hiểu rõ những khái niệm cơ bản sẽ giúp bạn xây dựng nền tảng vững chắc cho những kiến thức phức tạp hơn."
    }
  },

  // PRACTICING_WHAT = 2
  2: {
    state: 2,
    response_text: "Bây giờ hãy thực hành những gì chúng ta vừa học! Tôi đã chuẩn bị một bài tập thú vị cho bạn.",
    task_id: "practice_basic_001",
    progress: 30
  },

  // FEEDBACK_WHAT = 3
  3: {
    state: 3,
    response_text: "Tuyệt vời! Bạn đã hoàn thành bài tập rất tốt. Hãy tiếp tục với phần tiếp theo.",
    progress: 45
  },

  // EXPLAINING_WHY = 4
  4: {
    state: 4,
    response_text: "Bây giờ chúng ta sẽ tìm hiểu TẠI SAO những kiến thức này lại quan trọng.",
    progress: 60,
    chapter_data: {
      title: "Tầm Quan Trọng",
      concept: "Hiểu lý do",
      definition: "Việc hiểu rõ lý do giúp bạn áp dụng kiến thức một cách có ý thức và hiệu quả.",
      explanation: "Khi bạn hiểu được 'tại sao', bạn sẽ có động lực học tập mạnh mẽ hơn và ghi nhớ kiến thức lâu dài hơn.",
      example: "Ví dụ: Hiểu tại sao cần học cách giao tiếp với AI sẽ giúp bạn chủ động cải thiện kỹ năng này."
    }
  },

  // PRACTICING_WHY = 5
  5: {
    state: 5,
    response_text: "Hãy phân tích một tình huống thực tế để hiểu rõ hơn về tầm quan trọng của những kiến thức này.",
    task_id: "analysis_importance_002",
    progress: 75
  },

  // FEEDBACK_WHY = 6
  6: {
    state: 6,
    response_text: "Phân tích của bạn rất sâu sắc! Bạn đã nắm vững được tầm quan trọng của vấn đề.",
    progress: 85
  },

  // EXPLAINING_HOW = 7
  7: {
    state: 7,
    response_text: "Cuối cùng, chúng ta sẽ học cách áp dụng những kiến thức này vào thực tế.",
    progress: 90,
    chapter_data: {
      title: "Cách Thực Hiện",
      concept: "Áp dụng thực tế",
      definition: "Những bước cụ thể để áp dụng kiến thức vào công việc và cuộc sống hàng ngày.",
      steps: [
        "Bước 1: Xác định tình huống cần áp dụng",
        "Bước 2: Chọn phương pháp phù hợp",
        "Bước 3: Thực hiện và đánh giá kết quả",
        "Bước 4: Điều chỉnh và cải thiện"
      ],
      example: "Ví dụ: Áp dụng kỹ năng giao tiếp với AI để viết email chuyên nghiệp."
    }
  },

  // QUIZ = 8
  8: {
    state: 8,
    response_text: "Bây giờ chúng ta sẽ kiểm tra kiến thức của bạn thông qua một bài quiz ngắn.",
    task_id: "quiz_chapter_final",
    progress: 95
  },

  // COMPLETION = 9
  9: {
    state: 9,
    response_text: "Chúc mừng! Bạn đã hoàn thành chương học này một cách xuất sắc.",
    progress: 100,
    chapter_data: {
      completion: {
        score: 92,
        badge: "Knowledge Master",
        next_chapter: "Chương tiếp theo",
        achievements: [
          "Nắm vững kiến thức cơ bản",
          "Hiểu rõ tầm quan trọng của vấn đề",
          "Biết cách áp dụng vào thực tế"
        ]
      }
    }
  }
};