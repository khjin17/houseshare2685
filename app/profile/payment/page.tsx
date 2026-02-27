"use client"

import { useState, useEffect } from "react"
import { BackButton } from "@/components/back-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle2, AlertCircle, ExternalLink, Copy, Loader2 } from "lucide-react"
import { piNetwork, type PiUser } from "@/lib/pi-network"
import { piSocial } from "@/lib/pi-social"

export default function PaymentPage() {
  const [piUser, setPiUser] = useState<PiUser | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    setIsLoading(true)
    try {
      const user = piSocial.getCurrentUser()
      
      if (user) {
        setPiUser(user)
        setIsConnected(true)
        // Mock balance for demonstration
        setWalletBalance(Math.random() * 1000)
      }
    } catch (error) {
      console.error("[v0] Failed to check wallet connection:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      const user = await piNetwork.authenticate()
      
      if (user) {
        setPiUser(user)
        setIsConnected(true)
        setWalletBalance(Math.random() * 1000)
        console.log("[v0] Pi wallet connected:", user)
      }
    } catch (error) {
      console.error("[v0] Failed to connect Pi wallet:", error)
      alert("Pi 지갑 연결에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectWallet = () => {
    setPiUser(null)
    setIsConnected(false)
    setWalletBalance(0)
    console.log("[v0] Pi wallet disconnected")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("클립보드에 복사되었습니다")
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
      <BackButton title="결제 정보" />

      <main className="px-4 py-6 max-w-2xl mx-auto space-y-4">
        {/* Wallet Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pi 지갑</CardTitle>
                  <CardDescription>Pi Network 결제 지갑</CardDescription>
                </div>
              </div>
              {isConnected ? (
                <Badge className="bg-green-500/10 text-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  연결됨
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  미연결
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isConnected && piUser ? (
              <div className="space-y-4">
                {/* Wallet Info */}
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">사용자 이름</p>
                    <p className="font-heading font-semibold">@{piUser.username}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">지갑 주소</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-background px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                        {piUser.uid}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0"
                        onClick={() => copyToClipboard(piUser.uid)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">잔액</p>
                    <p className="font-heading font-bold text-2xl text-primary">
                      π {walletBalance.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Disconnect Button */}
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleDisconnectWallet}
                >
                  지갑 연결 해제
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Pi Network 지갑을 연결하여 결제 기능을 사용하세요
                </p>
                <Button className="w-full" onClick={handleConnectWallet} disabled={isConnecting}>
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      연결 중...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Pi 지갑 연결하기
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">결제 정보</CardTitle>
            <CardDescription>Pi Network 암호화폐로 안전하게 결제하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">안전한 거래</p>
                <p className="text-xs text-muted-foreground">
                  블록체인 기술로 보호되는 안전한 결제
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">낮은 수수료</p>
                <p className="text-xs text-muted-foreground">
                  플랫폼 수수료 5%만 부과됩니다
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm">즉시 송금</p>
                <p className="text-xs text-muted-foreground">
                  예약 완료 시 호스트에게 즉시 송금됩니다
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pi Network Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pi Network 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Pi Network는 모바일에서 채굴 가능한 암호화폐입니다. 자세한 내용은 공식 웹사이트를 방문하세요.
            </p>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href="https://minepi.com" target="_blank" rel="noopener noreferrer">
                Pi Network 웹사이트
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
