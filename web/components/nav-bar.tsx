"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { Button } from "./ui/button";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { signOut } from "@/lib/actions";

interface NavBarProps {
  currentPath: string;
  routeBack?: string;
}

export default function NavBar({ currentPath, routeBack }: NavBarProps) {
  const getTitle = (path: string) => {
    switch (path) {
      case "/":
        return "AI Lab Việt";
      case "/skill-hub":
        return "AI Skill Hub";
      case "/project-hub":
        return "AI Project Hub";
      case "/profile":
        return "Digital Profile";
      default:
        return "AI Skill Hub";
    }
  };

  const getDescription = (path: string) => {
    switch (path) {
      case "/":
        return "Chào mừng đến với AI Lab Việt";
      case "/skill-hub":
        return "Trung tâm Kỹ năng";
      case "/project-hub":
        return "Xưởng dự án";
      case "/profile":
        return "Hồ sơ năng lực số";
      default:
        return "Trung tâm Kỹ năng";
    }
  };

  const titleMarkup = useMemo(() => {
    return (
      <>
        <div>
          <h1 className=" font-bold text-xl bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">
            {getTitle(currentPath)}
          </h1>
          <p className="text-gray-500 text-sm">{getDescription(currentPath)}</p>
        </div>
      </>
    );
  }, [currentPath]);

  const handleLogout = useCallback(async () => {
    await signOut();
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/ai-lab-viet-logo.png"
                alt="AI Lab Việt"
                width={70}
                height={70}
              />
              {titleMarkup}
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/skill-hub"
              className={
                currentPath === "/skill-hub"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900 transition-colors"
              }
            >
              Học
            </Link>
            <Link
              href="/project-hub"
              className={
                currentPath === "/project-hub"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900 transition-colors"
              }
            >
              Hành
            </Link>
            <Link
              href="/profile"
              className={
                currentPath === "/profile"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-900 transition-colors"
              }
            >
              Chứng minh
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 focus:ring-0 focus:border-none focus:outline-none"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4 text-gray-500" />
                  Hồ sơ
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4 text-gray-500" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
