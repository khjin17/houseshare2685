"use client"

// Gamification & Rewards System

export interface UserLevel {
  userId: string
  currentLevel: number
  xp: number
  xpToNextLevel: number
  title: string
  benefits: string[]
}

export interface Badge {
  badgeId: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  requirement: string
  piReward: number
}

export interface UserBadge {
  userId: string
  badgeId: string
  earnedAt: Date
  displayOnProfile: boolean
}

export interface PiReward {
  rewardId: string
  userId: string
  amount: number
  source: "booking" | "review" | "referral" | "achievement" | "daily" | "streak"
  description: string
  timestamp: Date
  status: "pending" | "completed"
}

export interface ReferralProgram {
  referralId: string
  referrerId: string
  referredUserId: string
  referredUserEmail: string
  status: "invited" | "signed_up" | "completed_first_booking" | "rewarded"
  referrerReward: number
  referredReward: number
  createdAt: Date
  completedAt?: Date
}

export interface DailyChallenge {
  challengeId: string
  title: string
  description: string
  requirement: string
  reward: number
  validDate: Date
  completed: boolean
}

export interface StreakBonus {
  userId: string
  currentStreak: number
  longestStreak: number
  lastActivityDate: Date
  streakType: "booking" | "review" | "login"
  bonusMultiplier: number
}

// Level System Configuration
export const levelTitles = [
  { level: 1, title: "Newbie", xpRequired: 0 },
  { level: 2, title: "Explorer", xpRequired: 100 },
  { level: 3, title: "Adventurer", xpRequired: 250 },
  { level: 4, title: "Party Host", xpRequired: 500 },
  { level: 5, title: "Social Butterfly", xpRequired: 1000 },
  { level: 6, title: "Event Master", xpRequired: 2000 },
  { level: 7, title: "Celebration Expert", xpRequired: 4000 },
  { level: 8, title: "Party Legend", xpRequired: 7000 },
  { level: 9, title: "Elite Host", xpRequired: 12000 },
  { level: 10, title: "Houseshare VIP", xpRequired: 20000 }
]

// Badge Definitions (Updated with realistic Pi rewards based on 1 Pi = $314,159)
export const badges: Badge[] = [
  {
    badgeId: "first-booking",
    name: "First Timer",
    description: "Complete your first booking",
    icon: "🎉",
    rarity: "common",
    requirement: "1 booking",
    piReward: 0.0000016
  },
  {
    badgeId: "party-starter",
    name: "Party Starter",
    description: "Host 5 party events",
    icon: "🎊",
    rarity: "common",
    requirement: "5 party bookings",
    piReward: 0.0000016
  },
  {
    badgeId: "social-connector",
    name: "Social Connector",
    description: "Invite 10 friends",
    icon: "🤝",
    rarity: "rare",
    requirement: "10 referrals",
    piReward: 0.0000048
  },
  {
    badgeId: "review-master",
    name: "Review Master",
    description: "Write 20 helpful reviews",
    icon: "⭐",
    rarity: "rare",
    requirement: "20 reviews",
    piReward: 0.0000048
  },
  {
    badgeId: "globe-trotter",
    name: "Globe Trotter",
    description: "Book properties in 10 different cities",
    icon: "🌍",
    rarity: "epic",
    requirement: "10 cities",
    piReward: 0.000013
  },
  {
    badgeId: "party-legend",
    name: "Party Legend",
    description: "Host 50 successful events",
    icon: "👑",
    rarity: "epic",
    requirement: "50 party bookings",
    piReward: 0.000013
  },
  {
    badgeId: "super-host",
    name: "Super Host",
    description: "Maintain 4.9+ rating with 100+ bookings",
    icon: "💎",
    rarity: "legendary",
    requirement: "100 bookings, 4.9+ rating",
    piReward: 0.000032
  },
  {
    badgeId: "community-champion",
    name: "Community Champion",
    description: "Contribute 0.0003 Pi to community causes",
    icon: "🏆",
    rarity: "legendary",
    requirement: "0.0003 Pi donations",
    piReward: 0.000032
  },
  {
    badgeId: "eco-warrior",
    name: "Eco Warrior",
    description: "Offset 500kg of carbon",
    icon: "🌱",
    rarity: "epic",
    requirement: "500kg CO2 offset",
    piReward: 0.000013
  },
  {
    badgeId: "streak-master",
    name: "Streak Master",
    description: "Maintain 30-day login streak",
    icon: "🔥",
    rarity: "rare",
    requirement: "30-day streak",
    piReward: 0.0000048
  }
]

export class GamificationManager {
  private userLevels: Map<string, UserLevel> = new Map()
  private userBadges: Map<string, UserBadge[]> = new Map()
  private piRewards: Map<string, PiReward[]> = new Map()
  private referrals: Map<string, ReferralProgram[]> = new Map()
  private streaks: Map<string, StreakBonus> = new Map()

  // Level & XP System
  async addXP(userId: string, amount: number, source: string): Promise<UserLevel> {
    let userLevel = this.userLevels.get(userId) || this.createNewUser(userId)
    
    userLevel.xp += amount
    console.log("[v0] XP added:", { userId, amount, source, newXP: userLevel.xp })

    // Check for level up
    while (userLevel.xp >= userLevel.xpToNextLevel) {
      userLevel = await this.levelUp(userId, userLevel)
    }

    this.userLevels.set(userId, userLevel)
    return userLevel
  }

  private async levelUp(userId: string, currentLevel: UserLevel): Promise<UserLevel> {
    const newLevel = currentLevel.currentLevel + 1
    const levelConfig = levelTitles.find(l => l.level === newLevel)
    
    if (!levelConfig) return currentLevel

    const nextLevelConfig = levelTitles.find(l => l.level === newLevel + 1)
    
    const updatedLevel: UserLevel = {
      ...currentLevel,
      currentLevel: newLevel,
      title: levelConfig.title,
      xpToNextLevel: nextLevelConfig?.xpRequired || 999999,
      benefits: this.getLevelBenefits(newLevel)
    }

    console.log("[v0] LEVEL UP!", { userId, newLevel, title: levelConfig.title })
    
    // Award level up bonus (π0.0000016 per level based on 1 Pi = $314,159)
    await this.awardPi(userId, newLevel * 0.0000016, "achievement", `Level ${newLevel} Bonus`)

    return updatedLevel
  }

  private createNewUser(userId: string): UserLevel {
    return {
      userId,
      currentLevel: 1,
      xp: 0,
      xpToNextLevel: 100,
      title: "Newbie",
      benefits: this.getLevelBenefits(1)
    }
  }

  private getLevelBenefits(level: number): string[] {
    const benefits: string[] = []
    
    if (level >= 2) benefits.push("5% booking discount")
    if (level >= 3) benefits.push("Priority customer support")
    if (level >= 5) benefits.push("Exclusive properties access")
    if (level >= 7) benefits.push("Free party package monthly")
    if (level >= 10) benefits.push("VIP concierge service")
    
    return benefits
  }

  getUserLevel(userId: string): UserLevel {
    return this.userLevels.get(userId) || this.createNewUser(userId)
  }

  // Badge System
  async awardBadge(userId: string, badgeId: string): Promise<void> {
    const badge = badges.find(b => b.badgeId === badgeId)
    if (!badge) return

    const userBadges = this.userBadges.get(userId) || []
    
    // Check if already earned
    if (userBadges.some(ub => ub.badgeId === badgeId)) {
      console.log("[v0] Badge already earned:", badgeId)
      return
    }

    const userBadge: UserBadge = {
      userId,
      badgeId,
      earnedAt: new Date(),
      displayOnProfile: true
    }

    userBadges.push(userBadge)
    this.userBadges.set(userId, userBadges)

    console.log("[v0] Badge awarded:", badge.name)

    // Award Pi reward
    await this.awardPi(userId, badge.piReward, "achievement", `Badge: ${badge.name}`)
    
    // Award XP based on rarity
    const xpRewards = { common: 50, rare: 100, epic: 200, legendary: 500 }
    await this.addXP(userId, xpRewards[badge.rarity], `Badge: ${badge.name}`)
  }

  getUserBadges(userId: string): Badge[] {
    const userBadges = this.userBadges.get(userId) || []
    return userBadges
      .map(ub => badges.find(b => b.badgeId === ub.badgeId))
      .filter(b => b !== undefined) as Badge[]
  }

  checkBadgeProgress(userId: string, stats: {
    bookingCount: number
    reviewCount: number
    referralCount: number
    citiesVisited: number
    carbonOffset: number
    donations: number
    streak: number
  }): { badge: Badge; progress: number; completed: boolean }[] {
    const progress = []

    if (stats.bookingCount >= 1) {
      progress.push({ badge: badges[0], progress: 100, completed: true })
    }
    if (stats.bookingCount >= 5) {
      progress.push({ badge: badges[1], progress: 100, completed: true })
    }
    if (stats.referralCount >= 10) {
      progress.push({ badge: badges[2], progress: (stats.referralCount / 10) * 100, completed: stats.referralCount >= 10 })
    }
    if (stats.reviewCount >= 20) {
      progress.push({ badge: badges[3], progress: (stats.reviewCount / 20) * 100, completed: stats.reviewCount >= 20 })
    }

    return progress
  }

  // Pi Rewards System
  async awardPi(
    userId: string,
    amount: number,
    source: PiReward["source"],
    description: string
  ): Promise<PiReward> {
    const rewardId = `PI-${Date.now()}`
    
    const reward: PiReward = {
      rewardId,
      userId,
      amount,
      source,
      description,
      timestamp: new Date(),
      status: "completed"
    }

    const userRewards = this.piRewards.get(userId) || []
    userRewards.push(reward)
    this.piRewards.set(userId, userRewards)

    console.log("[v0] Pi rewarded:", { userId, amount, source })
    return reward
  }

  getUserPiBalance(userId: string): number {
    const rewards = this.piRewards.get(userId) || []
    return rewards
      .filter(r => r.status === "completed")
      .reduce((sum, r) => sum + r.amount, 0)
  }

  // Referral Program
  async createReferral(referrerId: string, referredEmail: string): Promise<ReferralProgram> {
    const referralId = `REF-${Date.now()}`
    
    const referral: ReferralProgram = {
      referralId,
      referrerId,
      referredUserId: "",
      referredUserEmail: referredEmail,
      status: "invited",
      referrerReward: 0.0000095,
      referredReward: 0.0000064,
      createdAt: new Date()
    }

    const userReferrals = this.referrals.get(referrerId) || []
    userReferrals.push(referral)
    this.referrals.set(referrerId, userReferrals)

    console.log("[v0] Referral created:", referralId)
    return referral
  }

  async completeReferral(referralId: string, referredUserId: string): Promise<void> {
    for (const [userId, referrals] of this.referrals.entries()) {
      const referral = referrals.find(r => r.referralId === referralId)
      if (referral) {
        referral.status = "completed_first_booking"
        referral.referredUserId = referredUserId
        referral.completedAt = new Date()

        // Award both users
        await this.awardPi(userId, referral.referrerReward, "referral", "Friend Referral Bonus")
        await this.awardPi(referredUserId, referral.referredReward, "referral", "Welcome Bonus")
        
        await this.addXP(userId, 100, "Referral")
        
        console.log("[v0] Referral completed:", referralId)
        return
      }
    }
  }

  getUserReferrals(userId: string): ReferralProgram[] {
    return this.referrals.get(userId) || []
  }

  // Streak System
  async updateStreak(userId: string, type: StreakBonus["streakType"]): Promise<StreakBonus> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let streak = this.streaks.get(`${userId}-${type}`)
    
    if (!streak) {
      streak = {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        streakType: type,
        bonusMultiplier: 1.0
      }
    } else {
      const lastDate = new Date(streak.lastActivityDate)
      lastDate.setHours(0, 0, 0, 0)
      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        // Continue streak
        streak.currentStreak++
        streak.lastActivityDate = today
        
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak
        }
        
        // Calculate bonus multiplier
        streak.bonusMultiplier = 1.0 + Math.min(streak.currentStreak * 0.05, 1.0)
        
        console.log("[v0] Streak continued:", streak.currentStreak)
      } else if (daysDiff > 1) {
        // Streak broken
        console.log("[v0] Streak broken at:", streak.currentStreak)
        streak.currentStreak = 1
        streak.lastActivityDate = today
        streak.bonusMultiplier = 1.0
      }
    }
    
    this.streaks.set(`${userId}-${type}`, streak)
    
    // Award streak milestones
    if (streak.currentStreak === 7) {
      await this.awardPi(userId, 0.0000032, "streak", "7-Day Streak Bonus")
    }
    if (streak.currentStreak === 30) {
      await this.awardBadge(userId, "streak-master")
    }
    
    return streak
  }

  getUserStreak(userId: string, type: StreakBonus["streakType"]): StreakBonus | null {
    return this.streaks.get(`${userId}-${type}`) || null
  }

  // Daily Challenges
  getDailyChallenges(date: Date): DailyChallenge[] {
    return [
      {
        challengeId: `daily-${date.toDateString()}-1`,
        title: "Property Explorer",
        description: "View 5 different properties",
        requirement: "5 views",
        reward: 0.00000095,
        validDate: date,
        completed: false
      },
      {
        challengeId: `daily-${date.toDateString()}-2`,
        title: "Social Sharer",
        description: "Share a property with friends",
        requirement: "1 share",
        reward: 0.0000019,
        validDate: date,
        completed: false
      },
      {
        challengeId: `daily-${date.toDateString()}-3`,
        title: "Review Writer",
        description: "Write a detailed review",
        requirement: "1 review",
        reward: 0.0000038,
        validDate: date,
        completed: false
      }
    ]
  }

  async completeDailyChallenge(userId: string, challengeId: string): Promise<void> {
    const challenge = this.getDailyChallenges(new Date()).find(c => c.challengeId === challengeId)
    if (!challenge) return

    await this.awardPi(userId, challenge.reward, "daily", `Daily: ${challenge.title}`)
    await this.addXP(userId, 25, "Daily Challenge")
    
    console.log("[v0] Daily challenge completed:", challenge.title)
  }
}

// Export singleton
export const gamificationManager = new GamificationManager()
