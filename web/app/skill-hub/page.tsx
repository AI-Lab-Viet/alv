"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Circle,
  Lock,
  BookOpen,
  Trophy,
  MapPin,
  Compass,
  Lightbulb,
  Crown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const userProgress = {
  completedStations: 3,
  totalStations: 6,
  currentStation: 4,
  userName: "LMQ",
};

const journeyStations = [
  // World 3: Pinnacle of Creation
  {
    id: 6,
    world: 3,
    worldName: "Đỉnh cao Sáng tạo",
    name: "Nghệ thuật Tổng hợp",
    chapter: "Chương 6",
    description: "Biến kết quả AI thành sản phẩm giá trị của riêng bạn",
    icon: Crown,
    status: "locked",
    color: "from-yellow-400 to-orange-500",
  },
  // World 2: Realm of Skills
  {
    id: 5,
    world: 2,
    worldName: "Lãnh địa Kỹ năng",
    name: "Nghệ thuật Trách nhiệm",
    chapter: "Chương 5",
    description: "Rèn luyện ý thức đạo đức và trách nhiệm",
    icon: Compass,
    status: "locked",
    color: "from-teal-400 to-green-500",
  },
  {
    id: 4,
    world: 2,
    worldName: "Lãnh địa Kỹ năng",
    name: "Nghệ thuật Nhận định",
    chapter: "Chương 4",
    description: "Rèn luyện tư duy phản biện và đánh giá chất lượng",
    icon: Trophy,
    status: localStorage.getItem("hasCompletedChapter4")
      ? "completed"
      : "current",
    color: "from-orange-400 to-red-500",
  },
  {
    id: 3,
    world: 2,
    worldName: "Lãnh địa Kỹ năng",
    name: "Nghệ thuật Mô tả",
    chapter: "Chương 3",
    description: "Rèn luyện kỹ năng giao tiếp chính xác với AI",
    icon: MapPin,
    status: "completed",
    color: "from-purple-400 to-pink-500",
  },
  {
    id: 2,
    world: 2,
    worldName: "Lãnh địa Kỹ năng",
    name: "Nghệ thuật Phân công",
    chapter: "Chương 2",
    description: "Rèn luyện tư duy chiến lược và lập kế hoạch",
    icon: Compass,
    status: "completed",
    color: "from-green-400 to-blue-500",
  },
  // World 1: Genesis of Thought
  {
    id: 1,
    world: 1,
    worldName: "Khởi nguồn Tư duy",
    name: "Nền tảng Tư duy",
    chapter: "Chương 1",
    description: "Hiểu tại sao cần học và những gì đang chờ đợi bạn",
    icon: Lightbulb,
    status: "completed",
    color: "from-blue-400 to-purple-600",
  },
];

// Coordinates matching your S-path (based on viewBox 0 0 600 1400)
const stationPositions = [
  { left: "70%", top: "15%" }, // Station 6 - top right of S
  { left: "40%", top: "18%" }, // Station 5 - left curve
  { left: "36%", top: "43%" }, // Station 4 - right curve
  { left: "55%", top: "57%" }, // Station 3 - left curve
  { left: "60%", top: "85%" }, // Station 2 - right curve
  { left: "33%", top: "86%" }, // Station 1 - bottom left of S
];

const getNextStation = () => {
  return journeyStations.find((station) => station.status === "current");
};

export default function SkillHubPage() {
  // const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [selectedStation, setSelectedStation] = useState<
    null | (typeof journeyStations)[0]
  >(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const progressPercentage =
    (userProgress.completedStations / userProgress.totalStations) * 100;
  const nextStation = getNextStation();

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Chào mừng trở lại, {userProgress.userName}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Hành trình rèn luyện năng lực AI của bạn đang tiếp tục
          </p>
        </div>

        {/* Progress Summary */}
        <Card className="mb-8 bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Tóm tắt Tiến trình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tiến độ hoàn thành</span>
                <span className="text-sm text-muted-foreground">
                  {userProgress.completedStations}/{userProgress.totalStations}{" "}
                  kỹ năng cốt lõi
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3 bg-muted" />
              <p className="text-sm text-muted-foreground">
                Bạn đã hoàn thành{" "}
                <strong>{userProgress.completedStations}</strong> trong tổng số{" "}
                <strong>{userProgress.totalStations}</strong> chặng hành trình
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Journey Map  */}
          <div className="lg:col-span-2">
            <Card className="bg-card text-card-foreground border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Bản đồ Hành trình
                </CardTitle>
                <CardDescription>
                  Con đường rèn luyện năng lực AI được chia thành 3 khu vực với
                  6 chặng đào tạo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[700px] overflow-hidden">
                  <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 600 800"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <path
                        d="M 450 100
                         C 350 50, 150 100, 150 250
                         C 150 400, 450 400, 450 550
                         C 450 700, 150 700, 150 650"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-border opacity-80"
                        strokeDasharray="10,5"
                      />
                    </svg>
                    <Image
                      src="/images/alva-flag.png"
                      width={150}
                      height={150}
                      alt="Alva Book"
                      className="hidden md:block pointer-events-none"
                      style={{
                        position: "absolute",
                        right: 25,
                        bottom: 25,
                        zIndex: 10,
                      }}
                    />
                  </div>

                  <div className="absolute left-[85%] top-[8%] -translate-x-1/2 text-center z-5">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border">
                      <div className="text-xl mb-1">🏔️</div>
                      <div className="text-xs font-bold text-primary">
                        Đỉnh cao Sáng tạo
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-[70%] top-[45%] -translate-x-1/2 text-center z-5">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border">
                      <div className="text-xl mb-1">⚔️</div>
                      <div className="text-xs font-bold text-secondary">
                        Lãnh địa Kỹ năng
                      </div>
                    </div>
                  </div>

                  <div className="absolute left-[15%] top-[78%] -translate-x-1/2 text-center z-5">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border">
                      <div className="text-xl mb-1">🌅</div>
                      <div className="text-xs font-bold text-blue-500">
                        Khởi nguồn Tư duy
                      </div>
                    </div>
                  </div>

                  {journeyStations.map((station, idx) => {
                    const IconComponent = station.icon;
                    const pos = stationPositions[idx];

                    return (
                      <button
                        key={station.id}
                        type="button"
                        style={{
                          position: "absolute",
                          left: pos.left,
                          top: pos.top,
                          transform: "translate(-50%, -50%)",
                          zIndex: 20,
                        }}
                        className={`
                          group flex flex-col items-center transition-all duration-300 hover:scale-110
                          ${station.status === "current" ? "opacity-100" : ""}
                          ${
                            station.status === "locked"
                              ? "opacity-60 cursor-not-allowed"
                              : station.status === "completed"
                              ? "opacity-70 cursor-not-allowed"
                              : "cursor-pointer hover:z-30"
                          }
                        `}
                        onClick={() =>
                          station.status === "current" &&
                          setSelectedStation(station)
                        }
                        disabled={
                          station.status === "locked" ||
                          station.status === "completed"
                        }
                        aria-label={station.name}
                      >
                        {/* Station Icon Circle */}
                        <div
                          className={`
                            relative p-4 rounded-full bg-gradient-to-br ${
                              station.color
                            } text-white shadow-xl
                            ${
                              station.status === "current"
                                ? "ring-4 ring-primary ring-offset-4 ring-offset-background"
                                : ""
                            }
                            ${
                              station.status === "completed"
                                ? "ring-3 ring-green-400 ring-offset-2 ring-offset-background"
                                : ""
                            }
                            transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105
                            border-2 border-white/20
                          `}
                        >
                          <IconComponent className="w-7 h-7" />

                          {/* Status Indicators */}
                          {station.status === "completed" && (
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}
                          {station.status === "current" && (
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                              <Circle className="w-4 h-4 text-white fill-current" />
                            </div>
                          )}
                          {station.status === "locked" && (
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-muted-foreground rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                              <Lock className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Station Chapter Label */}
                        <div className="mt-3 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <span className="text-xs font-bold text-foreground">
                            {station.chapter}
                          </span>
                        </div>

                        {/* Station Name on Hover */}
                        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="bg-foreground text-background px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-lg">
                            {station.name}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {nextStation && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="text-lg">
                    🚀 Tiếp tục Hành trình
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Trạm tiếp theo:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {nextStation.name}
                    </p>
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/skill-hub/dojo/${nextStation.id}`}>
                      Bắt đầu Rèn luyện
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Knowledge Treasury Access */}
            <Card className="bg-card text-card-foreground border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  Kho Báu Tri thức
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Truy cập thư viện tra cứu và tài liệu hỗ trợ học tập
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/skill-hub/knowledge-vault">
                    Khám phá Kho Báu
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card text-card-foreground border-border">
              <CardHeader>
                <CardTitle className="text-lg">📊 Thống kê nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Kỹ năng đã thành thạo</span>
                  <Badge variant="secondary">
                    {userProgress.completedStations}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tiến độ hoàn thành</span>
                  <Badge variant="outline">
                    {Math.round(progressPercentage)}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Khu vực hiện tại</span>
                  <Badge variant="default">
                    {nextStation ? nextStation.worldName : "Hoàn thành"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl="https://wojvcxygxpxocmtsxjbk.supabase.co/storage/v1/object/public/documents/Giao_Trinh_AI_Lab_Viet_new.pdf"
                // plugins={[defaultLayoutPluginInstance]}
              />
            </Worker> */}

            <Card className="bg-card text-card-foreground border-border">
              <CardHeader>
                <CardTitle className="text-lg">
                  💡 Truy cập giáo trình
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Tải về giáo trình chi tiết để học tập hiệu quả hơn
                </p>
                <Button
                  variant="outline"
                  className="w-full mb-4"
                  onClick={() => setShowPdfViewer(true)}
                >
                  Xem trực tiếp
                </Button>
                <Dialog open={showPdfViewer} onOpenChange={setShowPdfViewer}>
                  <DialogContent className="w-[2000px] h-[90vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Giáo trình AI Lab Việt</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 min-h-0">
                      <embed
                        src="https://wojvcxygxpxocmtsxjbk.supabase.co/storage/v1/object/public/documents/Giao_Trinh_AI_Lab_Viet_new.pdf"
                        type="application/pdf"
                        width="100%"
                        height="100%"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Station Details Modal */}
      <Dialog
        open={!!selectedStation}
        onOpenChange={() => setSelectedStation(null)}
      >
        <DialogContent className="max-w-md">
          {selectedStation && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${selectedStation.color} text-white`}
                  >
                    <selectedStation.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-left text-lg font-bold">
                      {selectedStation.name}
                    </DialogTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {selectedStation.chapter}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {selectedStation.worldName}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <div className="py-4">
                <p className="text-muted-foreground leading-relaxed">
                  {selectedStation.description}
                </p>

                {selectedStation.status === "completed" && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Đã hoàn thành</span>
                    </div>
                  </div>
                )}

                {selectedStation.status === "current" && (
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 text-primary">
                      <Circle className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">Đang học</span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="gap-2">
                {selectedStation.status === "current" && (
                  <Button asChild className="flex-1">
                    <Link href={`/skill-hub/dojo/${selectedStation.id}`}>
                      Bắt đầu
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedStation(null)}
                >
                  Đóng
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
