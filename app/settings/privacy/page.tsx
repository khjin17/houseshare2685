"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function PrivacyPage() {
  const [settings, setSettings] = useState({
    profileVisible: true,
    showActivity: false,
    allowMessages: true,
    dataCollection: true,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <BackButton title="개인정보 보호" />

      <main className="px-4 py-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>프로필 설정</CardTitle>
            <CardDescription>다른 사용자에게 표시되는 정보를 관리합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-visible" className="flex-1">
                <div>프로필 공개</div>
                <p className="text-sm text-muted-foreground font-normal">다른 사용자가 내 프로필을 볼 수 있습니다</p>
              </Label>
              <Switch
                id="profile-visible"
                checked={settings.profileVisible}
                onCheckedChange={() => handleToggle("profileVisible")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-activity" className="flex-1">
                <div>활동 내역 표시</div>
                <p className="text-sm text-muted-foreground font-normal">내 리뷰와 활동을 다른 사용자에게 보여줍니다</p>
              </Label>
              <Switch
                id="show-activity"
                checked={settings.showActivity}
                onCheckedChange={() => handleToggle("showActivity")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>메시지 설정</CardTitle>
            <CardDescription>메시지 수신 설정을 관리합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="allow-messages" className="flex-1">
                <div>메시지 허용</div>
                <p className="text-sm text-muted-foreground font-normal">호스트가 메시지를 보낼 수 있습니다</p>
              </Label>
              <Switch
                id="allow-messages"
                checked={settings.allowMessages}
                onCheckedChange={() => handleToggle("allowMessages")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>데이터 및 개인정보</CardTitle>
            <CardDescription>개인 데이터 관리</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="data-collection" className="flex-1">
                <div>사용 데이터 수집</div>
                <p className="text-sm text-muted-foreground font-normal">
                  앱 개선을 위한 익명 사용 데이터 수집에 동의합니다
                </p>
              </Label>
              <Switch
                id="data-collection"
                checked={settings.dataCollection}
                onCheckedChange={() => handleToggle("dataCollection")}
              />
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full justify-between h-12 bg-transparent">
                <span>내 데이터 다운로드</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between h-12 text-red-500 hover:text-red-600 bg-transparent">
                <span>계정 삭제</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
