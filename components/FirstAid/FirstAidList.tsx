"use client"

import { firstAidData } from "@/data/firstAidData"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Wind, Droplet, Flame, Activity, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface FirstAidListProps {
  searchQuery: string
  category: string
}

const iconMap: Record<string, any> = {
  heart: Heart,
  "heart-pulse": Heart,
  wind: Wind,
  droplet: Droplet,
  flame: Flame,
  bone: Activity,
  "alert-triangle": AlertTriangle,
  activity: Activity,
}

export function FirstAidList({ searchQuery, category }: FirstAidListProps) {
  const filteredScenarios = firstAidData.filter((scenario) => {
    const matchesSearch =
      searchQuery === "" ||
      scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = category === "all" || scenario.category === category

    return matchesSearch && matchesCategory
  })

  if (filteredScenarios.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No emergencies found matching your search.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredScenarios.map((scenario) => {
        const Icon = iconMap[scenario.icon] || AlertTriangle
        return (
          <Link key={scenario.id} href={`/first-aid/${scenario.id}`}>
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{scenario.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{scenario.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="capitalize">{scenario.category}</span>
                  <span>{scenario.steps.length} steps</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
