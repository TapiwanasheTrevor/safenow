"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, MessageSquare, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { locationService } from "@/services/locationService"
import { storageService } from "@/services/storageService"
import { alertService } from "@/services/alertService"
import { useRouter } from "next/navigation"
import { ContactsList } from "./ContactsList"

export function AlertManager() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)
  const [contacts, setContacts] = useState<any[]>([])
  const [alertSent, setAlertSent] = useState(false)
  const [error, setError] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Get location
    setIsLoadingLocation(true)
    const loc = await locationService.getCurrentLocation()
    setLocation(loc)
    setIsLoadingLocation(false)

    // Get contacts
    const profile = storageService.getUserProfile()
    if (profile?.emergencyContacts) {
      setContacts(profile.emergencyContacts)
    } else {
      setError("No emergency contacts configured")
    }
  }

  const handleSendAlert = () => {
    if (contacts.length === 0) {
      setError("Please add emergency contacts in your profile first")
      return
    }

    const message = alertService.formatAlertMessage(location)

    contacts.forEach((contact) => {
      alertService.openMessagingApp(contact, message)
    })

    // Log alert
    const alertHistory = storageService.getAlertHistory()
    alertHistory.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      location,
      contactsAlerted: contacts.length,
    })
    storageService.saveAlertHistory(alertHistory)

    setAlertSent(true)
  }

  const handleCancel = () => {
    router.push("/")
  }

  if (error && contacts.length === 0) {
    return (
      <div className="p-4 space-y-4">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/profile")} className="w-full">
          Add Emergency Contacts
        </Button>
        <Button onClick={handleCancel} variant="outline" className="w-full bg-transparent">
          Cancel
        </Button>
      </div>
    )
  }

  if (alertSent) {
    return (
      <div className="p-4 space-y-4">
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Emergency alert has been sent to your contacts!
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Alert Sent Successfully</CardTitle>
            <CardDescription>Your emergency contacts have been notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Contacts Alerted: {contacts.length}</p>
              <ul className="space-y-1">
                {contacts.map((contact) => (
                  <li key={contact.id} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    {contact.name} ({contact.preferredMethod})
                  </li>
                ))}
              </ul>
            </div>

            {location && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">Your Location:</p>
                <p className="text-sm text-muted-foreground">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  View on Google Maps
                </a>
              </div>
            )}

            <Button onClick={() => router.push("/")} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <Alert variant="destructive">
        <AlertDescription className="font-semibold">You are about to send an emergency alert!</AlertDescription>
      </Alert>

      {/* Location Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Your Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLocation ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Getting your location...
            </div>
          ) : location ? (
            <div className="space-y-2">
              <p className="text-sm font-mono">{locationService.formatLocationAsAddress(location.lat, location.lng)}</p>
              <a
                href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                Preview on Google Maps
              </a>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Location unavailable - alert will be sent without location</p>
          )}
        </CardContent>
      </Card>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Emergency Contacts</CardTitle>
          <CardDescription>These contacts will receive your alert</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactsList contacts={contacts} showActions={false} />
        </CardContent>
      </Card>

      {/* Alert Message Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alert Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-semibold text-destructive">EMERGENCY! I need help!</p>
            {location && (
              <p className="text-sm text-muted-foreground mt-1">
                Location: https://www.google.com/maps?q={location.lat},{location.lng}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button onClick={handleSendAlert} className="w-full bg-destructive hover:bg-destructive/90" size="lg">
          <MessageSquare className="w-4 h-4 mr-2" />
          Send Emergency Alert
        </Button>
        <Button onClick={handleCancel} variant="outline" className="w-full bg-transparent">
          Cancel
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        This will open your messaging apps with pre-filled messages for each contact
      </p>
    </div>
  )
}
