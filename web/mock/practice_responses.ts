export const mockPracticeResponses = {
  // Drag and drop task
  task_delegation_drag_drop_001: {
    task_id: 'task_delegation_drag_drop_001',
    task_type: 'drag_drop',
    status: 'in_progress',
    content: {
      title: 'Phân loại nhiệm vụ',
      instruction: 'Kéo các nhiệm vụ vào đúng cột tương ứng',
      categories: [
        {
          id: 'human',
          title: 'Công việc cho Trưởng nhóm (Con người)'
        },
        {
          id: 'ai',
          title: 'Công việc cho Thành viên AI'
        }
      ],
      items: [
        {
          id: 'item1',
          text: 'Xác định mục tiêu chiến lược',
          correct_category: 'human'
        },
        {
          id: 'item2',
          text: 'Tổng hợp dữ liệu từ nhiều nguồn',
          correct_category: 'ai'
        },
        {
          id: 'item3',
          text: 'Đánh giá tính đạo đức của sản phẩm',
          correct_category: 'human'
        },
        {
          id: 'item4',
          text: 'Soạn thảo bản nháp',
          correct_category: 'ai'
        },
        {
          id: 'item5',
          text: 'Tóm tắt nội dung từ văn bản dài',
          correct_category: 'ai'
        },
        {
          id: 'item6',
          text: 'Phê duyệt quyết định cuối cùng',
          correct_category: 'human'
        },
        {
          id: 'item7',
          text: 'Tạo ra nhiều phương án giải pháp',
          correct_category: 'ai'
        },
        {
          id: 'item8',
          text: 'Xác định bối cảnh thực tế của vấn đề',
          correct_category: 'human'
        },
        {
          id: 'item9',
          text: 'Kiểm tra tính chính xác của thông tin',
          correct_category: 'human'
        },
        {
          id: 'item10',
          text: 'Tạo hình ảnh minh họa',
          correct_category: 'ai'
        }
      ]
    }
  },

  // Analysis task
  task_goal_setting_analysis_002: {
    task_id: 'task_goal_setting_analysis_002',
    task_type: 'analysis',
    status: 'in_progress',
    content: {
      title: 'Phân tích hậu quả của việc không xác định rõ mục tiêu',
      scenario:
        "Một người dùng yêu cầu AI: 'Viết một bài về Trí tuệ nhân tạo'. AI tạo ra một bài viết học thuật dài, nhưng người dùng thực sự muốn một bài đăng mạng xã hội ngắn gọn để quảng bá doanh nghiệp AI của họ.",
      questions: [
        'Xác định vấn đề chính trong tình huống này?',
        'Người dùng đã bỏ qua yếu tố quan trọng nào?',
        'Cách tiếp cận nào sẽ hiệu quả hơn?'
      ],
      submission_type: 'text_area'
    }
  }
};
