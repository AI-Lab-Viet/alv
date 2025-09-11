import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

interface UserNoteProps {
  focusedPanel: 'sidebar' | 'chat' | 'note' | null;
  onPanelFocus: (panel: 'sidebar' | 'chat' | 'note' | null) => void;
}

export default function UserNote({ focusedPanel, onPanelFocus }: UserNoteProps) {
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
