import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useChatSession } from "@/contexts/chat-session-context";
import { IFinishSessionResponse } from "@/interfaces/session.interface";
import { useRouter } from "next/navigation";

interface AnalysisModalProps {
  isOpen: boolean;
  toggleAnalysis: () => void;
  analysis: IFinishSessionResponse | undefined;
  missionId: string;
}

// Helper function to truncate text to approximately 30 words
const truncateText = (text: string, maxWords: number = 30): string => {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

export default function AnalysisModal({
  isOpen,
  toggleAnalysis,
  analysis,
  missionId,
}: AnalysisModalProps) {
  const router = useRouter();
  const { clearSession, clearAnalysis } = useChatSession();
  const handleCloseAndRedirect = () => {
    toggleAnalysis();
    clearAnalysis(); // Clear analysis data when modal is closed
    clearSession(); // Clear session when user navigates away
    router.push(`/project-hub/${missionId}`);
  };

  const handleViewPortfolio = () => {
    clearAnalysis(); // Clear analysis data when modal is closed
    clearSession(); // Clear session when user navigates to portfolio
    router.push(`/profile`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseAndRedirect}>
      <DialogPortal>
        <DialogOverlay />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chúc mừng!</DialogTitle>
            <DialogDescription>
              Chúc mừng bạn đã hoàn thành dự án: {analysis?.mission.title}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 max-h-64 overflow-y-auto mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {analysis?.portfolio.data_saved.final_product}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kỹ năng đã học được</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis?.portfolio.data_saved.skills_applied &&
                    analysis?.portfolio.data_saved.skills_applied.map(
                      (skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill}
                        </Badge>
                      )
                    )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prompt nổi bật</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 w-full">
                  {analysis?.portfolio.data_saved.key_prompts &&
                    analysis?.portfolio.data_saved.key_prompts.map(
                      (prompt, index) => (
                        <Badge
                          key={index}
                          className="break-words whitespace-pre-line max-w-full text-sm h-fit px-3 py-2"
                          style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
                        >
                          {prompt}
                        </Badge>
                      )
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-gray-500 text-right">
                Xem nhiều hơn ở Portofolio của bạn nhé
              </p>
              <div className="flex flex-row gap-4 items-center justify-end">
                <Button onClick={handleCloseAndRedirect} variant="outline">
                  Quay về Project Hub
                </Button>
                <Button onClick={handleViewPortfolio} variant="default">
                  Xem Portofolio
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
