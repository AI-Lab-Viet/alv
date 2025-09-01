import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  toggle: () => void;
}

const DialogSearch = (props: DialogProps) => {
  const { isOpen, toggle } = props;

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogPortal>
        <DialogOverlay />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tìm kiếm dự án</DialogTitle>
            <DialogDescription>
              Thử tìm kiếm theo tên, hoặc theo nhóm kỹ năng bạn muốn rèn luyện
            </DialogDescription>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Label>Tìm kiếm theo tên</Label>
                <Input
                  placeholder="Nhập tên dự án"
                  className="bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div>
                <Label>Lọc theo danh mục</Label>

                <Select>
                  <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-white/20">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="academic">Học thuật</SelectItem>
                    <SelectItem value="creative">Sáng tạo</SelectItem>
                    <SelectItem value="daily-life">Đời sống</SelectItem>
                    <SelectItem value="career">Hướng nghiệp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default DialogSearch;
