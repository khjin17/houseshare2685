"use client"

import { useState } from "react"
import { BackButton } from "@/components/back-button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

export default function LanguagePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("ko")

  const languages = [
    { code: "ko", name: "한국어", nativeName: "한국어" },
    { code: "en", name: "English", nativeName: "English" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "zh", name: "Chinese", nativeName: "中文" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
  ]

  return (
    <div className="min-h-screen bg-background pb-6">
      <BackButton title="언어 설정" />

      <main className="px-4 py-6">
        <Card>
          <CardContent className="p-4">
            <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage}>
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                >
                  <Label htmlFor={lang.code} className="flex-1 cursor-pointer">
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-sm text-muted-foreground">{lang.name}</div>
                  </Label>
                  <div className="flex items-center gap-3">
                    {selectedLanguage === lang.code && <Check className="h-5 w-5 text-primary" />}
                    <RadioGroupItem value={lang.code} id={lang.code} />
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
