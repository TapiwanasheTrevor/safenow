"use client"
import { Header } from "@/components/Layout/Header"
import { Navigation } from "@/components/Layout/Navigation"
import { EmergencyButton } from "@/components/Home/EmergencyButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, User, Mic, AlertCircle, History } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/context/UserContext"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function HomePage() {
  const { profile } = useUser()

  const hasContacts = profile?.emergencyContacts && profile.emergencyContacts.length > 0
  const hasPersonalInfo = profile?.personal?.name && profile?.personal?.age

  return (
    <div className="min-h-screen pb-20">
      <Header title="SafeNow" />

      <main className="max-w-lg mx-auto p-4 space-y-6">
        {(!hasContacts || !hasPersonalInfo) && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <Link href="/profile" className="font-semibold hover:underline">
                Complete your profile
              </Link>{" "}
              to enable emergency alerts
            </AlertDescription>
          </Alert>
        )}

        {/* Emergency Alert Button */}
        <EmergencyButton />

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/first-aid">
            <Card className="cursor-pointer hover:bg-accent transition-colors h-full">
              <CardHeader className="pb-3">
                <Heart className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-base">First Aid</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">Emergency guides & instructions</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/voice">
            <Card className="cursor-pointer hover:bg-accent transition-colors h-full">
              <CardHeader className="pb-3">
                <Mic className="w-8 h-8 text-secondary mb-2" />
                <CardTitle className="text-base">Voice Control</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">Hands-free commands</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile">
            <Card className="cursor-pointer hover:bg-accent transition-colors h-full">
              <CardHeader className="pb-3">
                <User className="w-8 h-8 text-secondary mb-2" />
                <CardTitle className="text-base">My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">Medical info & contacts</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/alert/history">
            <Card className="cursor-pointer hover:bg-accent transition-colors h-full">
              <CardHeader className="pb-3">
                <History className="w-8 h-8 text-muted-foreground mb-2" />
                <CardTitle className="text-base">Alert History</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">View past alerts</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>How SafeNow Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <p>• Access emergency first-aid guides offline</p>
            <p>• Use voice commands for hands-free operation</p>
            <p>• Send location-based alerts to emergency contacts</p>
            <p>• Store medical information securely on your device</p>
          </CardContent>
        </Card>
      </main>

      <Navigation />
    </div>
  )
}
