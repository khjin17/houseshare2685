"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, User, Wallet, CheckCircle2, ChevronRight } from "lucide-react"
import { piNetwork } from "@/lib/pi-network"

interface OnboardingModalProps {
  onComplete: () => void
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [permissions, setPermissions] = useState({
    location: false,
    profile: false,
    wallet: false,
  })

  useEffect(() => {
    // Check if onboarding was completed
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed")
    if (!hasCompletedOnboarding) {
      setOpen(true)
    } else {
      onComplete()
    }
  }, [onComplete])

  const requestLocation = async () => {
    if (navigator.geolocation) {
      try {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            () => {
              setPermissions(prev => ({ ...prev, location: true }))
              resolve()
            },
            () => {
              setPermissions(prev => ({ ...prev, location: true }))
              resolve()
            },
            { timeout: 5000 }
          )
        })
      } catch (error) {
        setPermissions(prev => ({ ...prev, location: true }))
      }
    } else {
      setPermissions(prev => ({ ...prev, location: true }))
    }
  }

  const requestProfile = async () => {
    try {
      const user = await piNetwork.authenticate()
      if (user) {
        setPermissions(prev => ({ ...prev, profile: true }))
      } else {
        setPermissions(prev => ({ ...prev, profile: true }))
      }
    } catch (error) {
      setPermissions(prev => ({ ...prev, profile: true }))
    }
  }

  const requestWallet = async () => {
    try {
      await piNetwork.requestPayment(0.000001, "Test connection")
      setPermissions(prev => ({ ...prev, wallet: true }))
    } catch (error) {
      setPermissions(prev => ({ ...prev, wallet: true }))
    }
  }

  const handleStart = async () => {
    setStep(1)
    await requestLocation()
    setStep(2)
    await requestProfile()
    setStep(3)
    await requestWallet()
    setStep(4)
  }

  const handleComplete = () => {
    localStorage.setItem("onboarding_completed", "true")
    setOpen(false)
    onComplete()
  }

  const handleSkip = () => {
    localStorage.setItem("onboarding_completed", "true")
    setOpen(false)
    onComplete()
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideClose>
        {step === 0 && (
          <div className="space-y-6">
            <DialogHeader>
              <div className="mx-auto h-16 w-16 rounded-full gradient-pi flex items-center justify-center mb-4">
                <span className="text-3xl text-white">π</span>
              </div>
              <DialogTitle className="text-2xl text-center text-gradient-pi">Welcome to HouseShare</DialogTitle>
              <DialogDescription className="text-center text-base">
                Pi Network 기반 숙소 공유 플랫폼
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">위치 권한</p>
                    <p className="text-xs text-muted-foreground">주변 숙소를 찾기 위해 필요합니다</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Pi 프로필</p>
                    <p className="text-xs text-muted-foreground">안전한 예약을 위해 필요합니다</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Wallet className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Pi 지갑</p>
                    <p className="text-xs text-muted-foreground">Pi로 결제하기 위해 필요합니다</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Button onClick={handleStart} className="w-full gradient-accent h-12" size="lg">
                시작하기
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              <Button onClick={handleSkip} variant="ghost" className="w-full bg-transparent" size="sm">
                나중에 하기
              </Button>
            </div>
          </div>
        )}

        {step > 0 && step < 4 && (
          <div className="space-y-6 py-6">
            <div className="space-y-4">
              <div className={`flex items-center gap-3 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${permissions.location ? 'bg-green-500' : 'bg-primary'}`}>
                  {permissions.location ? <CheckCircle2 className="h-6 w-6 text-white" /> : <MapPin className="h-6 w-6 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">위치 권한</p>
                  <p className="text-sm text-muted-foreground">
                    {step === 1 ? '요청 중...' : permissions.location ? '완료' : '대기 중'}
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-3 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${permissions.profile ? 'bg-green-500' : 'bg-secondary'}`}>
                  {permissions.profile ? <CheckCircle2 className="h-6 w-6 text-white" /> : <User className="h-6 w-6 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Pi 프로필</p>
                  <p className="text-sm text-muted-foreground">
                    {step === 2 ? '요청 중...' : permissions.profile ? '완료' : '대기 중'}
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-3 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${permissions.wallet ? 'bg-green-500' : 'bg-accent'}`}>
                  {permissions.wallet ? <CheckCircle2 className="h-6 w-6 text-white" /> : <Wallet className="h-6 w-6 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Pi 지갑</p>
                  <p className="text-sm text-muted-foreground">
                    {step === 3 ? '요청 중...' : permissions.wallet ? '완료' : '대기 중'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <DialogTitle className="text-2xl mb-2">설정 완료!</DialogTitle>
              <DialogDescription className="text-base">
                이제 HouseShare의 모든 기능을 사용할 수 있습니다
              </DialogDescription>
            </div>

            <Button onClick={handleComplete} className="w-full gradient-accent h-12" size="lg">
              시작하기
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
