"use client"

import { useState } from "react"
import { Calculator, X, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const PI_PRICE_USD = 314159

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "KRW", symbol: "₩", name: "Korean Won", rate: 1350 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 149 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 7.24 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.52 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.36 },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", rate: 1.34 },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", rate: 7.83 },
]

export function PiCalculator() {
  const [open, setOpen] = useState(false)
  const [piAmount, setPiAmount] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [mode, setMode] = useState<"pi-to-fiat" | "fiat-to-pi">("pi-to-fiat")

  const currency = currencies.find((c) => c.code === selectedCurrency) || currencies[0]
  
  const convertPiToFiat = (pi: number) => {
    return pi * PI_PRICE_USD * currency.rate
  }

  const convertFiatToPi = (fiat: number) => {
    return fiat / (PI_PRICE_USD * currency.rate)
  }

  const result = piAmount && !isNaN(parseFloat(piAmount))
    ? mode === "pi-to-fiat"
      ? convertPiToFiat(parseFloat(piAmount))
      : convertFiatToPi(parseFloat(piAmount))
    : 0

  const formatNumber = (num: number, isPi: boolean) => {
    if (isPi) {
      return num < 0.000001 ? num.toFixed(8) : num.toFixed(6)
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-20 right-4 h-16 w-16 rounded-full shadow-2xl gradient-secondary hover:scale-110 transition-all z-50 glow-gold border-2 border-secondary/30"
      >
        <Calculator className="h-7 w-7 text-white" />
      </Button>

      {/* Calculator Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Pi Currency Calculator
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={mode === "pi-to-fiat" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("pi-to-fiat")}
                className="flex-1 text-xs"
              >
                Pi → Currency
              </Button>
              <Button
                variant={mode === "fiat-to-pi" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("fiat-to-pi")}
                className="flex-1 text-xs"
              >
                Currency → Pi
              </Button>
            </div>

            {/* Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">
                {mode === "pi-to-fiat" ? "Pi Amount" : `${currency.name} Amount`}
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder={mode === "pi-to-fiat" ? "0.000000" : "0.00"}
                value={piAmount}
                onChange={(e) => setPiAmount(e.target.value)}
                step={mode === "pi-to-fiat" ? "0.000001" : "0.01"}
                className="font-mono"
              />
            </div>

            {/* Currency Selector */}
            {mode === "pi-to-fiat" && (
              <div className="space-y-2">
                <Label htmlFor="currency">Convert To</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.code} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {mode === "fiat-to-pi" && (
              <div className="space-y-2">
                <Label htmlFor="currency">From Currency</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.code} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Result */}
            {piAmount && !isNaN(parseFloat(piAmount)) && (
              <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Result</p>
                <p className="text-2xl font-bold font-mono text-primary">
                  {mode === "pi-to-fiat" 
                    ? `${currency.symbol}${formatNumber(result, false)}`
                    : `π${formatNumber(result, true)}`
                  }
                </p>
              </div>
            )}

            {/* Exchange Rate Info */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <TrendingUp className="h-3 w-3" />
                <span>Current Exchange Rates</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>1 Pi</span>
                  <span className="font-medium">= ${PI_PRICE_USD.toLocaleString()} USD</span>
                </div>
                {selectedCurrency !== "USD" && (
                  <div className="flex justify-between">
                    <span>1 Pi</span>
                    <span className="font-medium">
                      = {currency.symbol}{formatNumber(PI_PRICE_USD * currency.rate, false)} {currency.code}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Conversions */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Quick Convert</p>
              <div className="grid grid-cols-3 gap-2">
                {[0.0001, 0.001, 0.01].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPiAmount(amount.toString())
                      setMode("pi-to-fiat")
                    }}
                    className="text-xs h-8"
                  >
                    π{amount}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
