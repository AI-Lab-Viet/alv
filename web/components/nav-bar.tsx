"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback, useMemo } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Home,
  BookOpen,
  Code,
  Trophy,
  ChevronDown,
  InfoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions";

interface NavBarProps {
  currentPath: string;
  routeBack?: string;
}

export default function NavBar({ currentPath, routeBack }: NavBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(currentPath !== "/");

  const navigationItems = useMemo(() => {
    return currentPath === "/" || currentPath.includes("/auth")
      ? [
          {
            title: "Trang chủ",
            href: "/",
            icon: Home,
            description: "Quay về trang chủ",
          },
          {
            title: "Về chúng tôi",
            href: "/about",
            icon: InfoIcon,
            description: "Tìm hiểu về AI Lab Việt",
          },
        ]
      : [
          {
            title: "Trang chủ",
            href: "/",
            icon: Home,
            description: "Quay về trang chủ",
          },
          {
            title: "Học",
            href: "/skill-hub",
            icon: BookOpen,
            description: "Trung tâm kỹ năng AI",
          },
          {
            title: "Hành",
            href: "/project-hub",
            icon: Code,
            description: "Xưởng dự án thực tế",
          },
          {
            title: "Chứng minh",
            href: "/profile",
            icon: Trophy,
            description: "Hồ sơ năng lực số",
          },
        ];
  }, [currentPath]);

  const getTitle = (path: string) => {
    const item = navigationItems.find((item) => item.href === path);
    return item?.title || "AI Lab Việt";
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
      <div>
        <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {getTitle(currentPath)}
        </h1>
        <p className="text-muted-foreground text-sm">
          {getDescription(currentPath)}
        </p>
      </div>
    );
  }, [currentPath]);

  const handleLogout = useCallback(async () => {
    await signOut();
  }, []);

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border flex-shrink-0 z-50 h-18">
      <div className="mx-auto px-4 py-2 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/ai-lab-viet-logo.png"
                alt="AI Lab Việt"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <div className="hidden sm:block">{titleMarkup}</div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  currentPath === item.href
                    ? "text-primary bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            ))}

            {showUserMenu && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-foreground hover:text-primary focus:ring-0 focus:border-none focus:outline-none"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        Q
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="end"
                  sideOffset={5}
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">LMQ</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        leminhquy@ailabviet.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      Hồ sơ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {/* Desktop User Menu */}
          </nav>

          {showUserMenu && (
            <div className="flex items-center gap-2 md:hidden">
              {/* Mobile User Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        Q
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="end"
                  sideOffset={5}
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">LMQ</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        leminhquy@ailabviet.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      Hồ sơ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Trigger */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <Link
                        href="/"
                        className="flex items-center gap-3"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Image
                          src="/images/ai-lab-viet-logo.png"
                          alt="AI Lab Việt"
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                        <div>
                          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            AI Lab Việt
                          </h1>
                          <p className="text-xs text-muted-foreground">
                            Nền tảng học AI
                          </p>
                        </div>
                      </Link>
                    </div>

                    {/* Mobile Navigation Items */}
                    <nav className="flex flex-col py-4 space-y-2 flex-1">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                            currentPath === item.href
                              ? "bg-accent text-primary border-l-4 border-primary"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span>{item.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile User Section */}
                    <div className="border-t border-border pt-4 mt-auto">
                      <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src="/placeholder-avatar.jpg"
                            alt="User"
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            Q
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium">LMQ</p>
                          <p className="text-xs text-muted-foreground">
                            leminhquy@ailabviet.com
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>Hồ sơ</span>
                        </Link>
                        <button className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full text-left">
                          <Settings className="h-4 w-4" />
                          <span>Cài đặt</span>
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
