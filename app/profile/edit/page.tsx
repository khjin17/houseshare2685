"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { piSocial } from "@/lib/pi-social"
import { piNetwork } from "@/lib/pi-network"

export default function ProfileEditPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: "",
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    setIsLoading(true)
    try {
      const user = piSocial.getCurrentUser() || (await piNetwork.authenticate())
      
      if (user) {
        setFormData({
          username: user.username || "",
          email: "",
          phone: "",
          bio: "",
          avatarUrl: "",
        })
      }
    } catch (error) {
      console.error("[v0] Failed to load user profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      console.log("[v0] Profile updated:", formData)
      
      // Navigate back to profile
      router.push("/profile")
    } catch (error) {
      console.error("[v0] Failed to save profile:", error)
      alert("프로필 저장에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <BackButton title="프로필 수정" />

      <main className="px-4 py-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatarUrl || "/placeholder.svg?height=96&width=96"} />
                  <AvatarFallback className="text-2xl">
                    {formData.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={() => console.log("Upload avatar")}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">프로필 사진 변경</p>
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">사용자 이름</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="사용자 이름을 입력하세요"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="010-1234-5678"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">소개</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="자신을 소개해보세요"
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-6 space-y-3">
          <Button className="w-full h-12" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              "저장하기"
            )}
          </Button>
          <Button variant="outline" className="w-full h-12 bg-transparent" onClick={() => router.back()}>
            취소
          </Button>
        </div>
      </main>
    </div>
  )
}
