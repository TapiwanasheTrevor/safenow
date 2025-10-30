import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Heart, MapPin, User, Home } from "lucide-react"

export function VoiceCommands() {
  const commandCategories = [
    {
      title: "Emergency",
      icon: AlertCircle,
      commands: [
        { phrase: '"Emergency" or "Help"', action: "Trigger emergency alert" },
        { phrase: '"Call contact"', action: "Initiate contact alert" },
      ],
    },
    {
      title: "First Aid",
      icon: Heart,
      commands: [
        { phrase: '"Start CPR"', action: "Open CPR guide" },
        { phrase: '"Choking"', action: "Open choking guide" },
        { phrase: '"Bleeding"', action: "Open bleeding control guide" },
        { phrase: '"Burns"', action: "Open burns treatment guide" },
        { phrase: '"Fracture" or "Broken bone"', action: "Open fracture guide" },
        { phrase: '"Heart attack"', action: "Open heart attack guide" },
        { phrase: '"Seizure"', action: "Open seizure guide" },
        { phrase: '"First aid" or "Show guides"', action: "View all guides" },
      ],
    },
    {
      title: "Navigation",
      icon: Home,
      commands: [
        { phrase: '"Home" or "Go home"', action: "Go to home screen" },
        { phrase: '"Profile" or "Medical info"', action: "Open profile" },
      ],
    },
    {
      title: "Location",
      icon: MapPin,
      commands: [{ phrase: '"Where am I" or "Location"', action: "Speak current location" }],
    },
    {
      title: "Control",
      icon: User,
      commands: [{ phrase: '"Stop listening" or "Stop"', action: "Deactivate voice control" }],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Available Commands</CardTitle>
        <CardDescription>Say any of these phrases while listening is active</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {commandCategories.map((category) => {
          const Icon = category.icon
          return (
            <div key={category.title} className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">{category.title}</h3>
              </div>
              <ul className="space-y-1 ml-6">
                {category.commands.map((cmd, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{cmd.phrase}</span>
                    <span className="text-muted-foreground ml-2">→ {cmd.action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
