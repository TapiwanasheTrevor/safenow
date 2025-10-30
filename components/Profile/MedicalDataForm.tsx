"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useUser } from "@/context/UserContext"
import { useApp } from "@/context/AppContext"

export function MedicalDataForm() {
  const { profile, updateProfile } = useUser()
  const { showNotification } = useApp()

  const [allergies, setAllergies] = useState<string[]>([])
  const [conditions, setConditions] = useState<string[]>([])
  const [medications, setMedications] = useState<string[]>([])

  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")
  const [newMedication, setNewMedication] = useState("")

  useEffect(() => {
    if (profile?.medical) {
      setAllergies(profile.medical.allergies)
      setConditions(profile.medical.conditions)
      setMedications(profile.medical.medications)
    }
  }, [profile])

  const handleSave = () => {
    if (!profile) return

    updateProfile({
      ...profile,
      medical: {
        allergies,
        conditions,
        medications,
      },
    })

    showNotification("Medical information saved", "success")
  }

  const addItem = (type: "allergy" | "condition" | "medication", value: string) => {
    if (!value.trim()) return

    if (type === "allergy") {
      setAllergies([...allergies, value])
      setNewAllergy("")
    } else if (type === "condition") {
      setConditions([...conditions, value])
      setNewCondition("")
    } else {
      setMedications([...medications, value])
      setNewMedication("")
    }
  }

  const removeItem = (type: "allergy" | "condition" | "medication", index: number) => {
    if (type === "allergy") {
      setAllergies(allergies.filter((_, i) => i !== index))
    } else if (type === "condition") {
      setConditions(conditions.filter((_, i) => i !== index))
    } else {
      setMedications(medications.filter((_, i) => i !== index))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Information</CardTitle>
        <CardDescription>Critical health information for emergency responders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Allergies */}
        <div className="space-y-2">
          <Label>Allergies</Label>
          <div className="flex gap-2">
            <Input
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="e.g., Penicillin"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addItem("allergy", newAllergy)
                }
              }}
            />
            <Button type="button" size="icon" onClick={() => addItem("allergy", newAllergy)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {allergies.map((allergy, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {allergy}
                <button onClick={() => removeItem("allergy", index)} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="space-y-2">
          <Label>Medical Conditions</Label>
          <div className="flex gap-2">
            <Input
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="e.g., Asthma"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addItem("condition", newCondition)
                }
              }}
            />
            <Button type="button" size="icon" onClick={() => addItem("condition", newCondition)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {conditions.map((condition, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {condition}
                <button onClick={() => removeItem("condition", index)} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Medications */}
        <div className="space-y-2">
          <Label>Current Medications</Label>
          <div className="flex gap-2">
            <Input
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              placeholder="e.g., Ventolin inhaler"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addItem("medication", newMedication)
                }
              }}
            />
            <Button type="button" size="icon" onClick={() => addItem("medication", newMedication)}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {medications.map((medication, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {medication}
                <button onClick={() => removeItem("medication", index)} className="ml-1">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Medical Information
        </Button>
      </CardContent>
    </Card>
  )
}
