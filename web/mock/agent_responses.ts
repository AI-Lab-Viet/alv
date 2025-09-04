export const mockAgentResponses: Record<
  number,
  {
    state: number;
    response_text: string;
    task_id?: string;
    progress?: number;
    chapter_data?: any;
    interactive_content?: any;
  }
> = {
  // Step 1: Greeting from Master
  0: {
    state: 0,
    response_text:
      "Chào mừng Phong đến với võ đường 'Nghệ thuật Nhận định'! Đây là nơi chúng ta rèn luyện kỹ năng biến bạn từ một người dùng AI thành một người dẫn dắt AI: tư duy phản biện. Sẵn sàng chưa?",
    progress: 0,
  },

  // Step 2: Teaching "Bộ câu hỏi Vàng"
  1: {
    state: 1,
    response_text:
      "Tuyệt vời! Một nhà phản biện giỏi luôn có một bộ công cụ sắc bén. Để đánh giá sản phẩm của AI, chúng ta sẽ dùng 'Bộ câu hỏi Vàng'. Bạn hãy xem ở bên phải nhé.",
    progress: 15,
    chapter_data: {
      title: "Bộ câu hỏi Vàng",
      questions: [
        "1. Tính chính xác: Thông tin có đúng sự thật không?",
        "2. Độ Phù hợp: Có phù hợp với đối tượng và mục đích không?",
        "3. Độ Mạch lạc: Có logic và dễ hiểu không?",
        "4. Tính Đáp ứng: Có đủ các yêu cầu đã nêu không?",
        "5. Giá trị Gia tăng: Có mang lại điều bất ngờ tích cực không?",
      ],
    },
  },

  // Step 3: Practice 1 - Action 1 (Find error)
  2: {
    state: 2,
    response_text:
      "Giờ hãy dùng chính bộ câu hỏi đó để thực hành. Hãy tìm và click vào cụm từ sai trong đoạn văn ở bên phải.",
    progress: 30,
    interactive_content: {
      type: "clickable_text",
      text: "Vua Quang Trung, một trong những vị tướng vĩ đại nhất lịch sử, đã đại phá 29 vạn quân Thanh vào mùa hè rực lửa năm 1789",
      correct_answer: "mùa hè rực lửa năm 1789",
      clickable_words: [
        "Vua Quang Trung",
        "mùa hè rực lửa năm 1789",
        "29 vạn quân Thanh",
        "đại phá",
      ],
    },
  },

  // Step 3: Practice 1 - Action 2 (Identify criteria violation)
  3: {
    state: 3,
    response_text:
      "Chính xác! Bạn đã tìm ra được lỗi sai. Giờ hãy cho tôi biết, lỗi sai này vi phạm tiêu chí nào trong 'Bộ câu hỏi Vàng'?",
    progress: 40,
    interactive_content: {
      type: "multiple_choice",
      options: [
        "Tính chính xác",
        "Độ Phù hợp",
        "Độ Mạch lạc",
        "Tính Đáp ứng",
        "Giá trị Gia tăng",
      ],
      correct_answer: "Tính chính xác",
    },
  },

  // Step 4: Feedback & Transition
  4: {
    state: 4,
    response_text:
      "Hoàn hảo! Bạn không chỉ tìm ra được lỗi sai, mà còn xác định đúng vấn đề cốt lõi là 'Tính Chính xác'. Đây chính là tư duy của một nhà phản biện. Giờ hãy đến với 'thế võ' tiếp theo.",
    progress: 50,
  },

  // Step 5: Teaching "Red Flags"
  5: {
    state: 5,
    response_text:
      "Một nhà phản biện giỏi không chỉ nhìn vào kết quả, họ còn phân tích cả quá trình. Hãy học cách nhận diện các 'cờ đỏ' (red flags) trong tư duy của AI ở bên phải.",
    progress: 60,
    chapter_data: {
      title: "Các 'Cờ đỏ' trong tư duy AI",
      red_flags: [
        "Mâu thuẫn logic (Logical inconsistency): Lập luận ở đầu và cuối câu trái ngược nhau",
        "Lặp lại vòng tròn (Circular reasoning): Dùng chính kết luận để làm luận điểm",
        "Bỏ qua các bước quan trọng (Inappropriate steps): Đi thẳng đến kết luận mà không có các bước phân tích cần thiết",
      ],
    },
  },

  // Practice "Red Flags"
  6: {
    state: 6,
    response_text:
      "Thử thách nhỏ nhé! Đoạn văn ở bên phải đang mắc phải 'cờ đỏ' nào?",
    progress: 65,
    interactive_content: {
      type: "text_analysis",
      content:
        "AI không thể sáng tạo, nó chỉ lặp lại dữ liệu. Vì vậy, AI là một công cụ tuyệt vời để tạo ra những ý tưởng hoàn toàn mới và sáng tạo.",
      expected_answer: "Mâu thuẫn logic",
    },
  },

  // Step 6: Teaching "Công thức Phản hồi"
  7: {
    state: 7,
    response_text:
      "Khi đã tìm ra lỗi, chúng ta cần tinh chỉnh 'NHƯ THẾ NÀO'. Hãy xem 'Công thức Phản hồi' ở bên phải, đây là vũ khí tối thượng của bạn.",
    progress: 70,
    chapter_data: {
      title: "Công thức Phản hồi 4 bước",
      steps: [
        "1. Chỉ rõ vấn đề: Xác định cụ thể lỗi sai",
        "2. Giải thích tại sao nó là vấn đề: Nêu lý do",
        "3. Đưa ra gợi ý cải thiện cụ thể: Hướng dẫn sửa",
        "4. Cập nhật lại câu lệnh gốc (nếu cần): Điều chỉnh hướng dẫn",
      ],
    },
  },

  // Practice "Công thức Phản hồi"
  8: {
    state: 8,
    response_text:
      "Giờ hãy áp dụng công thức này để sửa lỗi về 'Vua Quang Trung' mà chúng ta đã tìm ra lúc nãy. Hãy viết một phản hồi đầy đủ 4 bước vào ô chat.",
    progress: 80,
    interactive_content: {
      type: "text_input",
      prompt:
        "Áp dụng Công thức Phản hồi 4 bước cho lỗi 'mùa hè rực lửa năm 1789'",
    },
  },

  // Step 7: Final Test
  9: {
    state: 9,
    response_text:
      "Bạn đã có đủ vũ khí. Giờ là lúc cho 'trận đấu tính điểm'! Hãy áp dụng 'Công thức Phản hồi' 4 bước cho tình huống ở bên phải.",
    progress: 90,
    interactive_content: {
      type: "final_test",
      scenario:
        "ALVA đã viết: 'Nhà thơ Tố Hữu là một trong những gương mặt tiêu biểu của phong trào Thơ mới.' Hãy viết một yêu cầu hoàn chỉnh để hướng dẫn ALVA sửa lại.",
      prompt: "Viết phản hồi theo Công thức 4 bước",
    },
  },

  // Step 8: Completion
  10: {
    state: 10,
    response_text:
      "Một phản hồi hoàn hảo! Bạn đã hoàn toàn làm chủ Nghệ thuật Nhận định! Chúc mừng bạn đã hoàn thành chặng này!",
    progress: 100,
    chapter_data: {
      completion: {
        badge: "Discernment Shield",
        achievement: "Nghệ thuật Nhận định - Hoàn thành",
        next_action: "Quay về Bản đồ Hành trình",
      },
    },
  },
};
