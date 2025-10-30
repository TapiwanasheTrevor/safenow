"use client"

import { Header } from "@/components/Layout/Header"
import { Navigation } from "@/components/Layout/Navigation"
import { AlertManager } from "@/components/Alert/AlertManager"

export default function AlertPage() {
  return (
    <div className="min-h-screen pb-20">
      <Header title="Emergency Alert" />
      <main className="max-w-lg mx-auto">
        <AlertManager />
      </main>
      <Navigation />
    </div>
  )
}
