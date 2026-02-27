"use client"

import { useState, useEffect } from "react"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  Lock, 
  Unlock, 
  Gift, 
  Percent,
  Clock,
  DollarSign,
  Award,
  Info
} from "lucide-react"
import { BlockchainTrustManager } from "@/lib/blockchain-trust"
import { piNetwork } from "@/lib/pi-network"

export default function StakingPage() {
  const [stakeAmount, setStakeAmount] = useState("")
  const [stakingPeriod, setStakingPeriod] = useState<30 | 90 | 180 | 365>(90)
  const [userBalance, setUserBalance] = useState(0.0032)
  const [activeStakes, setActiveStakes] = useState<any[]>([])
  const [isStaking, setIsStaking] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    // Load user's Pi balance and active stakes
    const user = piNetwork.getCurrentUser()
    if (user) {
      // Mock data - in production, fetch from blockchain
      setUserBalance(0.0032)
      setActiveStakes([
        {
          id: "stake-1",
          amount: 0.0016,
          period: 90,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          rewards: 0.0000011,
          tier: "silver" as const,
        }
      ])
    }
  }

  const calculateRewards = (amount: number, days: number) => {
    const rates = {
      30: 0.01,   // 1% APY
      90: 0.02,   // 2% APY
      180: 0.035, // 3.5% APY
      365: 0.05,  // 5% APY
    }
    const rate = rates[days as keyof typeof rates]
    return (amount * rate * days) / 365
  }

  const getTierBenefits = (amount: number) => {
    if (amount >= 0.016) return { tier: "platinum", discount: 12, name: "Platinum" }
    if (amount >= 0.0032) return { tier: "gold", discount: 8, name: "Gold" }
    if (amount >= 0.0016) return { tier: "silver", discount: 5, name: "Silver" }
    return { tier: "bronze", discount: 3, name: "Bronze" }
  }

  const handleStake = async () => {
    const amount = parseFloat(stakeAmount)
    if (!amount || amount <= 0 || amount > userBalance) return

    setIsStaking(true)
    try {
      await BlockchainTrustManager.stakeTokens("current-user", amount, stakingPeriod)
      
      const rewards = calculateRewards(amount, stakingPeriod)
      const tier = getTierBenefits(amount)
      
      const newStake = {
        id: `stake-${Date.now()}`,
        amount,
        period: stakingPeriod,
        startDate: new Date(),
        endDate: new Date(Date.now() + stakingPeriod * 24 * 60 * 60 * 1000),
        rewards,
        tier: tier.tier,
      }

      setActiveStakes([...activeStakes, newStake])
      setUserBalance(userBalance - amount)
      setStakeAmount("")
      
      console.log("[v0] Staked successfully:", newStake)
    } catch (error) {
      console.error("[v0] Staking error:", error)
    } finally {
      setIsStaking(false)
    }
  }

  const handleUnstake = async (stakeId: string) => {
    const stake = activeStakes.find(s => s.id === stakeId)
    if (!stake) return

    try {
      await BlockchainTrustManager.unstakeTokens("current-user", stakeId)
      
      setActiveStakes(activeStakes.filter(s => s.id !== stakeId))
      setUserBalance(userBalance + stake.amount + stake.rewards)
      
      console.log("[v0] Unstaked successfully:", stake)
    } catch (error) {
      console.error("[v0] Unstaking error:", error)
    }
  }

  const estimatedRewards = stakeAmount ? calculateRewards(parseFloat(stakeAmount) || 0, stakingPeriod) : 0
  const tierInfo = stakeAmount ? getTierBenefits(parseFloat(stakeAmount) || 0) : null

  return (
    <div className="min-h-screen bg-background">
      <BackButton title="Pi Staking" />

      <main className="px-4 py-6 pb-24 max-w-2xl mx-auto space-y-6">
        {/* Balance Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-bold font-mono">π {userBalance.toFixed(6)}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stake">Stake Pi</TabsTrigger>
            <TabsTrigger value="active">Active Stakes</TabsTrigger>
          </TabsList>

          {/* Stake Tab */}
          <TabsContent value="stake" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Stake Pi Tokens
                </CardTitle>
                <CardDescription>
                  Lock your Pi to earn rewards and get booking fee discounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount to Stake</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      π
                    </span>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setStakeAmount(userBalance.toString())}
                    className="p-0 h-auto"
                  >
                    Max: π {userBalance.toFixed(6)}
                  </Button>
                </div>

                {/* Period Selection */}
                <div className="space-y-3">
                  <Label>Staking Period</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { days: 30, apy: "1%" },
                      { days: 90, apy: "2%" },
                      { days: 180, apy: "3.5%" },
                      { days: 365, apy: "5%" },
                    ].map((option) => (
                      <Button
                        key={option.days}
                        variant={stakingPeriod === option.days ? "default" : "outline"}
                        onClick={() => setStakingPeriod(option.days as any)}
                        className="h-auto py-4 flex flex-col items-start"
                      >
                        <span className="font-semibold">{option.days} Days</span>
                        <span className="text-xs">{option.apy} APY</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Rewards Preview */}
                {stakeAmount && parseFloat(stakeAmount) > 0 && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Rewards</span>
                        <span className="font-semibold font-mono">π {estimatedRewards.toFixed(8)}</span>
                      </div>
                      {tierInfo && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Staking Tier</span>
                            <Badge variant="outline" className="gap-1">
                              <Award className="h-3 w-3" />
                              {tierInfo.name}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Fee Discount</span>
                            <span className="font-semibold text-primary">{tierInfo.discount}%</span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleStake}
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > userBalance || isStaking}
                >
                  {isStaking ? "Staking..." : "Stake Pi"}
                </Button>
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Staking Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Percent className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Booking Fee Discounts</p>
                    <p className="text-xs text-muted-foreground">Get 3-12% off on all bookings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Passive Income</p>
                    <p className="text-xs text-muted-foreground">Earn up to 5% APY on staked Pi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Exclusive Perks</p>
                    <p className="text-xs text-muted-foreground">Access premium features and early bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Stakes Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeStakes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No active stakes</p>
                  <p className="text-xs text-muted-foreground mt-1">Start staking to earn rewards</p>
                </CardContent>
              </Card>
            ) : (
              activeStakes.map((stake) => {
                const progress = ((Date.now() - stake.startDate.getTime()) / (stake.endDate.getTime() - stake.startDate.getTime())) * 100
                const daysLeft = Math.ceil((stake.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                const isUnlocked = Date.now() >= stake.endDate.getTime()

                return (
                  <Card key={stake.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-mono">π {stake.amount.toFixed(6)}</CardTitle>
                        <Badge variant="outline" className="gap-1">
                          <Award className="h-3 w-3" />
                          {getTierBenefits(stake.amount).name}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{Math.min(100, progress).toFixed(0)}%</span>
                        </div>
                        <Progress value={Math.min(100, progress)} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Staking Period</p>
                          <p className="font-medium">{stake.period} days</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Rewards</p>
                          <p className="font-medium text-primary font-mono">π {stake.rewards.toFixed(8)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">End Date</p>
                          <p className="font-medium">{stake.endDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Days Left</p>
                          <p className="font-medium">{isUnlocked ? "Unlocked" : `${daysLeft} days`}</p>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        variant={isUnlocked ? "default" : "outline"}
                        onClick={() => handleUnstake(stake.id)}
                        disabled={!isUnlocked}
                      >
                        {isUnlocked ? (
                          <>
                            <Unlock className="h-4 w-4 mr-2" />
                            Unstake & Claim Rewards
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 mr-2" />
                            Locked ({daysLeft} days left)
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
