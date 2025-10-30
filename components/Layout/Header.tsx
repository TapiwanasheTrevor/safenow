"use client"

import { useApp } from "@/context/AppContext"
import { Wifi, WifiOff } from "lucide-react"

export function Header({ title }: { title: string }) {
  const { isOnline } = useApp()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-14 items-center justify-between px-4 max-w-lg mx-auto">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="w-5 h-5 text-success" /> : <WifiOff className="w-5 h-5 text-muted-foreground" />}
        </div>
      </div>
    </header>
  )
}
