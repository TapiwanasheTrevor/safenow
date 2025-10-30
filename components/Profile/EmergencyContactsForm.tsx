"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContactsList } from "@/components/Alert/ContactsList"
import { useUser } from "@/context/UserContext"
import { useApp } from "@/context/AppContext"
import { Plus } from "lucide-react"

export function EmergencyContactsForm() {
  const { profile, updateProfile, removeContact } = useUser()
  const { showNotification } = useApp()

  const [contacts, setContacts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    relationship: "",
    preferredMethod: "whatsapp" as "sms" | "whatsapp",
  })

  useEffect(() => {
    if (profile?.emergencyContacts) {
      setContacts(profile.emergencyContacts)
    }
  }, [profile])

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault()

    if (!profile) return

    const newContact = {
      id: Date.now().toString(),
      ...formData,
    }

    const updatedContacts = [...contacts, newContact]
    setContacts(updatedContacts)

    updateProfile({
      ...profile,
      emergencyContacts: updatedContacts,
    })

    setFormData({
      name: "",
      phone: "",
      relationship: "",
      preferredMethod: "whatsapp",
    })

    setShowForm(false)
    showNotification("Emergency contact added", "success")
  }

  const handleDeleteContact = (id: string) => {
    if (!profile) return

    const updatedContacts = contacts.filter((c) => c.id !== id)
    setContacts(updatedContacts)

    updateProfile({
      ...profile,
      emergencyContacts: updatedContacts,
    })

    showNotification("Contact removed", "success")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>People who will be notified in case of emergency</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactsList contacts={contacts} showActions={true} onDelete={handleDeleteContact} />

          {!showForm && (
            <Button onClick={() => setShowForm(true)} variant="outline" className="w-full mt-4 bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Add Emergency Contact
            </Button>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+263771234567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-relationship">Relationship</Label>
                <Input
                  id="contact-relationship"
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="Family, Friend, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-method">Preferred Contact Method</Label>
                <Select
                  value={formData.preferredMethod}
                  onValueChange={(value: "sms" | "whatsapp") => setFormData({ ...formData, preferredMethod: value })}
                >
                  <SelectTrigger id="contact-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Add Contact
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
