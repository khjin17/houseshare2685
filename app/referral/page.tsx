"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Copy, Share2, Gift, TrendingUp, Users, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = "HOUSE2024XYZ"
  const referralLink = `https://houseshare.app/join?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    console.log("[v0] Referral link copied:", referralLink)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Houseshare',
          text: 'Join Houseshare and get π0.000159 bonus! Use my referral code.',
          url: referralLink,
        })
        console.log("[v0] Shared referral link")
      } catch (err) {
        console.log("[v0] Share cancelled")
      }
    }
  }

  const stats = {
    totalReferrals: 12,
    piEarned: 0.000115,
    pendingRewards: 0.000019,
  }

  const referrals = [
    { id: 1, name: "Sarah Kim", date: "2024-01-15", reward: 0.0000095, status: "completed" },
    { id: 2, name: "John Doe", date: "2024-01-18", reward: 0.0000095, status: "completed" },
    { id: 3, name: "Emma Lee", date: "2024-01-20", reward: 0.0000095, status: "pending" },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <BackButton title="Invite Friends" />

      <main className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Hero Section */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-2xl mb-2">Invite Friends, Earn Pi</h2>
              <p className="text-muted-foreground">
                Give π0.0000064, Get π0.0000095 when your friends make their first booking
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="overflow-hidden">
            <CardContent className="p-3 text-center">
              <Users className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold">{stats.totalReferrals}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">초대한 친구</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="p-3 text-center">
              <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-bold font-mono break-all">π0.000115</p>
              <p className="text-[10px] text-muted-foreground leading-tight">획득</p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="p-3 text-center">
              <Gift className="h-5 w-5 text-amber-600 mx-auto mb-2" />
              <p className="text-sm font-bold font-mono break-all">π0.000019</p>
              <p className="text-[10px] text-muted-foreground leading-tight">대기중</p>
            </CardContent>
          </Card>
        </div>

        {/* Share Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>Share this link with your friends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="flex-1" />
              <Button onClick={handleCopy} variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleShare} className="w-full" size="lg">
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">Share Your Link</p>
                <p className="text-sm text-muted-foreground">Send your unique referral link to friends</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium">Friend Signs Up</p>
                <p className="text-sm text-muted-foreground">They get π0.0000064 welcome bonus on their account</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium">Earn Rewards</p>
                <p className="text-sm text-muted-foreground">Get π0.0000095 when they complete first booking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral History */}
        <Card>
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
            <CardDescription>{referrals.length} friends invited</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{referral.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{referral.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(referral.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xs">π{referral.reward.toFixed(7)}</p>
                  <Badge variant={referral.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {referral.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
