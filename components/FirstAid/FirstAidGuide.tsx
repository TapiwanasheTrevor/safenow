"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Volume2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FirstAidScenario } from "@/data/firstAidData"
import { voiceService } from "@/services/voiceService"
import Link from "next/link"

interface FirstAidGuideProps {
  scenario: FirstAidScenario
}

export function FirstAidGuide({ scenario }: FirstAidGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleNext = () => {
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSpeak = () => {
    if (isSpeaking) {
      voiceService.stopSpeaking()
      setIsSpeaking(false)
    } else {
      setIsSpeaking(true)
      voiceService.speak(scenario.steps[currentStep], () => {
        setIsSpeaking(false)
      })
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Back Button */}
      <Link href="/first-aid">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to List
        </Button>
      </Link>

      {/* Scenario Info */}
      <Card>
        <CardHeader>
          <CardTitle>{scenario.title}</CardTitle>
          <CardDescription>{scenario.description}</CardDescription>
        </CardHeader>
      </Card>

      {/* Warnings */}
      {scenario.warnings.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important Warnings:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {scenario.warnings.map((warning, index) => (
                <li key={index} className="text-sm">
                  {warning}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Step Counter */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {scenario.steps.length}
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / scenario.steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      <Card className="border-2 border-primary">
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed">{scenario.steps[currentStep]}</p>
        </CardContent>
      </Card>

      {/* Voice Playback Button */}
      <Button
        onClick={handleSpeak}
        variant="outline"
        className="w-full bg-transparent"
        disabled={!voiceService.isSupported()}
      >
        <Volume2 className="w-4 h-4 mr-2" />
        {isSpeaking ? "Stop Reading" : "Read Aloud"}
      </Button>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
          className="flex-1 bg-transparent"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentStep === scenario.steps.length - 1}
          variant="default"
          className="flex-1"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Duration Info */}
      {scenario.duration && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm text-center">
              <strong>Duration:</strong> {scenario.duration}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Completion Message */}
      {currentStep === scenario.steps.length - 1 && (
        <Alert>
          <AlertDescription className="text-center">
            You've completed all steps. Stay with the person until professional help arrives.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
