import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Award,
  Brain,
  Lightbulb,
  Shield,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative z-10 px-4 py-4 ">
        <nav className="flex items-center justify-between max-w-7xl mx-auto lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/ai-lab-viet-logo.png"
                alt="AI Lab Việt"
                width={70}
                height={70}
              />
            </Link>
            <div>
              <h1 className="font-bold text-xl">AI Skill Hub</h1>
              <p className="text-gray-500 text-sm">Trung tâm Kỹ năng AI</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="/skill-hub"
              className="hover:text-purple-200 transition-colors"
            >
              Dự án
            </a>
            <a href="#" className="hover:text-purple-200 transition-colors">
              Portfolio
            </a>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-white/20 hover:bg-white/10 bg-transparent"
              >
                Đăng nhập
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full ai-icon"></div>
          <div
            className="absolute top-40 right-20 w-6 h-6 bg-purple-300/30 rounded-full ai-icon"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-3 h-3 bg-blue-300/40 rounded-full ai-icon"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-60 left-1/4 w-5 h-5 bg-pink-300/30 rounded-full ai-icon"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <div className="relative z-10 px-4 py-16 lg:px-8 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white">
                <Badge className="bg-purple-500/20 text-purple-100 border-purple-400/30 mb-6">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Fluency - Kỹ năng thời đại số
                </Badge>

                <h1 className="font-bold text-4xl lg:text-6xl mb-6 leading-tight">
                  Thành thạo AI với{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-500">
                    Trách nhiệm
                  </span>
                </h1>

                <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                  Nền tảng học tập toàn diện giúp bạn phát triển 4 kỹ năng cốt
                  lõi: Đặt câu hỏi hiệu quả, Tư duy phản biện, Sáng tạo và Đạo
                  đức AI.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="bg-white text-purple-700 hover:bg-purple-50 font-semibold"
                    >
                      Bắt đầu học ngay
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                  >
                    Tìm hiểu thêm
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 text-purple-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">58,000+</span>
                    <span>học viên</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-semibold">44</span>
                    <span>bài học</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">Chứng chỉ</span>
                    <span>AI Fluency</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Brain Illustration */}
              <div className="relative flex justify-center">
                <div className="relative">
                  <Image
                    src="/images/ai-brain.png"
                    alt="AI Brain Illustration"
                    width={500}
                    height={400}
                    className="w-full max-w-md h-auto"
                    priority
                  />

                  {/* Floating AI Icons */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center ai-icon">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className="absolute top-1/4 -left-6 w-10 h-10 bg-purple-400/20 backdrop-blur-sm rounded-full flex items-center justify-center ai-icon"
                    style={{ animationDelay: "1s" }}
                  >
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className="absolute bottom-1/4 -right-8 w-11 h-11 bg-pink-400/20 backdrop-blur-sm rounded-full flex items-center justify-center ai-icon"
                    style={{ animationDelay: "2s" }}
                  >
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className="absolute bottom-8 -left-4 w-9 h-9 bg-blue-400/20 backdrop-blur-sm rounded-full flex items-center justify-center ai-icon"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Skills Section */}
      <section className="py-20 px-4 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl lg:text-5xl text-gray-900 mb-6">
              4 Kỹ năng Cốt lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Phát triển toàn diện khả năng sử dụng AI một cách hiệu quả và có
              trách nhiệm
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-xl mb-4">Đặt câu hỏi</h3>
                <p className="text-gray-600 leading-relaxed">
                  Học cách tạo ra những câu lệnh hiệu quả, sử dụng kỹ thuật nhập
                  vai và chuỗi suy nghĩ
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-4">Tư duy Phản biện</h3>
                <p className="text-gray-600 leading-relaxed">
                  Nhận diện "ảo giác" của AI, kiểm chứng thông tin và đánh giá
                  chất lượng nội dung
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <Lightbulb className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-xl mb-4">Sáng tạo</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sử dụng AI để brainstorm ý tưởng, lập kế hoạch và vượt qua rào
                  cản sáng tạo
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-bold text-xl mb-4">Đạo đức AI</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sử dụng AI có trách nhiệm, duy trì tính trung thực và tôn
                  trọng bản quyền
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
