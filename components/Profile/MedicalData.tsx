"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/context/UserContext"
import { User, Droplet, AlertTriangle, Pill } from "lucide-react"

export function MedicalData() {
  const { profile } = useUser()

  if (!profile) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-semibold">{profile.personal.name || "Not set"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Age:</span>
            <span className="font-semibold">{profile.personal.age || "Not set"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Blood Type:</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Droplet className="w-3 h-3" />
              {profile.personal.bloodType || "Not set"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Medical Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground mb-2">Allergies:</p>
            <div className="flex flex-wrap gap-2">
              {profile.medical.allergies.length > 0 ? (
                profile.medical.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive">
                    {allergy}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">None listed</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2">Conditions:</p>
            <div className="flex flex-wrap gap-2">
              {profile.medical.conditions.length > 0 ? (
                profile.medical.conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary">
                    {condition}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">None listed</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 flex items-center gap-1">
              <Pill className="w-3 h-3" />
              Medications:
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.medical.medications.length > 0 ? (
                profile.medical.medications.map((medication, index) => (
                  <Badge key={index} variant="outline">
                    {medication}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">None listed</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
