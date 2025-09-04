import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface SubmissionModalProps {
  isOpen: boolean;
  finalSubmission: string;
  setFinalSubmission: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function SubmissionModal({
  isOpen,
  finalSubmission,
  setFinalSubmission,
  onSubmit,
  onClose,
}: SubmissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
            Nộp sản phẩm cuối cùng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Sản phẩm hoàn thành
            </label>
            <Textarea
              value={finalSubmission}
              onChange={(e) => setFinalSubmission(e.target.value)}
              placeholder="Dán nội dung sản phẩm cuối cùng của bạn tại đây..."
              rows={10}
              className="bg-white/80 backdrop-blur-sm border-white/20"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              onClick={onSubmit}
              disabled={!finalSubmission.trim()}
              className="bg-gradient-to-r from-sky-300 to-blue-500 hover:from-slate-700 hover:to-blue-700 transition-all duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Nộp dự án
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
