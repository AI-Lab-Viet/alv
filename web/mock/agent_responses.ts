import outputData from './output.json';

export const mockAgentResponses: Record<
  number,
  {
    state: number;
    response_text: string;
    task_id?: string;
    progress?: number;
    chapter_data?: any;
  }
> = {
  // GREETING = 0
  0: {
    state: 0,
    response_text:
      'Xin chào! Tôi là ALVA, sư phụ AI sẽ đồng hành cùng bạn trong võ đường huấn luyện này. Bạn đã sẵn sàng bắt đầu hành trình rèn luyện Nghệ thuật Nhận định chưa?',
    progress: 0
  },

  // EXPLAINING_WHAT = 1
  1: {
    state: 1,
    response_text:
      'Tuyệt vời! Chúng ta sẽ bắt đầu với việc tìm hiểu **CÁI GÌ** là Nghệ thuật Nhận định. Hãy xem khung tri thức bên phải để hiểu rõ những khái niệm cơ bản nhé!',
    progress: 15,
    chapter_data: {
      type: 'document',
      section: 'what',
      content: outputData.filter((item) => item.section === 'what')
    }
  },

  // PRACTICING_WHAT = 2
  2: {
    state: 2,
    response_text:
      'Bây giờ hãy thực hành những gì chúng ta vừa học! Tôi có một thử thách thú vị để kiểm tra khả năng nhận định của bạn.',
    task_id: 'task_discernment_practice_001',
    progress: 35
  },

  // FEEDBACK_WHAT = 3
  3: {
    state: 3,
    response_text:
      "Xuất sắc! Bạn đã bắt đầu nắm vững cách áp dụng 'Bộ câu hỏi Vàng'. Bây giờ chúng ta sẽ đi sâu hơn để hiểu **TẠI SAO** Nghệ thuật Nhận định lại quan trọng đến vậy.",
    progress: 50
  },

  // EXPLAINING_WHY = 4
  4: {
    state: 4,
    response_text:
      "Hiểu được 'cái gì' chưa đủ. Bạn cần hiểu **TẠI SAO** việc nhận định lại cực kỳ quan trọng trong thời đại AI. Hãy xem những phân tích sâu sắc trong khung tri thức!",
    progress: 65,
    chapter_data: {
      type: 'document',
      section: 'why',
      content: outputData.filter((item) => item.section === 'why')
    }
  },

  // PRACTICING_WHY = 5
  5: {
    state: 5,
    response_text:
      'Bây giờ hãy phân tích một tình huống thực tế để hiểu sâu hơn về tầm quan trọng của việc kiểm tra quy trình tư duy của AI.',
    task_id: 'task_discernment_analysis_002',
    progress: 80
  },

  // FEEDBACK_WHY = 6
  6: {
    state: 6,
    response_text:
      'Tuyệt vời! Bạn đã hiểu rõ tầm quan trọng của việc không tin tưởng mù quáng vào AI. Cuối cùng, chúng ta sẽ học **NHƯ THẾ NÀO** để áp dụng các kỹ thuật này một cách thành thạo.',
    progress: 85
  },

  // EXPLAINING_HOW = 7
  7: {
    state: 7,
    response_text:
      "Đây là phần thực chiến! Bạn sẽ học cách áp dụng 'Công thức Phản hồi' và tạo ra vòng lặp Mô tả - Nhận định hoàn hảo.",
    progress: 90,
    chapter_data: {
      type: 'document',
      section: 'how',
      content: outputData.filter((item) => item.section === 'how')
    }
  },

  // QUIZ = 8
  8: {
    state: 8,
    response_text:
      'Đã đến lúc kiểm tra thành quả rèn luyện! Đây là bài sát hạch cuối cùng để kiểm tra mức độ thành thạo Nghệ thuật Nhận định của bạn.',
    task_id: 'quiz_chapter4_final',
    progress: 95
  },

  // COMPLETION = 9
  9: {
    state: 9,
    response_text:
      '🎉 Chúc mừng! Bạn đã hoàn thành xuất sắc Nghệ thuật Nhận định. Bạn giờ đây đã là một nhà phản biện sắc sảo!',
    progress: 100,
    chapter_data: {
      completion: {
        score: 95,
        badge: 'Nhà Phản biện Sắc sảo',
        next_chapter: 'Chương 5: Nghệ thuật Trách nhiệm',
        achievements: [
          'Thành thạo Bộ câu hỏi Vàng',
          'Nhận diện được các lỗi tư duy của AI',
          'Áp dụng thành công Công thức Phản hồi'
        ]
      }
    }
  }
};
