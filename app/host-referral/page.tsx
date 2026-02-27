"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, 
  Gift, 
  TrendingUp, 
  Copy, 
  Check,
  Home,
  Trophy,
  Zap
} from "lucide-react"

export default function HostReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = "HOST-SARAH-2024"
  const referralLink = `https://houseshare.app/become-host?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stats = {
    referrals: 8,
    earnings: 0.000382,
    pending: 3,
  }

  const referredHosts = [
    { name: "John Kim", status: "active", earnings: 0.000048, date: "2024-01-15" },
    { name: "Lisa Park", status: "active", earnings: 0.000048, date: "2024-01-20" },
    { name: "Mike Chen", status: "pending", earnings: 0, date: "2024-01-28" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 border-b">
        <div className="container mx-auto px-4 py-3">
          <BackButton />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Hero */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl mb-2">호스트 초대 프로그램</h1>
              <p className="text-muted-foreground">
                친구를 호스트로 초대하고 π0.000048씩 받으세요
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.referrals}</p>
              <p className="text-xs text-muted-foreground">총 초대</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-lg font-bold text-green-600">π{stats.earnings.toFixed(6)}</p>
              <p className="text-xs text-muted-foreground">총 수익</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">대기 중</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">내 초대 링크</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="flex-1" />
              <Button onClick={handleCopy} size="icon">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              이 링크를 공유하면 친구가 호스트로 가입할 때 자동으로 연결됩니다
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              작동 방식
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium text-sm">링크 공유</p>
                <p className="text-xs text-muted-foreground">친구에게 초대 링크를 보내세요</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium text-sm">친구가 호스트 가입</p>
                <p className="text-xs text-muted-foreground">친구가 숙소를 등록하면 π0.000016 보너스 지급</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium text-sm">첫 예약 완료</p>
                <p className="text-xs text-muted-foreground">친구가 첫 예약을 받으면 추가 π0.000032 지급</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referred Hosts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">초대한 호스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {referredHosts.map((host) => (
              <div key={host.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{host.name}</p>
                    <p className="text-xs text-muted-foreground">{host.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={host.status === "active" ? "default" : "secondary"}>
                    {host.status === "active" ? "활성" : "대기중"}
                  </Badge>
                  {host.earnings > 0 && (
                    <p className="text-xs text-green-600 mt-1">+π{host.earnings.toFixed(6)}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Leaderboard Teaser */}
        <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="flex-1">
                <p className="font-semibold text-sm">상위 호스트 리더보드</p>
                <p className="text-xs text-muted-foreground">
                  이번 달 가장 많이 초대한 호스트에게 π0.000318 보너스
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
