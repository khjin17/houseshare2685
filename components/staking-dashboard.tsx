"use client"

import { useState } from "react"
import { TrendingUp, Lock, Unlock, Gift, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { stakingTiers, BlockchainTrustManager, type PiStakingTier } from "@/lib/blockchain-trust"

export function StakingDashboard() {
  const [stakedAmount, setStakedAmount] = useState(0)
  const [stakeInput, setStakeInput] = useState("")
  const [isStaking, setIsStaking] = useState(false)

  const currentTier = BlockchainTrustManager.getStakingTier(stakedAmount)
  const nextTier = stakingTiers.find((t) => t.minStake > stakedAmount)

  const handleStake = async () => {
    const amount = Number.parseFloat(stakeInput)
    if (amount <= 0 || Number.isNaN(amount)) return

    setIsStaking(true)
    console.log("[v0] Staking Pi:", amount)

    // Simulate staking transaction
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setStakedAmount((prev) => prev + amount)
    setStakeInput("")
    setIsStaking(false)
  }

  const handleUnstake = async () => {
    if (stakedAmount === 0) return

    setIsStaking(true)
    console.log("[v0] Unstaking Pi:", stakedAmount)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setStakedAmount(0)
    setIsStaking(false)
  }

  const getTierColor = (tier: PiStakingTier["tier"]) => {
    switch (tier) {
      case "bronze":
        return "bg-orange-800 text-orange-100"
      case "silver":
        return "bg-slate-400 text-slate-900"
      case "gold":
        return "bg-yellow-500 text-yellow-950"
      case "platinum":
        return "bg-purple-600 text-purple-100"
      default:
        return "bg-gray-500 text-gray-100"
    }
  }

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading font-bold">Pi Staking</h2>
        <p className="text-muted-foreground">
          Stake Pi tokens to unlock premium benefits and earn rewards
        </p>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Your Staking Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Currently Staked</p>
              <p className="text-3xl font-bold">π {stakedAmount}</p>
            </div>
            {currentTier && (
              <Badge className={getTierColor(currentTier.tier)} variant="secondary">
                {currentTier.tier.toUpperCase()} TIER
              </Badge>
            )}
          </div>

          {currentTier && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Current APY</span>
                <span className="font-semibold text-primary">{currentTier.currentAPY}%</span>
              </div>
              {nextTier && (
                <>
                  <Progress
                    value={(stakedAmount / nextTier.minStake) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Stake π {nextTier.minStake - stakedAmount} more to reach {nextTier.tier.toUpperCase()} tier
                  </p>
                </>
              )}
            </div>
          )}

          {/* Staking Actions */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount to stake"
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
              disabled={isStaking}
            />
            <Button onClick={handleStake} disabled={isStaking || !stakeInput}>
              <Lock className="h-4 w-4 mr-2" />
              Stake
            </Button>
            <Button
              variant="outline"
              onClick={handleUnstake}
              disabled={isStaking || stakedAmount === 0}
            >
              <Unlock className="h-4 w-4 mr-2" />
              Unstake
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      {currentTier && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Your Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {currentTier.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-sm">{benefit.description}</span>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Tiers */}
      <div className="space-y-3">
        <h3 className="font-semibold">Staking Tiers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stakingTiers.map((tier) => (
            <Card
              key={tier.tier}
              className={
                currentTier?.tier === tier.tier
                  ? "border-primary ring-2 ring-primary"
                  : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{tier.tier.toUpperCase()}</CardTitle>
                  <Badge className={getTierColor(tier.tier)} variant="secondary">
                    {tier.currentAPY}% APY
                  </Badge>
                </div>
                <CardDescription>Minimum stake: π {tier.minStake}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tier.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{benefit.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
