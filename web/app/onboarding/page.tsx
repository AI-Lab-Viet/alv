"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Heart, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

const personalityOptions = [
  {
    id: "curious",
    label: "Tò mò",
    description: "Thích khám phá và tìm hiểu điều mới",
  },
  {
    id: "analytical",
    label: "Phân tích",
    description: "Thích suy nghĩ logic và giải quyết vấn đề",
  },
  {
    id: "creative",
    label: "Sáng tạo",
    description: "Thích tạo ra những ý tưởng độc đáo",
  },
  {
    id: "practical",
    label: "Thực tế",
    description: "Thích ứng dụng kiến thức vào thực tiễn",
  },
  {
    id: "collaborative",
    label: "Hợp tác",
    description: "Thích làm việc nhóm và chia sẻ",
  },
  {
    id: "independent",
    label: "Độc lập",
    description: "Thích tự học và tự khám phá",
  },
];

const topicOptions = [
  { id: "technology", label: "Công nghệ", icon: "💻" },
  { id: "business", label: "Kinh doanh", icon: "💼" },
  { id: "education", label: "Giáo dục", icon: "📚" },
  { id: "healthcare", label: "Y tế", icon: "🏥" },
  { id: "arts", label: "Nghệ thuật", icon: "🎨" },
  { id: "science", label: "Khoa học", icon: "🔬" },
  { id: "finance", label: "Tài chính", icon: "💰" },
  { id: "marketing", label: "Marketing", icon: "📈" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    characteristic: [] as string[],
    hobby: [] as string[],
    goal: "",
  });

  const handlePersonalityChange = (personalityId: string) => {
    if (
      formData.characteristic.length >= 3 &&
      !formData.characteristic.includes(personalityId)
    ) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      characteristic: prev.characteristic.includes(personalityId)
        ? prev.characteristic.filter((p) => p !== personalityId)
        : [...prev.characteristic, personalityId],
    }));
  };

  const handleTopicChange = async (topicId: string) => {
    setFormData((prev) => ({
      ...prev,
      hobby: prev.hobby.includes(topicId)
        ? prev.hobby.filter((t) => t !== topicId)
        : [...prev.hobby, topicId],
    }));
    const { data } = await supabase.auth.getUser();
    console.log("User profile data:", data);
  };

  const handleSubmit = async () => {
    const { data } = await supabase.auth.getUser();
    // Here you would save the user profile data to Supabase
    console.log("User profile data:", formData);
    const { error } = await supabase
      .from("users")
      .update({
        full_name: formData.fullName,
        characteristic: formData.characteristic,
        hobby: formData.hobby,
        goal: formData.goal,
      })
      .eq("id", data.user?.id);

    // Redirect to skill-hub after completing onboarding
    router.push("/skill-hub");
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/images/ai-lab-viet-logo.png"
              alt="AI Lab Việt"
              width={100}
              height={100}
            />
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Bước {step} / 3</span>
            <span className="text-sm text-slate-600">
              {Math.round((step / 3) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-slate-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-blue-700 bg-clip-text text-transparent">
              {step === 1 && "Chào mừng đến với AI Lab Việt!"}
              {step === 2 && "Tính cách của bạn"}
              {step === 3 && "Sở thích và mục tiêu"}
            </CardTitle>
            <p className="text-slate-600">
              {step === 1 &&
                "Hãy cho chúng tôi biết thêm về bạn để cá nhân hóa trải nghiệm học tập"}
              {step === 2 &&
                "Chọn những đặc điểm phù hợp với tính cách của bạn"}
              {step === 3 &&
                "Chọn chủ đề yêu thích và chia sẻ mục tiêu học tập"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-slate-700 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Họ và tên
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="Nhập họ và tên của bạn"
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Personality */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {personalityOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handlePersonalityChange(option.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.characteristic.includes(option.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <h3 className="font-semibold text-slate-700">
                        {option.label}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {option.description}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 text-center">
                  Chọn tối đa 3 đặc điểm phù hợp nhất
                </p>
              </div>
            )}

            {/* Step 3: Topics and Goals */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-700 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Chủ đề yêu thích
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {topicOptions.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => handleTopicChange(topic.id)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                          formData.hobby.includes(topic.id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-2xl mb-1">{topic.icon}</div>
                        <div className="text-sm font-medium text-slate-700">
                          {topic.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="goals"
                    className="text-slate-700 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Mục tiêu học tập (tùy chọn)
                  </Label>
                  <Textarea
                    id="goals"
                    value={formData.goal}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        goal: e.target.value,
                      }))
                    }
                    placeholder="Chia sẻ mục tiêu học AI của bạn..."
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {step > 1 ? (
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={step === 1 && !formData.fullName}
                  className="bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700"
                >
                  Tiếp tục
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={formData.hobby.length === 0}
                  className="bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700"
                >
                  Hoàn thành
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
