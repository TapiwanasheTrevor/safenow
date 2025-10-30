"use client"

import { Header } from "@/components/Layout/Header"
import { Navigation } from "@/components/Layout/Navigation"
import { UserProfile } from "@/components/Profile/UserProfile"

export default function ProfilePage() {
  return (
    <div className="min-h-screen pb-20">
      <Header title="My Profile" />
      <main className="max-w-lg mx-auto">
        <UserProfile />
      </main>
      <Navigation />
    </div>
  )
}
