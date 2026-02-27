"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Shield,
  Users,
  Leaf,
  Trophy,
  Lock,
  Zap,
  Heart,
  Star,
  Gift,
  TrendingUp,
  Globe,
  Award,
  Bell,
  MessageSquare
} from "lucide-react"

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState("party")

  const features = {
    party: [
      {
        icon: <Sparkles className="h-8 w-8 text-primary" />,
        title: "Party Packages",
        description: "Professional sound systems, lighting, catering, and decoration packages",
        benefits: ["Sound Equipment", "LED Lighting", "Catering Services", "Party Cleanup"]
      },
      {
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: "Noise Deposit Protection",
        description: "Refundable deposit automatically returned if no issues reported",
        benefits: ["Auto Refund", "Smart Contract", "24h Processing", "Transparent"]
      },
      {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Guest Management",
        description: "Flexible guest pricing with additional guest fees calculated automatically",
        benefits: ["Dynamic Pricing", "Group Discounts", "Max Capacity", "Fair Rates"]
      }
    ],
    blockchain: [
      {
        icon: <Award className="h-8 w-8 text-primary" />,
        title: "NFT Property Badges",
        description: "Verified properties receive blockchain-certified NFT badges",
        benefits: ["Verified Authentic", "Immutable Records", "Trust Score", "Premium Status"]
      },
      {
        icon: <Lock className="h-8 w-8 text-primary" />,
        title: "Smart Contract Deposits",
        description: "Automated deposit management with transparent conditions",
        benefits: ["Auto Release", "Condition-based", "Transparent", "Secure"]
      },
      {
        icon: <Star className="h-8 w-8 text-primary" />,
        title: "Blockchain Reviews",
        description: "Immutable, tamper-proof reviews stored on blockchain",
        benefits: ["Cannot Edit", "Verified Guests", "Permanent", "Trustworthy"]
      },
      {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: "Pi Staking Rewards",
        description: "Stake Pi tokens to earn rewards and unlock exclusive benefits",
        benefits: ["Fee Discounts", "Priority Booking", "Higher APY", "VIP Access"]
      }
    ],
    social: [
      {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Group Booking & Split Payment",
        description: "Book with friends and automatically split costs in Pi",
        benefits: ["Auto Split", "Easy Invites", "Track Payments", "Fair Division"]
      },
      {
        icon: <Heart className="h-8 w-8 text-primary" />,
        title: "Shared Wishlists",
        description: "Create and share wishlists with friends for collaborative planning",
        benefits: ["Vote on Properties", "Comment", "Plan Together", "Share Ideas"]
      },
      {
        icon: <MessageSquare className="h-8 w-8 text-primary" />,
        title: "Party Planner Matching",
        description: "Connect with professional party planners for your event",
        benefits: ["Expert Planners", "Portfolio Review", "Ratings", "Direct Booking"]
      },
      {
        icon: <Globe className="h-8 w-8 text-primary" />,
        title: "Event Gallery",
        description: "Share photos from your parties (with guest permission)",
        benefits: ["Photo Sharing", "Privacy Controls", "Memories", "Inspiration"]
      }
    ],
    ai: [
      {
        icon: <Sparkles className="h-8 w-8 text-primary" />,
        title: "AI Party Concierge",
        description: "Personalized property recommendations based on your preferences",
        benefits: ["Smart Matching", "Learn Preferences", "Best Deals", "Save Time"]
      },
      {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: "Dynamic Pricing",
        description: "Real-time price optimization based on demand and market conditions",
        benefits: ["Fair Prices", "Best Times", "Save Money", "Transparent"]
      },
      {
        icon: <Lock className="h-8 w-8 text-primary" />,
        title: "Smart Lock Integration",
        description: "Automated check-in/out with temporary access codes",
        benefits: ["Keyless Entry", "Auto Codes", "Secure", "Convenient"]
      },
      {
        icon: <MessageSquare className="h-8 w-8 text-primary" />,
        title: "Voice Assistant",
        description: "Search properties and make bookings using voice commands",
        benefits: ["Hands-free", "Natural Language", "Quick Search", "Easy Booking"]
      }
    ],
    sustainability: [
      {
        icon: <Leaf className="h-8 w-8 text-primary" />,
        title: "Eco-Friendly Properties",
        description: "Browse properties with green certifications and sustainable features",
        benefits: ["Solar Power", "Water Saving", "Recycling", "Green Certified"]
      },
      {
        icon: <Globe className="h-8 w-8 text-primary" />,
        title: "Carbon Offset Program",
        description: "Calculate and offset your booking's carbon footprint with Pi",
        benefits: ["Track Emissions", "Offset Projects", "Certificates", "Make Impact"]
      },
      {
        icon: <Heart className="h-8 w-8 text-primary" />,
        title: "Local Business Support",
        description: "Discover nearby local businesses with exclusive discounts",
        benefits: ["Local Deals", "Pi Accepted", "Support Community", "Coupons"]
      },
      {
        icon: <Gift className="h-8 w-8 text-primary" />,
        title: "Community Contributions",
        description: "Donate Pi to local causes with each booking",
        benefits: ["Give Back", "Track Impact", "Tax Receipt", "Feel Good"]
      }
    ],
    gamification: [
      {
        icon: <Trophy className="h-8 w-8 text-primary" />,
        title: "Level & XP System",
        description: "Earn XP and level up to unlock exclusive benefits",
        benefits: ["10 Levels", "Unlock Perks", "Progress", "Achievements"]
      },
      {
        icon: <Award className="h-8 w-8 text-primary" />,
        title: "Badge Collection",
        description: "Earn badges for achievements from common to legendary",
        benefits: ["Collect All", "Show Off", "Pi Rewards", "Rare Badges"]
      },
      {
        icon: <Gift className="h-8 w-8 text-primary" />,
        title: "Pi Rewards Program",
        description: "Earn Pi for bookings, reviews, referrals, and more",
        benefits: ["Multiple Ways", "Auto Rewards", "Track Earnings", "Spend Pi"]
      },
      {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Referral Bonuses",
        description: "Invite friends and both get Pi rewards",
        benefits: ["50 Pi Each", "Unlimited", "Track Referrals", "Easy Sharing"]
      },
      {
        icon: <Zap className="h-8 w-8 text-primary" />,
        title: "Daily Challenges",
        description: "Complete daily tasks to earn bonus Pi and XP",
        benefits: ["New Daily", "Quick Tasks", "Extra Pi", "Keep Streaks"]
      },
      {
        icon: <Bell className="h-8 w-8 text-primary" />,
        title: "Streak Bonuses",
        description: "Maintain activity streaks for multiplier bonuses",
        benefits: ["Bonus Multiplier", "Track Streaks", "Milestone Rewards", "Stay Active"]
      }
    ],
    safety: [
      {
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: "Emergency Contact System",
        description: "Add trusted contacts to be notified in emergencies",
        benefits: ["Quick Access", "Auto Notify", "Multiple Contacts", "Peace of Mind"]
      },
      {
        icon: <Bell className="h-8 w-8 text-primary" />,
        title: "Real-time Safety Check-in",
        description: "Scheduled check-ins with automatic emergency response",
        benefits: ["Auto Check", "Emergency Alert", "24/7 Monitoring", "Quick Response"]
      },
      {
        icon: <Shield className="h-8 w-8 text-primary" />,
        title: "Party Insurance",
        description: "Comprehensive insurance coverage for events and parties",
        benefits: ["Property Damage", "Liability", "Medical", "Affordable"]
      },
      {
        icon: <Award className="h-8 w-8 text-primary" />,
        title: "Identity Verification",
        description: "Pi Network KYC and additional verification options",
        benefits: ["Verified Users", "Trust Score", "Secure", "Multiple Methods"]
      },
      {
        icon: <Star className="h-8 w-8 text-primary" />,
        title: "Safety Ratings",
        description: "Comprehensive safety scores for every property",
        benefits: ["Fire Safety", "Security", "Inspections", "Certifications"]
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <BackButton />
        
        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">All Features</h1>
          <p className="text-muted-foreground">
            Discover everything that makes houseshare the most advanced party rental platform
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full mb-8 h-auto">
            <TabsTrigger value="party" className="text-xs sm:text-sm">Party</TabsTrigger>
            <TabsTrigger value="blockchain" className="text-xs sm:text-sm">Blockchain</TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm">Social</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs sm:text-sm">AI</TabsTrigger>
            <TabsTrigger value="sustainability" className="text-xs sm:text-sm">Eco</TabsTrigger>
            <TabsTrigger value="gamification" className="text-xs sm:text-sm">Rewards</TabsTrigger>
            <TabsTrigger value="safety" className="text-xs sm:text-sm">Safety</TabsTrigger>
          </TabsList>

          {Object.entries(features).map(([key, items]) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {items.map((feature, index) => (
                  <Card key={index} className="hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="shrink-0">{feature.icon}</div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base sm:text-lg line-clamp-2 leading-tight">{feature.title}</CardTitle>
                          </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-xs">New</Badge>
                      </div>
                      <CardDescription className="mt-2 text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold mb-3">Key Benefits:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {feature.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm min-w-0">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                              <span className="text-muted-foreground leading-tight flex-1">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">All Features Powered by Pi Network</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Every transaction, reward, and payment uses Pi cryptocurrency for a seamless, 
                  decentralized experience. No credit cards, no banks, just pure Pi.
                </p>
                <Button className="w-full sm:w-auto">
                  Start Exploring Properties
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
