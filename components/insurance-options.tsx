"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Shield, Check } from "lucide-react"

interface InsuranceOption {
  id: string
  name: string
  price: number
  coverage: number
  features: string[]
  recommended?: boolean
}

interface InsuranceOptionsProps {
  bookingAmount: number
  onSelect: (option: InsuranceOption | null) => void
}

export function InsuranceOptions({ bookingAmount, onSelect }: InsuranceOptionsProps) {
  const [selectedId, setSelectedId] = useState<string>("none")

  const options: InsuranceOption[] = [
    {
      id: "basic",
      name: "Basic Protection",
      price: bookingAmount * 0.03,
      coverage: 5000,
      features: [
        "Property damage coverage",
        "Personal liability up to $5,000",
        "24/7 support hotline"
      ]
    },
    {
      id: "standard",
      name: "Standard Protection",
      price: bookingAmount * 0.05,
      coverage: 10000,
      features: [
        "Property damage coverage",
        "Personal liability up to $10,000",
        "Medical expenses coverage",
        "24/7 support hotline",
        "Noise complaint assistance"
      ],
      recommended: true
    },
    {
      id: "premium",
      name: "Premium Protection",
      price: bookingAmount * 0.08,
      coverage: 25000,
      features: [
        "Comprehensive property damage",
        "Personal liability up to $25,000",
        "Medical expenses coverage",
        "24/7 priority support",
        "Noise complaint assistance",
        "Party incident coverage",
        "Legal consultation"
      ]
    }
  ]

  const handleSelect = (value: string) => {
    setSelectedId(value)
    if (value === "none") {
      onSelect(null)
    } else {
      const option = options.find(o => o.id === value)
      if (option) {
        onSelect(option)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Insurance Protection
        </CardTitle>
        <CardDescription>
          Protect yourself from unexpected incidents during your stay
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedId} onValueChange={handleSelect}>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 border rounded-lg p-3">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none" className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">No Insurance</p>
                  <p className="text-xs text-muted-foreground">Continue without protection</p>
                </div>
              </Label>
              <span className="font-semibold">π0</span>
            </div>

            {options.map((option) => (
              <div
                key={option.id}
                className={`relative flex items-start space-x-3 border rounded-lg p-3 ${
                  option.recommended ? "border-primary bg-primary/5" : ""
                }`}
              >
                {option.recommended && (
                  <Badge className="absolute -top-2 right-2" variant="default">
                    Recommended
                  </Badge>
                )}
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer min-w-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm line-clamp-1">{option.name}</p>
                      <span className="font-bold text-primary text-xs shrink-0 font-mono">π{option.price.toFixed(6)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Coverage up to ${option.coverage.toLocaleString()}
                    </p>
                    <ul className="space-y-1">
                      {option.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs min-w-0">
                          <Check className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
                          <span className="flex-1 leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
