"use client"

import { usePathname } from "next/navigation"
import { Home, Heart, User, MessageSquare, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function BottomNav() {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 glass border-t-2 border-primary/10 z-40 backdrop-blur-2xl">
      <div className="flex items-center justify-around py-2">
        <Link href="/">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex flex-col items-center gap-1 h-auto py-2 transition-all ${
              isActive("/") ? "text-primary scale-110" : "text-muted-foreground"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Button>
        </Link>

        <Link href="/features">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex flex-col items-center gap-1 h-auto py-2 transition-all ${
              isActive("/features") ? "text-secondary scale-110" : "text-muted-foreground"
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-medium">Features</span>
          </Button>
        </Link>

        <Link href="/favorites">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex flex-col items-center gap-1 h-auto py-2 transition-all ${
              isActive("/favorites") ? "text-primary scale-110" : "text-muted-foreground"
            }`}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs font-medium">Favorites</span>
          </Button>
        </Link>

        <Link href="/messages">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex flex-col items-center gap-1 h-auto py-2 transition-all ${
              isActive("/messages") ? "text-accent scale-110" : "text-muted-foreground"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs font-medium">Messages</span>
          </Button>
        </Link>

        <Link href="/profile">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex flex-col items-center gap-1 h-auto py-2 transition-all ${
              isActive("/profile") ? "text-primary scale-110" : "text-muted-foreground"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">Profile</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
