import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

interface UserNoteProps {
  focusedPanel: 'sidebar' | 'chat' | 'note' | null;
  onPanelFocus: (panel: 'sidebar' | 'chat' | 'note' | null) => void;
  missionId: string;
}

export default function UserNote({ focusedPanel, onPanelFocus, missionId }: UserNoteProps) {
  return (
    <div
      className={`w-full h-full transition-all duration-300 ${focusedPanel && focusedPanel !== 'note' ? 'opacity-50' : 'opacity-100'}`}
      onClick={(e) => {
        e.stopPropagation();
        onPanelFocus('note');
      }}
    >
      <Card className="w-full h-full flex flex-col bg-white p-4 border-none rounded-none shadow-none">
        <CardTitle className="text-lg mb-4">Ghi chú của bạn</CardTitle>
        <CardContent className="flex-1 p-0">
          <textarea
            className="w-full h-full p-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Viết ghi chú của bạn ở đây..."
            defaultValue={missionId === "9" ? `Ok, hãy viết cho tôi về luận điểm 1

              Hãy đóng vai một nhà kinh tế học. Bối cảnh là cho slide đầu tiên của bài thuyết trình. Hãy viết một đoạn văn 200 từ giải thích về luận điểm 'AI tạo ra các loại hình công việc mới', kèm theo ví dụ cụ thể tại Việt Nam. Yêu cầu văn phong học thuật nhưng dễ hiểu.
              
              Thông tin về 'báo cáo của Viện Nghiên cứu Kinh tế Việt Nam' có vẻ không chính xác. 
              
              thêm một câu kết luận cân bằng, nhấn mạnh về cơ hội cho người lao động nếu chủ động học hỏi.
              
              tôi đã tổng hợp và thêm dấu ấn cá nhân, bạn xem và cho tôi nhận xét cuối nhé:
              (Mở đầu) Chào mừng thầy cô và các bạn. AI đang thay đổi thế giới, nhưng liệu nó đang lấy đi hay tạo ra cơ hội cho chúng ta?
              (Luận điểm 1) Thực tế cho thấy, AI đang là động lực kiến tạo việc làm mới. Tại Việt Nam, nhu cầu cho các vị trí như Kỹ sư Prompt hay chuyên gia AI đang tăng cao.
              (Kết luận) Tóm lại, dù AI đặt ra những thách thức, chìa khóa thành công là chủ động học hỏi và rèn luyện kỹ năng hợp tác sáng tạo. Cảm ơn mọi người đã lắng nghe.` : ""}
          ></textarea>
        </CardContent>
        <CardFooter className="pt-4 flex flex-row items-center justify-end gap-2 w-full">
          <Button variant={"ghost"}>Đánh giá</Button>
          <Button>Lưu ghi chú</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
