"use client";

import { useActionState, useCallback } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Brain, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signUp } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang đăng ký...
        </>
      ) : (
        "Đăng ký"
      )}
    </Button>
  );
}

export default function SignUpForm() {
  // const [state, formAction] = useActionState(signUp, null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const formData = new FormData(e.currentTarget);
      const result = await signUp(formData);

      if (result?.error) {
        setError(result.error);
      }

      if (result?.success) {
        setSuccess(true);
        setLoading(false);
        router.push("/onboarding");
      }
    },
    [router]
  );

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex flex-row items-center  gap-[5vh]">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/images/ai-lab-viet-logo.png"
                alt="AI Lab Việt"
                width={100}
                height={100}
              />
            </Link>
            <div className="flex flex-col items-center ">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-blue-700 bg-clip-text text-transparent">
                Đăng ký
              </CardTitle>
              <p className="text-slate-600">Tạo tài khoản để bắt đầu học AI</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-green-700 text-sm">
                  Đăng ký thành công! Đang chuyển đến trang thiết lập hồ sơ...
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-blue-600 mr-3 mt-1"
                required
              />
              <span className="text-sm text-slate-600">
                Tôi đồng ý với{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-700"
                >
                  Chính sách bảo mật
                </Link>
              </span>
            </div>

            <SubmitButton />
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Đã có tài khoản?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-6">
        <Link href="/" className="text-slate-600 hover:text-slate-900 text-sm">
          ← Về trang chủ
        </Link>
      </div>
    </div>
  );
}
