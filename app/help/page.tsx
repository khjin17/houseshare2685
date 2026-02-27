"use client"

import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Home, 
  CreditCard, 
  Shield, 
  Calendar, 
  MessageCircle, 
  HelpCircle,
  ChevronRight,
  PartyPopper
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Suspense } from "react"
import Loading from "@/components/loading"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const helpCategories = [
    {
      icon: Home,
      title: "숙소 예약",
      description: "예약 방법 및 체크인/아웃",
      color: "text-blue-500",
      category: "예약",
    },
    {
      icon: CreditCard,
      title: "결제 & Pi",
      description: "Pi 결제, 환불, 수수료",
      color: "text-green-500",
      category: "결제",
    },
    {
      icon: PartyPopper,
      title: "파티 패키지",
      description: "이벤트 서비스 및 보증금",
      color: "text-purple-500",
      category: "파티",
    },
    {
      icon: Shield,
      title: "안전 & 보안",
      description: "신원 인증, 보험, 비상 연락",
      color: "text-red-500",
      category: "안전",
    },
    {
      icon: Calendar,
      title: "취소 & 환불",
      description: "취소 정책 및 환불 절차",
      color: "text-orange-500",
      category: "환불",
    },
    {
      icon: MessageCircle,
      title: "호스트 소통",
      description: "채팅, 번역, 리뷰",
      color: "text-cyan-500",
      category: "채팅",
    },
  ]

  const faqs = [
    {
      category: "예약",
      question: "어떻게 숙소를 예약하나요?",
      answer: "원하는 숙소를 선택한 후 날짜를 입력하고 'Book Now' 버튼을 클릭하세요. Pi Network로 로그인하여 결제를 진행하면 예약이 완료됩니다."
    },
    {
      category: "결제",
      question: "Pi로 결제하는 방법은?",
      answer: "모든 결제는 자동으로 Pi Network를 통해 처리됩니다. 예약 시 필요한 Pi 금액이 표시되며, 승인하면 즉시 결제됩니다. 플랫폼 수수료 5%가 포함됩니다."
    },
    {
      category: "파티",
      question: "파티 패키지는 무엇인가요?",
      answer: "파티 패키지는 음향 장비, 조명, 케이터링, 장식 등을 숙소와 함께 예약할 수 있는 서비스입니다. 각 패키지는 서로 다른 장비와 가격을 제공하며, 청소 서비스도 추가할 수 있습니다."
    },
    {
      category: "파티",
      question: "소음 보증금은 어떻게 작동하나요?",
      answer: "파티 예약 시 소음 보증금이 Pi로 예치됩니다. 이웃 불만이나 규칙 위반이 없으면 체크아웃 후 24시간 이내에 자동으로 환불됩니다."
    },
    {
      category: "그룹",
      question: "그룹 예약 시 비용을 나눌 수 있나요?",
      answer: "네, 그룹 예약 기능을 사용하면 여러 명이 비용을 Pi로 자동 분할할 수 있습니다. 각 참여자에게 링크를 보내고 개별적으로 결제하면 됩니다."
    },
    {
      category: "환불",
      question: "예약을 취소하면 환불받을 수 있나요?",
      answer: "환불 정책은 호스트가 설정합니다. Flexible (24시간 전 전액), Moderate (5일 전 전액), Strict (1주일 전 50%), Non-refundable (환불 불가) 중 하나입니다."
    },
    {
      category: "안전",
      question: "숙소는 안전한가요?",
      answer: "모든 숙소는 검증 과정을 거치며, NFT 인증 배지를 받은 숙소는 특히 신뢰할 수 있습니다. 실시간 안전 체크, 비상 연락망, 보험 옵션도 제공됩니다."
    },
    {
      category: "채팅",
      question: "호스트와 다른 언어로 채팅할 수 있나요?",
      answer: "네, 채팅창의 번역 아이콘을 클릭하여 자동 번역 기능을 활성화할 수 있습니다. 10개 언어를 지원하며 실시간으로 번역됩니다."
    },
    {
      category: "보상",
      question: "Pi 리워드는 어떻게 받나요?",
      answer: "예약, 리뷰 작성, 친구 초천, 일일 챌린지 완료 등으로 Pi를 적립할 수 있습니다. 레벨이 올라가면 더 많은 보상과 할인 혜택을 받을 수 있습니다."
    },
    {
      category: "보상",
      question: "Pi 스테이킹은 무엇인가요?",
      answer: "Pi를 앱에 스테이킹하면 예약 수수료 할인, 우선 예약권, 추가 보상 등의 혜택을 받을 수 있습니다. 스테이킹한 Pi는 언제든지 출금할 수 있습니다."
    },
    {
      category: "예약",
      question: "스마트 체크인은 어떻게 작동하나요?",
      answer: "체크인 30분 전부터 앱에서 디지털 키가 활성화됩니다. 스마트폰으로 문을 열고 닫을 수 있으며, 비밀번호 입력이 필요 없습니다. 체크인 2시간 후 안전 확인 알림이 전송됩니다."
    },
    {
      category: "안전",
      question: "비상 연락처는 어떻게 작동하나요?",
      answer: "예약 시 최대 3명의 비상 연락처를 등록할 수 있습니다. 체크인 후 4시간 동안 안전 확인에 응답하지 않으면 자동으로 비상 연락처에 통보됩니다."
    },
    {
      category: "안전",
      question: "보험은 어떤 것을 제공하나요?",
      answer: "기본(3%), 표준(5%), 프리미엄(8%) 세 가지 보험 옵션이 있습니다. 재산 손해, 부상, 책임, 예약 취소 등을 커버하며, 프리미엄은 최대 $50,000까지 보장합니다."
    },
    {
      category: "그룹",
      question: "친구 초대하면 무엇을 받나요?",
      answer: "친구가 가입하면 π0.0000064를 받고, 첫 예약을 완료하면 추가로 π0.0000095를 받습니다. 초대받은 친구도 π0.0000064 웰컴 보너스를 받습니다."
    },
    {
      category: "채팅",
      question: "호스트에게 언제 메시지를 보낼 수 있나요?",
      answer: "예약 전후 언제든지 호스트와 메시지를 주고받을 수 있습니다. 평균 응답 시간은 2시간 이내이며, 긴급한 경우 전화 버튼을 사용할 수 있습니다."
    },
    {
      category: "결제",
      question: "Pi 가격은 어떻게 결정되나요?",
      answer: "Pi 가격은 시장 가격을 기준으로 하며, 현재 $314,159로 책정되어 있습니다. 결제 시 실시간 환율이 적용되어 정확한 Pi 금액이 표시됩니다."
    },
    {
      category: "환불",
      question: "소음 보증금은 언제 환불되나요?",
      answer: "파티 종료 후 이웃 불만이나 규칙 위반 신고가 없으면, 체크아웃 후 24시간 이내에 자동으로 Pi 계정으로 환불됩니다."
    },
  ]

  const filteredFAQs = faqs.filter(faq => {
    // Filter by search query
    if (searchQuery) {
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      if (!matchesSearch) return false
    }
    
    // Filter by selected category
    if (selectedCategory) {
      return faq.category === selectedCategory
    }
    
    return true
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      <BackButton title="도움말" />

      <main className="px-4 py-6 max-w-3xl mx-auto space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="궁금한 내용을 검색하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        {!searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg">카테고리별 도움말</h2>
              {selectedCategory && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs"
                >
                  전체 보기
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {helpCategories.map((category) => (
                <Card 
                  key={category.title} 
                  className={`hover:shadow-md transition-all cursor-pointer ${
                    selectedCategory === category.category 
                      ? 'border-primary shadow-md' 
                      : ''
                  }`}
                  onClick={() => setSelectedCategory(category.category)}
                >
                  <CardContent className="p-4">
                    <category.icon className={`h-6 w-6 ${category.color} mb-2`} />
                    <h3 className="font-semibold text-sm mb-1">{category.title}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        <div>
          <h2 className="font-heading font-semibold text-lg mb-4">
            {searchQuery 
              ? `검색 결과 (${filteredFAQs.length})` 
              : selectedCategory 
                ? `${helpCategories.find(c => c.category === selectedCategory)?.title} (${filteredFAQs.length})`
                : "자주 묻는 질문"}
          </h2>
          <Card>
            <CardContent className="p-0">
              <Suspense fallback={<Loading />}>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0 px-4">
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <div className="flex items-start gap-3 flex-1">
                          <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{faq.question}</div>
                            <Badge variant="secondary" className="mt-1 text-xs">{faq.category}</Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 pl-8">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">문제가 해결되지 않았나요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              추가 도움이 필요하시면 고객 지원팀에 문의하세요. 24시간 이내에 답변드립니다.
            </p>
            <Button className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              고객 지원 문의하기
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
