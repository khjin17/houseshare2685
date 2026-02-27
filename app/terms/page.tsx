"use client"

import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <BackButton title="이용약관" />

      <main className="px-4 py-6 max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. 서비스 이용 약관</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              houseshare는 Pi Network 기반의 일일 숙소 대여 플랫폼입니다. 본 서비스를 이용함으로써 귀하는 다음 약관에 동의하는 것으로 간주됩니다.
            </p>
            <p>
              모든 결제는 Pi 암호화폐로 처리되며, 플랫폼 수수료 5%가 자동으로 적용됩니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. 예약 및 취소 정책</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <div>
              <h4 className="font-semibold mb-2">환불 정책</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>유연함 (Flexible):</strong> 체크인 24시간 전까지 전액 환불</li>
                <li><strong>보통 (Moderate):</strong> 체크인 5일 전까지 전액 환불</li>
                <li><strong>엄격함 (Strict):</strong> 체크인 1주일 전까지 50% 환불</li>
                <li><strong>환불 불가 (Non-refundable):</strong> 환불 불가</li>
              </ul>
            </div>
            <p className="text-muted-foreground">
              호스트가 설정한 환불 정책에 따라 취소 수수료가 적용됩니다. 예약 시 반드시 환불 정책을 확인하시기 바랍니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. 파티 및 이벤트 이용</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              파티 패키지를 이용하는 경우 소음 보증금이 Pi로 예치됩니다. 이웃 불만이나 숙소 파손이 없으면 24시간 이내 자동 환불됩니다.
            </p>
            <p className="text-muted-foreground">
              최대 인원을 초과하거나 허가되지 않은 활동을 할 경우 즉시 퇴실 조치 및 보증금 몰수 처리될 수 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. 사용자 책임</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              게스트는 숙소 규칙을 준수해야 하며, 숙소 내 시설 파손 시 수리 비용을 부담해야 합니다.
            </p>
            <p>
              호스트는 정확한 숙소 정보를 제공해야 하며, 예약 확정 후 부당하게 취소할 수 없습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Pi Network 및 블록체인</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              본 서비스는 Pi Network 생태계를 기반으로 하며, 모든 거래는 블록체인에 기록됩니다.
            </p>
            <p className="text-muted-foreground">
              Pi 스테이킹, NFT 인증, 스마트 컨트랙트 등의 블록체인 기능을 사용할 때는 트랜잭션 수수료 및 가스비가 발생할 수 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. 개인정보 보호</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              귀하의 개인정보는 Pi Network KYC 및 우리의 개인정보 보호 정책에 따라 안전하게 관리됩니다.
            </p>
            <p className="text-muted-foreground">
              자세한 내용은 개인정보 보호 페이지를 참조하시기 바랍니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. 서비스 변경 및 중단</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              houseshare는 서비스 개선을 위해 언제든지 기능을 추가, 수정 또는 제거할 수 있습니다.
            </p>
            <p className="text-muted-foreground">
              중요한 변경사항이 있을 경우 사전에 공지하며, 계속 사용하시면 변경 사항에 동의하는 것으로 간주됩니다.
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>최종 업데이트: 2026년 1월</p>
          <p className="mt-2">문의사항이 있으시면 support@houseshare.com으로 연락주시기 바랍니다.</p>
        </div>
      </main>
    </div>
  )
}
