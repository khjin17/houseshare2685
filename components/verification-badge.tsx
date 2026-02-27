"use client"

import { Shield, CheckCircle, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VerificationBadgeProps {
  hasNFT?: boolean
  verificationLevel?: "basic" | "verified" | "premium"
  className?: string
}

export function VerificationBadge({ hasNFT = false, verificationLevel = "basic", className = "" }: VerificationBadgeProps) {
  if (!hasNFT && verificationLevel === "basic") return null

  const badgeConfig = {
    basic: {
      icon: Shield,
      color: "bg-gray-500/10 text-gray-700 border-gray-500/30",
      label: "Registered",
    },
    verified: {
      icon: CheckCircle,
      color: "bg-blue-500/10 text-blue-700 border-blue-500/30",
      label: "Verified",
    },
    premium: {
      icon: Award,
      color: "bg-amber-500/10 text-amber-700 border-amber-500/30",
      label: "Premium NFT",
    },
  }

  const config = badgeConfig[verificationLevel]
  const Icon = config.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${config.color} ${className} gap-1`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {verificationLevel === "premium" && "This property has a verified NFT certificate"}
            {verificationLevel === "verified" && "This property has been verified by houseshare"}
            {verificationLevel === "basic" && "This property is registered"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
