"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Layout/Header"
import { Navigation } from "@/components/Layout/Navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { storageService } from "@/services/storageService"
import { MapPin, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function AlertHistoryPage() {
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    const history = storageService.getAlertHistory()
    setAlerts(history.reverse()) // Most recent first
  }, [])

  return (
    <div className="min-h-screen pb-20">
      <Header title="Alert History" />
      <main className="max-w-lg mx-auto p-4 space-y-4">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No emergency alerts sent yet</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <CardTitle className="text-base">Emergency Alert</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(alert.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{alert.contactsAlerted} contacts alerted</span>
                </div>
                {alert.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`https://www.google.com/maps?q=${alert.location.lat},${alert.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View location
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}

        <Link href="/">
          <Button variant="outline" className="w-full bg-transparent">
            Back to Home
          </Button>
        </Link>
      </main>
      <Navigation />
    </div>
  )
}
