"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    router.push("/auth/register");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Section 1: Hero Section - "Lời Chào Từ Tương Lai" */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center"
        style={{
          background:
            "linear-gradient(135deg, #d6eaf8 0%, #a9cce3 50%, #7fb3d3 100%)",
        }}
      >
        {/* Background decorative elements */}
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-6 h-6 bg-blue-500/25 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-3 h-3 bg-blue-600/30 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-60 left-1/4 w-5 h-5 bg-blue-400/20 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-60 right-1/3 w-4 h-4 bg-blue-500/25 rounded-full animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        <div className="relative z-10 px-4 py-16 lg:px-8 lg:py-24 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Bên trái (Text) */}
              <div className="text-gray-800 space-y-8">
                {/* Slogan Chính (Headline) */}
                <div className="space-y-4">
                  <h1 className="font-bold text-5xl lg:text-7xl leading-tight">
                    <span className="block text-gray-800">
                      Đồng hành cùng AI
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mt-2">
                      Dẫn lối sáng tạo Việt
                    </span>
                  </h1>
                </div>

                {/* Mô tả Phụ (Sub-headline) */}
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-2xl">
                  AI Lab Việt là nền tảng đầu tiên tại Việt Nam giúp bạn rèn
                  luyện tư duy và kỹ năng hợp tác sáng tạo cùng AI thông qua các
                  dự án thực chiến, được dẫn dắt bởi Huấn luyện viên AI - ALVA.
                </p>

                {/* Nút Kêu gọi Hành động (Call-to-Action - CTA) */}
                <div className="pt-4">
                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    🚀 Bắt đầu Hành trình Miễn phí
                  </Button>
                </div>

                {/* Additional trust indicators */}
                <div className="flex flex-wrap gap-6 pt-8 text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">100% Miễn phí</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Học thực hành</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Có chứng chỉ</span>
                  </div>
                </div>
              </div>

              {/* Bên phải (Visual) - Hình ảnh Avatar ALVA */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Main ALVA Avatar */}
                  <div className="relative z-10">
                    <Image
                      src="/landing-page/alva1.png"
                      alt="ALVA - Huấn luyện viên AI"
                      width={500}
                      height={500}
                      className="w-full max-w-lg h-auto animate-float"
                      priority
                    />
                  </div>

                  {/* Glowing background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-full blur-3xl scale-110 animate-pulse"></div>

                  {/* Floating elements around ALVA */}
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-blue-600/30 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-white text-2xl">🧠</span>
                  </div>

                  <div
                    className="absolute top-1/4 -left-8 w-12 h-12 bg-gradient-to-br from-blue-500/30 to-blue-700/30 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce"
                    style={{ animationDelay: "1s" }}
                  >
                    <span className="text-white text-xl">💡</span>
                  </div>

                  <div
                    className="absolute bottom-1/4 -right-6 w-14 h-14 bg-gradient-to-br from-blue-600/30 to-blue-800/30 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce"
                    style={{ animationDelay: "2s" }}
                  >
                    <span className="text-white text-xl">🚀</span>
                  </div>

                  <div
                    className="absolute bottom-8 -left-6 w-10 h-10 bg-gradient-to-br from-blue-500/30 to-blue-600/30 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <span className="text-white text-lg">⭐</span>
                  </div>

                  {/* Additional decorative circles */}
                  <div className="absolute top-12 right-1/3 w-6 h-6 bg-blue-400/20 rounded-full animate-ping"></div>
                  <div
                    className="absolute bottom-16 left-1/4 w-8 h-8 bg-blue-500/20 rounded-full animate-ping"
                    style={{ animationDelay: "1.5s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm">Khám phá thêm</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Section 2: The Problem - "Hành trình AI của bạn có đang đi đúng hướng?" */}
      <section className="py-20 px-4 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl lg:text-5xl text-gray-900 mb-6">
              Hành trình AI của bạn có đang đi đúng hướng?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Nhiều người đang sử dụng AI nhưng chưa thực sự hiểu rõ những rủi
              ro và cách tối ưu hóa hiệu quả
            </p>
          </div>

          {/* 3 Problem Columns */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Column 1: Lang thang không bản đồ */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl">🚫</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-2xl text-gray-900 mb-4">
                  Lang thang không bản đồ
                </h3>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed text-lg">
                  Bạn dùng AI một cách tự phát, không có phương pháp. Kết quả
                  lúc tốt lúc xấu, bạn không hiểu tại sao và không thể lặp lại
                  thành công một cách có chủ đích.
                </p>
              </div>
            </div>

            {/* Column 2: Trở thành "trợ lý" cho AI */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl">🎮</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-2xl text-gray-900 mb-4">
                  Trở thành "trợ lý" cho AI
                </h3>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed text-lg">
                  Thay vì dẫn dắt, bạn lại trở thành người làm các công việc phụ
                  cho AI: sửa lỗi sai, chấp vá các đoạn văn rời rạc. Bạn mất đi
                  vai trò chủ động và tự duy phán biến.
                </p>
              </div>
            </div>

            {/* Column 3: Sản phẩm thiếu góc nhìn riêng */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl">📄</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-2xl text-gray-900 mb-4">
                  Sản phẩm thiếu góc nhìn riêng
                </h3>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed text-lg">
                  Sản phẩm cuối cùng có thể dùng, nhưng lại chung chung, thiếu
                  đi góc nhìn độc đáo và dấu ấn cá nhân. Nó giống như hàng ngàn
                  sản phẩm khác do AI tạo ra và khó có thể đạt điểm cao hay gây
                  ấn tượng mạnh.
                </p>
              </div>
            </div>
          </div>

          {/* Call-to-Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <h3 className="font-bold text-2xl text-gray-900 mb-4">
                Đây có phải là câu chuyện của bạn?
              </h3>
              <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
                Nếu bạn nhận ra mình trong một trong những tình huống trên, đừng
                lo lắng. Hàng nghìn người đã vượt qua và thành công với phương
                pháp đúng đắn.
              </p>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-full">
                    Tìm hiểu giải pháp →
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The Solution - "Phép ẩn dụ Phòng Gym" */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl lg:text-6xl text-gray-900 mb-8 leading-tight">
              Dùng AI mà không có phương pháp,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                cũng như đi gym mà không có Huấn luyện viên.
              </span>
            </h2>
          </div>

          {/* Comparison Layout - 2 Parts */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Bên trái (Vấn đề) */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-200 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full opacity-50 transform translate-x-16 -translate-y-16"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl">⚠️</span>
                    </div>
                    <h3 className="font-bold text-2xl text-gray-900">
                      Vấn đề hiện tại
                    </h3>
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed">
                    Các công cụ AI như ChatGPT là một{" "}
                    <strong className="text-red-600">phòng gym</strong> đầy đủ
                    máy móc. Nhưng nếu không có người hướng dẫn, bạn sẽ chỉ dám
                    chạy bộ và không bao giờ xây dựng được cơ bắp thực sự.
                  </p>

                  {/* Visual elements */}
                  <div className="mt-8 flex justify-center">
                    <div className="text-6xl opacity-20">🏃‍♂️💨</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bên phải (Giải pháp) */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white text-2xl">✨</span>
                    </div>
                    <h3 className="font-bold text-2xl text-white">
                      Giải pháp AI Lab Việt
                    </h3>
                  </div>

                  <p className="text-lg text-blue-100 leading-relaxed mb-8">
                    AI Lab Việt chính là{" "}
                    <strong className="text-white">
                      Huấn luyện viên Cá nhân (PT)
                    </strong>{" "}
                    của bạn. Chúng tôi cung cấp lịch tập{" "}
                    <span className="text-cyan-200">(Giáo trình)</span>, sửa
                    form cho bạn tức thì{" "}
                    <span className="text-cyan-200">(ALVA)</span>, và ghi lại sự
                    tiến bộ của bạn{" "}
                    <span className="text-cyan-200">(Hồ sơ Năng lực)</span>.
                  </p>

                  {/* Feature highlights */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📋</span>
                      </div>
                      <span className="text-white font-medium">
                        Lịch tập có hệ thống (Giáo trình)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <span className="text-white font-medium">
                        Sửa form tức thì (ALVA)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📈</span>
                      </div>
                      <span className="text-white font-medium">
                        Theo dõi tiến bộ (Hồ sơ Năng lực)
                      </span>
                    </div>
                  </div>

                  {/* Visual elements */}
                  <div className="mt-8 flex justify-center">
                    <div className="text-6xl opacity-30">💪✨</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-4 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-200">
              <span className="text-lg text-gray-700">
                Sẵn sàng có một "Personal Trainer" cho AI?
              </span>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold px-6 py-2 rounded-full">
                    Bắt đầu ngay
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works - "Hành trình 3 Bước" */}
      <section className="py-20 px-4 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl lg:text-5xl text-gray-900 mb-6">
              Hành trình của bạn tại AI Lab Việt
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quy trình học tập có cấu trúc, từ nền tảng đến thành thạo, được
              thiết kế để đảm bảo bạn phát triển bền vững
            </p>
          </div>

          {/* Timeline - 3 Steps with Arrows */}
          <div className="relative">
            {/* Steps Container - 3 Equal Boxes with Arrows */}
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
              {/* Bước 1: HỌC (Learn) */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 relative h-full">
                  {/* Step Number Circle */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>

                  {/* Content */}
                  <div className="pt-8 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white text-3xl">📚</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-2xl text-gray-900 mb-4">
                      HỌC <span className="text-blue-600">(Learn)</span>
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Rèn luyện tư duy nền tảng và các kỹ năng cốt lõi trong{" "}
                      <strong className="text-blue-600">
                        Võ đường Huấn luyện
                      </strong>{" "}
                      cùng Sư phụ ALVA.
                    </p>

                    {/* Features */}
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Tư duy nền tảng AI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>4 kỹ năng cốt lõi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Hướng dẫn từ ALVA</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow 1: HỌC -> HÀNH */}
                <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex items-center">
                    <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-green-400"></div>
                    <div className="w-0 h-0 border-l-[12px] border-l-green-400 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Bước 2: HÀNH (Practice) */}
              <div className="relative">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 relative h-full">
                  {/* Step Number Circle */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>

                  {/* Content */}
                  <div className="pt-8 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white text-3xl">🛠️</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-2xl text-gray-900 mb-4">
                      HÀNH <span className="text-green-600">(Practice)</span>
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Áp dụng kiến thức vào các dự án thực tế trong{" "}
                      <strong className="text-green-600">
                        Xưởng Thực chiến
                      </strong>{" "}
                      cùng Cộng sự ALVA.
                    </p>

                    {/* Features */}
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Dự án thực tế</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Phản hồi tức thì</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Hỗ trợ từ ALVA</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow 2: HÀNH -> CHỨNG MINH */}
                <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="flex items-center">
                    <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-purple-400"></div>
                    <div className="w-0 h-0 border-l-[12px] border-l-purple-400 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Bước 3: CHỨNG MINH (Prove) */}
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 relative h-full">
                  {/* Step Number Circle */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>

                  {/* Content */}
                  <div className="pt-8 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white text-3xl">🏆</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-2xl text-gray-900 mb-4">
                      CHỨNG MINH{" "}
                      <span className="text-purple-600">(Prove)</span>
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Xây dựng{" "}
                      <strong className="text-purple-600">
                        Hồ sơ Năng lực Số
                      </strong>
                      , trưng bày các bằng chứng xác thực về sự trưởng thành của
                      bạn.
                    </p>

                    {/* Features */}
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Portfolio cá nhân</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Chứng chỉ AI Fluency</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>Bằng chứng năng lực</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 bg-gray-100 rounded-full px-8 py-4">
              <span className="text-gray-700 font-medium">
                Thời gian hoàn thành:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <span className="font-bold text-blue-600 text-lg">
                  4-6 tuần
                </span>
              </div>
              <span className="text-gray-600">cho người mới bắt đầu</span>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                  🚀 Bắt đầu Hành trình Ngay hôm nay
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Section 5: The Secret Sauce - "Giới thiệu Framework 4D+S" */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl lg:text-5xl text-gray-900 mb-6 leading-tight">
              Gặp gỡ Framework{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                4D+S
              </span>
              : La bàn cho Nhà Cộng tác AI Sáng tạo
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Bên trái (Visual) - Framework Diagrams */}
            <div className="relative">
              <div className="space-y-8">
                {/* Framework 4D+S Diagram */}
                <div className="relative group">
                  <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500">
                    <div className="relative">
                      <Image
                        src="/landing-page/alv_4d_s_framework.jpg"
                        alt="Framework 4D+S"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-2xl"
                        priority
                      />

                      {/* Interactive Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Caption */}
                    <div className="mt-4 text-center">
                      <p className="font-semibold text-gray-700">
                        Framework 4D+S Tổng quan
                      </p>
                      <p className="text-sm text-gray-500">
                        4 Kỹ năng cốt lõi + Synthesis
                      </p>
                    </div>
                  </div>
                </div>

                {/* S Framework Detail */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 shadow-xl border border-yellow-200 hover:shadow-2xl transition-all duration-500">
                    <div className="relative">
                      <Image
                        src="/landing-page/s.jpg"
                        alt="S Framework - Synthesis"
                        width={600}
                        height={300}
                        className="w-full h-auto rounded-2xl"
                      />

                      {/* Interactive Hover Effect */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                          <span className="text-4xl font-bold text-yellow-600">
                            S
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Caption */}
                    <div className="mt-4 text-center">
                      <p className="font-semibold text-gray-700">
                        "+S" - Mảnh ghép Việt Nam
                      </p>
                      <p className="text-sm text-gray-500">
                        Synthesis & Sáng tạo
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
              <div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            {/* Bên phải (Text) */}
            <div className="space-y-8">
              {/* Main Content */}
              <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-200">
                <div className="space-y-6">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
                    <span className="text-2xl">🇻🇳</span>
                    <span className="font-semibold text-gray-700">
                      Tài sản Trí tuệ Việt Nam
                    </span>
                  </div>

                  {/* Main Description */}
                  <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
                    Được truyền cảm hứng từ nền tảng 4D của thế giới, chúng tôi
                    bổ sung vào đó mảnh ghép{" "}
                    <strong className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                      +S (Synthesis)
                    </strong>{" "}
                    - kỹ năng Tổng hợp & Sáng tạo.
                  </p>

                  <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed">
                    Chữ{" "}
                    <strong className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 text-3xl">
                      S
                    </strong>{" "}
                    còn là biểu tượng của dải đất Việt Nam, là cam kết của chúng
                    tôi trong việc trao quyền cho trí tuệ Việt.
                  </p>

                  {/* Key Features */}
                  <div className="space-y-4 pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">4D</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          4 Kỹ năng Cốt lõi
                        </h4>
                        <p className="text-gray-600">
                          Delegation, Description, Discernment, Diligence
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">S</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">
                          +S Synthesis
                        </h4>
                        <p className="text-gray-600">
                          Tổng hợp & Sáng tạo - Bản sắc Việt Nam
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-6">
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                          🌟 Khám phá Framework 4D+S
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white text-center shadow-xl">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl">🏆</span>
                  <h3 className="font-bold text-xl">Độc nhất tại Việt Nam</h3>
                </div>
                <p className="text-yellow-100">
                  Framework AI đầu tiên được phát triển bởi và cho người Việt
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: The Pay-off - "Trưng bày Hồ sơ Năng lực" */}
      <section className="py-20 px-4 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl lg:text-6xl text-gray-900 mb-6 leading-tight">
              Không chỉ là Chứng chỉ.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Đây là Bằng chứng Năng lực.
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Hồ sơ Năng lực Số của bạn - minh chứng cụ thể về khả năng hợp tác
              sáng tạo cùng AI
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-6"></div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left Side - Portfolio Preview (3 columns) */}
            <div className="lg:col-span-3">
              <div className="relative group">
                {/* Main Portfolio Image */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500">
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src="/landing-page/profile.jpg"
                      alt="Demo Hồ sơ Năng lực - Portfolio"
                      width={800}
                      height={600}
                      className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                      priority
                    />

                    {/* Overlay with zoom hint */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-lg">🔍</span>
                          <span className="font-medium">Xem chi tiết</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Caption */}
                  <div className="mt-6 text-center">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">
                      Hồ sơ Năng lực Số - Demo
                    </h3>
                    <p className="text-gray-600">
                      Chiến dịch truyền thông cho CLB Sách
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full animate-pulse"></div>
                <div
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>

            {/* Right Side - Features & Benefits (2 columns) */}
            <div className="lg:col-span-2 space-y-8">
              {/* What's Included */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 border border-gray-200">
                <h3 className="font-bold text-2xl text-gray-900 mb-6">
                  📋 Nội dung Hồ sơ
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">🎯</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        Sản phẩm Hoàn chỉnh
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Kết quả thực tế từ dự án với AI
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">💬</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        Câu lệnh Tiêu biểu
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Prompts hiệu quả đã sử dụng
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">💡</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        Suy ngẫm & Bài học
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Quá trình học hỏi và phát triển
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">🏷️</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">
                        Kỹ năng đã Thể hiện
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Tags các kỹ năng 4D+S đã áp dụng
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Proposition */}
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl p-8 text-white">
                <h3 className="font-bold text-2xl mb-6">🌟 Giá trị Thực tế</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <span className="font-medium">
                      Chứng minh năng lực với nhà tuyển dụng
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <span className="font-medium">
                      Portfolio cá nhân độc đáo
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <span className="font-medium">
                      Kỹ năng AI được xác thực
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <span className="font-medium">
                      Lợi thế cạnh tranh trên thị trường
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-purple-100 text-sm italic">
                    "Hơn 85% nhà tuyển dụng tìm kiếm ứng viên có kỹ năng AI. Hồ
                    sơ của bạn sẽ là minh chứng mạnh mẽ nhất."
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 w-full">
                      🎯 Bắt đầu Xây dựng Hồ sơ Ngay
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                100%
              </div>
              <div className="text-gray-700 font-medium">
                Học viên hoàn thành có Portfolio
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">3-5</div>
              <div className="text-gray-700 font-medium">
                Dự án thực tế trong Hồ sơ
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-purple-50 rounded-2xl p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-700 font-medium">
                Nhà tuyển dụng quan tâm kỹ năng AI
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Final Call-to-Action - "Lời Mời Cuối cùng" */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0A1931 0%, #1B2951 50%, #2A4C7A 100%)",
        }}
      >
        {/* Animated Background Effects */}
        <div className="absolute inset-0">
          {/* Light rays */}
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-blue-400/20 to-transparent transform rotate-12 animate-pulse"></div>
          <div
            className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-cyan-400/15 to-transparent transform -rotate-12 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-blue-300/10 to-transparent animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Galaxy/star effects */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
          <div
            className="absolute top-40 right-32 w-1 h-1 bg-blue-300 rounded-full animate-ping"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute top-60 right-20 w-1 h-1 bg-cyan-300 rounded-full animate-ping"
            style={{ animationDelay: "2.5s" }}
          ></div>
          <div
            className="absolute bottom-48 right-1/4 w-2 h-2 bg-blue-200 rounded-full animate-ping"
            style={{ animationDelay: "3s" }}
          ></div>

          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 px-4 lg:px-8 w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Main Headline */}
              <h1 className="font-bold text-5xl lg:text-7xl text-white leading-tight">
                <span className="block">Sẵn sàng để</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 mt-2">
                  dẫn lối sự sáng tạo?
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                Hành trình trở thành Nhà Kiến tạo bắt đầu chỉ với một cú click.
                Tham gia cộng đồng của chúng tôi, bắt đầu rèn luyện miễn phí và
                xây dựng Hồ sơ Năng lực của riêng bạn ngay hôm nay.
              </p>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start text-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <span className="font-medium">100% Miễn phí</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  <span className="font-medium">Bắt đầu ngay lập tức</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <span className="font-medium">Có chứng chỉ</span>
                </div>
              </div>

              {/* Main CTA Button */}
              <div className="pt-8" onClick={handleSubmit}>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <button
                      className="group relative bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-bold text-xl lg:text-2xl px-12 py-6 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-cyan-500/50 overflow-hidden"
                      style={{
                        boxShadow:
                          "0 0 30px rgba(34, 211, 238, 0.3), 0 0 60px rgba(59, 130, 246, 0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 0 40px rgba(34, 211, 238, 0.6), 0 0 80px rgba(59, 130, 246, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 0 30px rgba(34, 211, 238, 0.3), 0 0 60px rgba(59, 130, 246, 0.2)";
                      }}
                    >
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Button content */}
                      <span className="relative flex items-center gap-3">
                        <span className="text-3xl">🌟</span>
                        Đăng ký & Bắt đầu Miễn phí
                        <span className="text-2xl">→</span>
                      </span>
                    </button>
                  </DialogTrigger>
                </Dialog>
              </div>

              {/* Secondary info */}
              <p className="text-sm text-blue-300 opacity-80">
                Không cần thẻ tín dụng • Truy cập ngay lập tức • Hỗ trợ 24/7
              </p>
            </div>

            {/* Right Side - ALVA Avatar */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Main ALVA Avatar */}
                <div className="relative z-10">
                  <Image
                    src="/landing-page/alva2.png"
                    alt="ALVA - Huấn luyện viên AI"
                    width={600}
                    height={600}
                    className="w-full max-w-lg h-auto animate-float"
                    priority
                  />
                </div>

                {/* Glowing aura effect */}
                <div className="absolute inset-0 bg-gradient-radial from-cyan-400/30 via-blue-500/20 to-transparent rounded-full blur-3xl scale-150 animate-pulse"></div>

                {/* Floating particles around ALVA */}
                <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-cyan-400/40 to-blue-500/40 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-3xl">🚀</span>
                </div>

                <div
                  className="absolute top-1/4 -left-12 w-16 h-16 bg-gradient-to-br from-blue-400/40 to-cyan-500/40 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce"
                  style={{ animationDelay: "1s" }}
                >
                  <span className="text-white text-2xl">⭐</span>
                </div>

                <div
                  className="absolute bottom-1/4 -right-10 w-18 h-18 bg-gradient-to-br from-cyan-500/40 to-blue-600/40 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce"
                  style={{ animationDelay: "2s" }}
                >
                  <span className="text-white text-2xl">💎</span>
                </div>

                <div
                  className="absolute bottom-12 -left-8 w-14 h-14 bg-gradient-to-br from-blue-500/40 to-cyan-400/40 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                >
                  <span className="text-white text-xl">🌟</span>
                </div>

                {/* Additional sparkle effects */}
                <div className="absolute top-16 right-1/3 w-8 h-8 bg-cyan-300/30 rounded-full animate-ping"></div>
                <div
                  className="absolute bottom-20 left-1/4 w-10 h-10 bg-blue-300/30 rounded-full animate-ping"
                  style={{ animationDelay: "1.5s" }}
                ></div>
                <div
                  className="absolute top-1/2 right-8 w-6 h-6 bg-cyan-400/30 rounded-full animate-ping"
                  style={{ animationDelay: "2.5s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-blue-300/60">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm">Bắt đầu hành trình</span>
            <div className="w-6 h-10 border-2 border-blue-300/40 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-blue-300/60 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
              {/* Column 1: Về AI Lab Việt */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-xl mb-4 text-cyan-400">
                    AI Lab Việt
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Nền tảng đầu tiên tại Việt Nam giúp bạn rèn luyện tư duy và
                    kỹ năng hợp tác sáng tạo cùng AI thông qua Framework 4D+S
                    độc quyền.
                  </p>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="font-semibold text-white mb-3">
                    Kết nối với chúng tôi
                  </h4>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <span className="text-white text-lg">📘</span>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                    >
                      <span className="text-white text-lg">📺</span>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                    >
                      <span className="text-white text-lg">🐦</span>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                    >
                      <span className="text-white text-lg">📷</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Column 2: Về chúng tôi */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white">Về chúng tôi</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/about"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Câu chuyện AI Lab Việt
                    </a>
                  </li>
                  <li>
                    <a
                      href="/team"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Đội ngũ sáng lập
                    </a>
                  </li>
                  <li>
                    <a
                      href="/mission"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Sứ mệnh & Tầm nhìn
                    </a>
                  </li>
                  <li>
                    <a
                      href="/blog"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Blog & Tin tức
                    </a>
                  </li>
                  <li>
                    <a
                      href="/careers"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Tuyển dụng
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Học tập */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white">Học tập</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/skill-hub"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Võ đường Huấn luyện
                    </a>
                  </li>
                  <li>
                    <a
                      href="/project-hub"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Xưởng Thực chiến
                    </a>
                  </li>
                  <li>
                    <a
                      href="/portfolio"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Hồ sơ Năng lực
                    </a>
                  </li>
                  <li>
                    <a
                      href="/framework"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Framework 4D+S
                    </a>
                  </li>
                  <li>
                    <a
                      href="/alva"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Gặp gỡ ALVA
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4: Hỗ trợ */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white">Hỗ trợ</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/help"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Trung tâm Hỗ trợ
                    </a>
                  </li>
                  <li>
                    <a
                      href="/faq"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Câu hỏi thường gặp
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Liên hệ
                    </a>
                  </li>
                  <li>
                    <a
                      href="/community"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Cộng đồng
                    </a>
                  </li>
                  <li>
                    <a
                      href="/feedback"
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                    >
                      Phản hồi
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="py-12 border-t border-gray-800">
            <div className="text-center space-y-6">
              <div>
                <h3 className="font-bold text-2xl text-white mb-3">
                  📮 Đăng ký nhận tin tức mới nhất
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Nhận thông tin về khóa học mới, tips AI hữu ích và các cập
                  nhật quan trọng từ AI Lab Việt
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                  />
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
                    Đăng ký
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-8 border-t border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              {/* Copyright */}
              <div className="text-gray-400 text-sm text-center lg:text-left">
                <p>© 2025 AI Lab Việt. Tất cả quyền được bảo lưu.</p>
                <p className="mt-1">Made with ❤️ for Vietnamese AI Community</p>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap gap-6 text-sm">
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Chính sách Bảo mật
                </a>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Điều khoản Dịch vụ
                </a>
                <a
                  href="/cookies"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Chính sách Cookie
                </a>
                <a
                  href="/accessibility"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  Khả năng tiếp cận
                </a>
              </div>
            </div>
          </div>

          {/* Vietnamese Pride Badge */}
          <div className="pb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 px-4 py-2 rounded-full">
              <span className="text-white font-semibold text-sm">🇻🇳</span>
              <span className="text-white font-semibold text-sm">
                Proudly Made in Vietnam
              </span>
              <span className="text-white font-semibold text-sm">🇻🇳</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
