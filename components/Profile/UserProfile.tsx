"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoForm } from "./PersonalInfoForm"
import { MedicalDataForm } from "./MedicalDataForm"
import { EmergencyContactsForm } from "./EmergencyContactsForm"

export function UserProfile() {
  const [activeTab, setActiveTab] = useState("personal")

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <PersonalInfoForm />
        </TabsContent>

        <TabsContent value="medical" className="mt-4">
          <MedicalDataForm />
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <EmergencyContactsForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
