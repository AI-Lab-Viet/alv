"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useChatSession } from "@/contexts/chat-session-context";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";

interface SubmissionModalProps {
  toggleSubmissionForm: () => void;
  missionId: string;
  handleCompleteObjective: (objective: string) => void;
  learningObjectives: string[];
}

export default function SubmissionModal({
  toggleSubmissionForm,
  missionId,
  handleCompleteObjective,
  learningObjectives,
}: SubmissionModalProps) {
  const { finishCurrentSession } = useChatSession();
  const [isLoading, setIsLoading] = useState(false);
  const [finalSubmission, setFinalSubmission] = useState("");
  const [reflection, setReflection] = useState("");

  async function handleSubmit() {
    try {
      setIsLoading(true);

      // Mark the last objective as completed
      if (learningObjectives.length > 0) {
        const lastObjective = learningObjectives[learningObjectives.length - 1];
        handleCompleteObjective(lastObjective);
      }

      await finishCurrentSession({ finalSubmission, reflection });
      toggleSubmissionForm();
      // router.push(`/project-hub/${missionId}?finished=true`);
    } catch (error) {
      console.error("Failed to finish session:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
            Nộp sản phẩm cuối cùng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Bạn đã chắc chưa? Nếu nộp sẽ không thể sửa hoặc xóa sản phẩm cuối
            cùng này.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              placeholder="Nhập mô tả sản phẩm cuối cùng của bạn ở đây..."
              value={finalSubmission}
              className="resize-none min-h-[200px]"
              onChange={(e) => setFinalSubmission(e.target.value)}
            />
            <Textarea
              placeholder="Viết vài dòng cảm nghĩ của bạn ở đây..."
              value={reflection}
              className="resize-none min-h-[200px]"
              onChange={(e) => setReflection(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={toggleSubmissionForm}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              // disabled={!finalSubmission.trim()}
              className="bg-gradient-to-r from-sky-300 to-blue-500 hover:from-slate-700 hover:to-blue-700 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Nộp dự án
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
