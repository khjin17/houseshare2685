"use client"

import { useState, useEffect } from "react"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Award,
  TrendingUp,
  Users,
  Leaf,
  Shield,
  Zap,
  Star,
  Gift,
  Lock,
  CheckCircle2
} from "lucide-react"
import { PiCalculator } from "@/components/pi-calculator"
import { gamificationManager, badges } from "@/lib/gamification"
import { blockchainTrustManager, stakingTiers } from "@/lib/blockchain-trust"
import { sustainabilityManager } from "@/lib/sustainability"
import { safetySecurityManager } from "@/lib/safety-security"

export default function DashboardPage() {
  const userId = "user-123" // Mock user ID
  const [userLevel, setUserLevel] = useState(gamificationManager.getUserLevel(userId))
  const [userBadges, setUserBadges] = useState(gamificationManager.getUserBadges(userId))
  const [piBalance, setPiBalance] = useState(gamificationManager.getUserPiBalance(userId))

  // Mock user stats
  const stats = {
    totalBookings: 12,
    totalReviews: 8,
    referrals: 3,
    carbonOffset: 45,
    donations: 25,
    streak: 7
  }

  const progressToNextLevel = (userLevel.xp / userLevel.xpToNextLevel) * 100

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <BackButton />

        {/* User Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Your Dashboard</h1>
              <p className="text-muted-foreground">Track your progress and rewards</p>
            </div>
            <Button size="lg" className="gap-2">
              <Zap className="h-4 w-4" />
              {piBalance} Pi
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <div className="text-xs text-muted-foreground">Bookings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
              <div className="text-xs text-muted-foreground">Reviews</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.referrals}</div>
              <div className="text-xs text-muted-foreground">Referrals</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Leaf className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.carbonOffset}kg</div>
              <div className="text-xs text-muted-foreground">CO2 Offset</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="level" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full mb-6 h-auto">
            <TabsTrigger value="level" className="text-xs sm:text-sm">Level & XP</TabsTrigger>
            <TabsTrigger value="badges" className="text-xs sm:text-sm">Badges</TabsTrigger>
            <TabsTrigger value="staking" className="text-xs sm:text-sm">Staking</TabsTrigger>
            <TabsTrigger value="impact" className="text-xs sm:text-sm">Impact</TabsTrigger>
            <TabsTrigger value="safety" className="text-xs sm:text-sm">Safety</TabsTrigger>
          </TabsList>

          {/* Level & XP Tab */}
          <TabsContent value="level" className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Level {userLevel.currentLevel}</CardTitle>
                    <CardDescription className="text-lg font-semibold text-primary">
                      {userLevel.title}
                    </CardDescription>
                  </div>
                  <Trophy className="h-12 w-12 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{userLevel.xp} XP</span>
                    <span>{userLevel.xpToNextLevel} XP</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {userLevel.xpToNextLevel - userLevel.xp} XP to level {userLevel.currentLevel + 1}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Your Benefits:</h4>
                  <div className="space-y-2">
                    {userLevel.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  <Zap className="h-4 w-4 mr-2" />
                  Ways to Earn XP
                </Button>
              </CardContent>
            </Card>

            {/* XP Sources */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Complete a Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">+100 XP</span>
                    <Badge>High Value</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">+50 XP</span>
                    <Badge variant="secondary">Easy</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Refer a Friend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">+100 XP</span>
                    <Badge>+ 50 Pi</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Earn a Badge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">+50-500 XP</span>
                    <Badge variant="secondary">Varies</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Badge Collection</CardTitle>
                <CardDescription>
                  Collect badges by completing achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {badges.slice(0, 6).map((badge) => {
                    const earned = userBadges.some(ub => ub.badgeId === badge.badgeId)
                    const rarityColors = {
                      common: "border-gray-400",
                      rare: "border-blue-500",
                      epic: "border-purple-500",
                      legendary: "border-yellow-500"
                    }
                    
                    return (
                      <Card 
                        key={badge.badgeId}
                        className={`${rarityColors[badge.rarity]} border-2 ${!earned && "opacity-40"}`}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                          <Badge variant={earned ? "default" : "outline"} className="text-xs">
                            {earned ? "Earned" : `${badge.piReward} Pi`}
                          </Badge>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badge Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Party Starter (5 bookings)</span>
                    <span>{stats.totalBookings}/5</span>
                  </div>
                  <Progress value={(stats.totalBookings / 5) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Review Master (20 reviews)</span>
                    <span>{stats.totalReviews}/20</span>
                  </div>
                  <Progress value={(stats.totalReviews / 20) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Social Connector (10 referrals)</span>
                    <span>{stats.referrals}/10</span>
                  </div>
                  <Progress value={(stats.referrals / 10) * 100} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staking Tab */}
          <TabsContent value="staking" className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Pi Staking</CardTitle>
                    <CardDescription>
                      Stake Pi to earn rewards and unlock exclusive benefits
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Start Staking Pi
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {stakingTiers.map((tier) => (
                <Card key={tier.tier} className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="capitalize">{tier.tier} Tier</CardTitle>
                      <Badge variant="secondary">{tier.currentAPY}% APY</Badge>
                    </div>
                    <CardDescription>
                      Minimum: {tier.minStake} Pi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {tier.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                          <span>{benefit.description}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Leaf className="h-6 w-6 text-green-600" />
                  <div>
                    <CardTitle>Your Environmental Impact</CardTitle>
                    <CardDescription>
                      Track your contributions to sustainability
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-600">{stats.carbonOffset}kg</div>
                    <div className="text-sm text-muted-foreground">CO2 Offset</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">{stats.donations}</div>
                    <div className="text-sm text-muted-foreground">Pi Donated</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">3</div>
                    <div className="text-sm text-muted-foreground">Eco Bookings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sustainability Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Leaf className="h-8 w-8 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold">Eco Warrior</h4>
                    <p className="text-xs text-muted-foreground">Offset 500kg of carbon</p>
                  </div>
                  <Progress value={(stats.carbonOffset / 500) * 100} className="w-24" />
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Gift className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-semibold">Community Champion</h4>
                    <p className="text-xs text-muted-foreground">Donate 1000 Pi to causes</p>
                  </div>
                  <Progress value={(stats.donations / 1000) * 100} className="w-24" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety Tab */}
          <TabsContent value="safety" className="space-y-6">
            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle>Safety & Security</CardTitle>
                    <CardDescription>
                      Your safety is our priority
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-sm">Identity Verified</div>
                      <div className="text-xs text-muted-foreground">Pi Network KYC</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50">Verified</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-sm">Emergency Contacts</div>
                      <div className="text-xs text-muted-foreground">2 contacts added</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">Edit</Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold text-sm">Travel Insurance</div>
                      <div className="text-xs text-muted-foreground">Active policy</div>
                    </div>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Safety Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Real-time safety check-ins</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>24/7 emergency support</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Property safety ratings</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Verified host identities</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pi Calculator */}
      <PiCalculator />
    </div>
  )
}
