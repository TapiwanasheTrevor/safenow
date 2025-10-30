"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { storageService } from "@/services/storageService"

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
  preferredMethod: "sms" | "whatsapp"
}

interface MedicalData {
  allergies: string[]
  conditions: string[]
  medications: string[]
}

interface PersonalData {
  name: string
  age: string
  bloodType: string
}

interface UserProfile {
  personal: PersonalData
  medical: MedicalData
  emergencyContacts: EmergencyContact[]
  lastUpdated: string
}

interface UserContextType {
  profile: UserProfile | null
  updateProfile: (profile: UserProfile) => void
  addContact: (contact: EmergencyContact) => void
  removeContact: (id: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const defaultProfile: UserProfile = {
  personal: { name: "", age: "", bloodType: "" },
  medical: { allergies: [], conditions: [], medications: [] },
  emergencyContacts: [],
  lastUpdated: new Date().toISOString(),
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    // Load profile from storage on mount
    const savedProfile = storageService.getUserProfile()
    setProfile(savedProfile || defaultProfile)
  }, [])

  const updateProfile = (newProfile: UserProfile) => {
    const updatedProfile = { ...newProfile, lastUpdated: new Date().toISOString() }
    setProfile(updatedProfile)
    storageService.saveUserProfile(updatedProfile)
  }

  const addContact = (contact: EmergencyContact) => {
    if (!profile) return
    const updatedProfile = {
      ...profile,
      emergencyContacts: [...profile.emergencyContacts, contact],
    }
    updateProfile(updatedProfile)
  }

  const removeContact = (id: string) => {
    if (!profile) return
    const updatedProfile = {
      ...profile,
      emergencyContacts: profile.emergencyContacts.filter((c) => c.id !== id),
    }
    updateProfile(updatedProfile)
  }

  return (
    <UserContext.Provider value={{ profile, updateProfile, addContact, removeContact }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
