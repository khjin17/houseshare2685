// Rewards Calculator - Percentage-based Pi rewards
// Pi Price: $314,159 USD (fixed)

export interface RewardConfig {
  piPriceUSD: number // Current Pi market price
  platformFeePercent: number // Platform commission
  hostFeePercent: number // Host commission
}

export const DEFAULT_CONFIG: RewardConfig = {
  piPriceUSD: 314159, // 1 Pi = $314,159
  platformFeePercent: 5, // 5% platform fee
  hostFeePercent: 3, // 3% host fee
}

export class RewardsCalculator {
  private config: RewardConfig

  constructor(config: RewardConfig = DEFAULT_CONFIG) {
    this.config = config
  }

  // Calculate booking reward (20% of platform fee back to user)
  calculateBookingReward(bookingAmountUSD: number): number {
    const platformFee = bookingAmountUSD * (this.config.platformFeePercent / 100)
    const rewardUSD = platformFee * 0.2 // Give back 20% of our commission
    const piReward = rewardUSD / this.config.piPriceUSD
    return piReward
  }

  // Calculate review reward (5% of platform fee)
  calculateReviewReward(bookingAmountUSD: number): number {
    const platformFee = bookingAmountUSD * (this.config.platformFeePercent / 100)
    const rewardUSD = platformFee * 0.05
    const piReward = rewardUSD / this.config.piPriceUSD
    return piReward
  }

  // Fixed referral rewards (scaled for new Pi value)
  getReferralReward(): { referrer: number; referred: number } {
    return {
      referrer: 3 / this.config.piPriceUSD, // ~$3 for inviting
      referred: 2 / this.config.piPriceUSD, // ~$2 welcome bonus
    }
  }

  // Badge rewards scaled by rarity
  getBadgeReward(rarity: "common" | "rare" | "epic" | "legendary"): number {
    const rewardsUSD = {
      common: 0.5,
      rare: 1.5,
      epic: 4,
      legendary: 10,
    }
    return rewardsUSD[rarity] / this.config.piPriceUSD
  }

  // Daily challenge rewards
  getDailyChallengeReward(difficulty: "easy" | "medium" | "hard"): number {
    const rewardsUSD = {
      easy: 0.3,
      medium: 0.6,
      hard: 1.2,
    }
    return rewardsUSD[difficulty] / this.config.piPriceUSD
  }

  // Streak bonus multiplier
  getStreakMultiplier(streakDays: number): number {
    // Max 2x multiplier at 30 days
    return Math.min(1 + (streakDays * 0.033), 2)
  }

  // Level up rewards
  getLevelUpReward(level: number): number {
    return (level * 0.5) / this.config.piPriceUSD // ~$0.5 per level
  }

  // Calculate total rewards for a transaction
  calculateTransactionRewards(params: {
    bookingAmount: number
    hasReview: boolean
    streakDays?: number
    isFirstBooking?: boolean
  }): {
    bookingReward: number
    reviewReward: number
    streakBonus: number
    firstBookingBonus: number
    total: number
  } {
    const bookingReward = this.calculateBookingReward(params.bookingAmount)
    const reviewReward = params.hasReview ? this.calculateReviewReward(params.bookingAmount) : 0
    const streakMultiplier = params.streakDays ? this.getStreakMultiplier(params.streakDays) : 1
    const firstBookingBonus = params.isFirstBooking ? (2 / this.config.piPriceUSD) : 0

    const baseTotal = bookingReward + reviewReward + firstBookingBonus
    const streakBonus = baseTotal * (streakMultiplier - 1)
    const total = baseTotal + streakBonus

    return {
      bookingReward,
      reviewReward,
      streakBonus,
      firstBookingBonus,
      total,
    }
  }

  // Format Pi amount for display
  formatPi(amount: number): string {
    if (amount >= 1) {
      return `π${amount.toFixed(2)}`
    } else if (amount >= 0.01) {
      return `π${amount.toFixed(4)}`
    } else if (amount >= 0.0001) {
      return `π${amount.toFixed(6)}`
    } else if (amount >= 0.00000001) {
      return `π${amount.toFixed(8)}`
    } else {
      return `π${amount.toExponential(2)}`
    }
  }

  // Calculate approximate USD value
  piToUSD(piAmount: number): number {
    return Math.round(piAmount * this.config.piPriceUSD * 100) / 100
  }

  // Convert USD to Pi
  usdToPi(usdAmount: number): number {
    return usdAmount / this.config.piPriceUSD
  }
}

export const rewardsCalculator = new RewardsCalculator()
