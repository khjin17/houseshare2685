"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  title?: string
  onClick?: () => void
}

export function BackButton({ title, onClick }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.back()
    }
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="flex items-center p-4">
        <Button variant="ghost" size="icon" onClick={handleClick}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {title && <h1 className="font-heading font-bold text-xl ml-3">{title}</h1>}
      </div>
    </header>
  )
}
