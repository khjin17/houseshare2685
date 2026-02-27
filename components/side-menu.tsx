"use client"

import Link from "next/link"
import { X, Home, Search, Heart, User, Settings, HelpCircle, Shield, FileText, LogOut, MapPin, Trophy, Sparkles, Award, UserPlus, Home as HomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { piSocial } from "@/lib/pi-social"

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const currentUser = piSocial.getCurrentUser()

  if (!isOpen) return null

  const menuItems = [
    { icon: Home, label: "홈", href: "/" },
    { icon: Search, label: "검색", href: "/" },
    { icon: Heart, label: "대시보드", href: "/dashboard" },
    { icon: User, label: "프로필", href: "/profile" },
    { icon: MapPin, label: "모든 기능", href: "/features" },
  ]

  const settingsItems = [
    { icon: Settings, label: "설정", href: "/settings/notifications" },
    { icon: Shield, label: "개인정보 보호", href: "/settings/privacy" },
    { icon: FileText, label: "이용약관", href: "/terms" },
    { icon: HelpCircle, label: "도움말", href: "/help" },
  ]

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Side Menu */}
      <div className="fixed inset-y-0 left-0 w-80 bg-background z-50 shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-xl">Menu</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile Card */}
          {currentUser && (
            <Card className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{currentUser.username?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{currentUser.username || "Guest"}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentUser.uid}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Main Menu Items */}
        <div className="p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-3">메인 메뉴</p>
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start h-12 gap-3">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Quick Access */}
        <div className="p-4 border-t space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-3">빠른 액세스</p>
          <Link href="/dashboard" onClick={onClose}>
            <Button variant="outline" className="w-full justify-start h-12 gap-3 bg-primary/5 border-primary/20">
              <Trophy className="h-5 w-5 text-primary" />
              <div className="text-left flex-1">
                <div className="font-semibold">내 대시보드</div>
                <div className="text-xs text-muted-foreground">레벨, 배지, 보상 확인</div>
              </div>
            </Button>
          </Link>
          <Link href="/features" onClick={onClose}>
            <Button variant="outline" className="w-full justify-start h-12 gap-3 bg-secondary border-secondary">
              <Sparkles className="h-5 w-5 shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">모든 기능 보기</div>
                <div className="text-xs text-muted-foreground truncate">파티, AI, 블록체인</div>
              </div>
            </Button>
          </Link>
          <Link href="/staking" onClick={onClose}>
            <Button variant="outline" className="w-full justify-start h-12 gap-3 bg-amber-500/5 border-amber-500/20">
              <Award className="h-5 w-5 text-amber-600 shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">Pi 스테이킹</div>
                <div className="text-xs text-muted-foreground truncate">예치하고 할인</div>
              </div>
            </Button>
          </Link>
          <Link href="/referral" onClick={onClose}>
            <Button variant="outline" className="w-full justify-start h-auto py-3 gap-3 bg-green-500/5 border-green-500/20">
              <UserPlus className="h-5 w-5 text-green-600 shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight">친구 초대</div>
                <div className="text-xs text-muted-foreground leading-tight break-all">π0.0000095 보상</div>
              </div>
            </Button>
          </Link>
          <Link href="/become-host" onClick={onClose}>
            <Button variant="outline" className="w-full justify-start h-auto py-3 gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
              <HomeIcon className="h-5 w-5 text-purple-600 shrink-0" />
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight">호스트 되기</div>
                <div className="text-xs text-muted-foreground leading-tight break-all">π0.000032 보너스</div>
              </div>
            </Button>
          </Link>
        </div>

        {/* Settings Menu Items */}
        <div className="p-4 border-t space-y-2">
          <p className="text-xs font-semibold text-muted-foreground mb-3">설정 및 지원</p>
          {settingsItems.map((item) => (
            <Link key={item.label} href={item.href} onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start h-12 gap-3 bg-transparent">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start h-12 gap-3 text-destructive">
            <LogOut className="h-5 w-5" />
            <span>로그아웃</span>
          </Button>
        </div>

        {/* App Version */}
        <div className="p-4 text-center text-xs text-muted-foreground">
          houseshare v1.0.0
        </div>
      </div>
    </>
  )
}
