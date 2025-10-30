"use client"

import { useState } from "react"
import { Header } from "@/components/Layout/Header"
import { Navigation } from "@/components/Layout/Navigation"
import { FirstAidList } from "@/components/FirstAid/FirstAidList"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { categories } from "@/data/firstAidData"
import { Button } from "@/components/ui/button"

export default function FirstAidPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  return (
    <div className="min-h-screen pb-20">
      <Header title="First Aid Guide" />

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search emergencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* First Aid List */}
        <FirstAidList searchQuery={searchQuery} category={selectedCategory} />
      </main>

      <Navigation />
    </div>
  )
}
