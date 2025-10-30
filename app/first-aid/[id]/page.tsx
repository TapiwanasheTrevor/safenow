"use client"

import { use } from "react"
import { FirstAidGuide } from "@/components/FirstAid/FirstAidGuide"
import { getScenarioById } from "@/data/firstAidData"
import { Header } from "@/components/Layout/Header"
import { Navigation } from "@/components/Layout/Navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FirstAidGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const scenario = getScenarioById(id)

  if (!scenario) {
    return (
      <div className="min-h-screen pb-20">
        <Header title="Not Found" />
        <main className="max-w-lg mx-auto p-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Emergency guide not found.</p>
            <Link href="/first-aid">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to First Aid
              </Button>
            </Link>
          </div>
        </main>
        <Navigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <Header title={scenario.title} />
      <main className="max-w-lg mx-auto">
        <FirstAidGuide scenario={scenario} />
      </main>
      <Navigation />
    </div>
  )
}
