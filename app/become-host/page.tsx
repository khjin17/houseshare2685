"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HostEarningsCalculator } from "@/components/host-earnings-calculator"
import { 
  Home, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react"

export default function BecomeHostPage() {
  const benefits = [
    {
      icon: Zap,
      title: "1분 만에 등록",
      description: "사진 업로드만 하면 AI가 자동으로 설명 작성",
      color: "text-yellow-600"
    },
    {
      icon: TrendingUp,
      title: "높은 수익",
      description: "5% 수수료로 업계 최저, Pi로 즉시 정산",
      color: "text-green-600"
    },
    {
      icon: Shield,
      title: "호스트 보호",
      description: "최대 $1M 손해배상 보험 무료 제공",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "검증된 게스트",
      description: "신원 인증된 게스트만 예약 가능",
      color: "text-purple-600"
    },
  ]

  const steps = [
    { step: 1, title: "숙소 정보 입력", time: "30초" },
    { step: 2, title: "사진 업로드", time: "1분" },
    { step: 3, title: "AI 자동 완성", time: "10초" },
    { step: 4, title: "승인 완료", time: "24시간" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center space-y-6">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              <Sparkles className="h-3 w-3 mr-1" />
              호스트 특별 혜택
            </Badge>
            <h1 className="font-heading font-bold text-4xl md:text-5xl">
              내 집이 수익을 만들어요
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              빈 방을 활용해서 매달 안정적인 수익을 창출하세요. 
              AI가 모든 것을 자동화하여 1분이면 시작할 수 있습니다.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/add-property">
                <Button size="lg" className="h-12 px-8">
                  <Home className="h-4 w-4 mr-2" />
                  호스트 시작하기
                </Button>
              </Link>
              <Link href="/host-referral">
                <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent">
                  친구 초대하고 π0.000048 받기
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-16">
        {/* Benefits Grid */}
        <section>
          <h2 className="font-heading font-bold text-2xl text-center mb-8">
            왜 우리를 선택해야 할까요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`h-12 w-12 rounded-full bg-background border-2 flex items-center justify-center mx-auto ${benefit.color}`}>
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Earnings Calculator */}
        <section className="max-w-xl mx-auto">
          <HostEarningsCalculator />
        </section>

        {/* How It Works */}
        <section>
          <h2 className="font-heading font-bold text-2xl text-center mb-8">
            간단한 4단계 프로세스
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={step.step} className="relative">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-xl">
                      {step.step}
                    </div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {step.time}
                    </Badge>
                  </CardContent>
                </Card>
                {idx < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Social Proof */}
        <section className="bg-muted/50 rounded-lg p-8">
          <div className="text-center space-y-6">
            <h2 className="font-heading font-bold text-2xl">
              이미 1,248명의 호스트가 함께하고 있어요
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">π0.0906</p>
                <p className="text-sm text-muted-foreground">월 평균 호스트 수익</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">94%</p>
                <p className="text-sm text-muted-foreground">예약률</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">4.8★</p>
                <p className="text-sm text-muted-foreground">평균 호스트 평점</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-4">
          <h2 className="font-heading font-bold text-2xl">
            지금 시작하면 π0.000032 보너스 지급
          </h2>
          <p className="text-muted-foreground">
            신규 호스트 가입 후 30일 내 첫 예약 완료 시
          </p>
          <Link href="/add-property">
            <Button size="lg" className="h-14 px-10 text-lg">
              1분 만에 호스트 되기
              <Zap className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </section>
      </div>
    </div>
  )
}
