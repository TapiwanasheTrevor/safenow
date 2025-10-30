"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Layout/Header"
import { Navigation } from "@/components/Layout/Navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, CheckCircle, Smartphone } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setIsInstalled(true)
    }

    setDeferredPrompt(null)
  }

  return (
    <div className="min-h-screen pb-20">
      <Header title="Install SafeNow" />
      <main className="max-w-lg mx-auto p-4 space-y-4">
        {isInstalled ? (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              SafeNow is installed! You can access it from your home screen.
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Install SafeNow
              </CardTitle>
              <CardDescription>Add SafeNow to your home screen for quick access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <p>Installing SafeNow as an app gives you:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Faster access from your home screen</li>
                  <li>Full offline functionality</li>
                  <li>Native app-like experience</li>
                  <li>No browser address bar</li>
                </ul>
              </div>

              {deferredPrompt ? (
                <Button onClick={handleInstall} className="w-full" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Install Now
                </Button>
              ) : (
                <Alert>
                  <AlertDescription className="text-sm">
                    To install on iOS: Tap the share button and select "Add to Home Screen"
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Why Install?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>
              SafeNow works completely offline once installed. All emergency guides, voice commands, and your medical
              information are stored on your device.
            </p>
            <p>In an emergency, every second counts. Having SafeNow on your home screen means instant access.</p>
          </CardContent>
        </Card>
      </main>
      <Navigation />
    </div>
  )
}
