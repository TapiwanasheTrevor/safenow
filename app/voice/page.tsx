"use client"

import { Header } from "@/components/Layout/Header"
import { Navigation } from "@/components/Layout/Navigation"
import { VoiceControl } from "@/components/Voice/VoiceControl"

export default function VoicePage() {
  return (
    <div className="min-h-screen pb-20">
      <Header title="Voice Control" />
      <main className="max-w-lg mx-auto">
        <VoiceControl />
      </main>
      <Navigation />
    </div>
  )
}
