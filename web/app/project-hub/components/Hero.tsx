"use client";
import { Button } from "@/components/ui/button";
import useToggleDialog from "@/hooks/useToggleDialog";
import DialogSearch from "./DialogSearch";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import projectMainMascot from "@/public/images/mascot/project_main.png";

export default function Hero() {
  const [isOpenSearch, toggleSearch, shouldRenderSearch] = useToggleDialog();
  return (
    <section>
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative">
          <h1 className="font-semibold text-4xl lg:text-6xl mt-6 mb-6">
            <span className="bg-gradient-to-r from-slate-600 tracking-tighter to-blue-600 bg-clip-text text-transparent">
              Chào mừng đến với <br /> Xưởng thực chiến!
            </span>
          </h1>
          <p className="text-md text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Áp dụng kiến thức AI vào các dự án thực tế. Từ lập kế hoạch du lịch
            đến viết bài luận, mỗi nhiệm vụ giúp bạn rèn luyện kỹ năng AI
            Fluency.
          </p>

          {/* Search and Filter */}
          <footer className="flex flex-row gap-2 items-center justify-center">
            <Button variant={"default"} onClick={toggleSearch}>
              Tìm kiếm dự án
            </Button>
            <p>
              hoặc xem qua các{" "}
              <span className="font-semibold">dự án nổi bật</span>
            </p>
          </footer>
          <Image
            src={projectMainMascot}
            alt="Hero Mascot"
            className="absolute top-0 right-0 "
            width={150}
            height={150}
          />
        </div>
      </div>
      {shouldRenderSearch && (
        <DialogSearch isOpen={isOpenSearch} toggle={toggleSearch} />
      )}
    </section>
  );
}
