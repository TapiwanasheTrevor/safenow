"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { alertService } from "@/services/alertService"
import { useApp } from "@/context/AppContext"

export function EmergencyButton() {
  const [isTriggering, setIsTriggering] = useState(false)
  const router = useRouter()
  const { showNotification } = useApp()

  const handleEmergencyClick = async () => {
    setIsTriggering(true)

    try {
      await alertService.triggerEmergencyAlert()
      router.push("/alert")
    } catch (error) {
      showNotification("Failed to trigger alert", "error")
    } finally {
      setIsTriggering(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        size="lg"
        onClick={handleEmergencyClick}
        disabled={isTriggering}
        className="w-48 h-48 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg emergency-pulse"
      >
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="w-16 h-16" />
          <span className="text-xl font-bold">{isTriggering ? "Alerting..." : "EMERGENCY"}</span>
        </div>
      </Button>
      <p className="text-sm text-muted-foreground text-center">Tap to send emergency alert to your contacts</p>
    </div>
  )
}
