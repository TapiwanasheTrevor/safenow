"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, CheckCircle, XCircle } from "lucide-react"
import { voiceService } from "@/services/voiceService"
import voiceCommandProcessor from "@/lib/utils/voiceCommandProcessor"
import type { VoiceCommandAction } from "@/lib/data/voiceCommands"
import type { CommandMatch } from "@/lib/utils/commandMatcher"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { alertService } from "@/services/alertService"
import locationServiceNew from "@/lib/services/locationService"
import { useApp } from "@/context/AppContext"
import { VoiceCommands } from "./VoiceCommands"

export function VoiceControl() {
  const [isListening, setIsListening] = useState(false)
  const [lastCommand, setLastCommand] = useState<string>("")
  const [lastMatch, setLastMatch] = useState<{ action: string; confidence: number } | null>(null)
  const [commandHistory, setCommandHistory] = useState<Array<{ text: string; success: boolean }>>([])
  const [isSupported, setIsSupported] = useState(true)
  const router = useRouter()
  const { showNotification } = useApp()

  useEffect(() => {
    setIsSupported(voiceService.isSupported())

    // Initialize voice command processor
    voiceCommandProcessor.initialize({
      onCommandRecognized: (action: VoiceCommandAction, match: CommandMatch) => {
        console.log('[Voice] Command recognized:', action, match);
        setLastCommand(match.matchedPattern);
        setLastMatch({
          action,
          confidence: Math.round(match.confidence * 100)
        });
        showNotification(`Command: ${action} (${Math.round(match.confidence * 100)}%)`, "info");
      },

      onCommandExecuted: async (action: VoiceCommandAction, success: boolean) => {
        console.log('[Voice] Command executed:', action, success);

        if (!success) {
          setCommandHistory((prev) => [{ text: action, success: false }, ...prev.slice(0, 9)]);
          return;
        }

        setCommandHistory((prev) => [{ text: action, success: true }, ...prev.slice(0, 9)]);

        // Handle navigation based on action
        switch (action) {
          case 'trigger_alert':
            try {
              await alertService.triggerEmergencyAlert();
              router.push('/alert');
            } catch (error) {
              showNotification("Failed to trigger alert", "error");
            }
            break;

          case 'open_first_aid':
            // The processor will include scenario_name in parameters
            const scenario = lastMatch?.action || 'cpr';
            router.push(`/first-aid/${scenario}`);
            break;

          case 'call_contact':
            router.push('/alert');
            break;

          case 'speak_location':
            const locationResult = await locationServiceNew.getCurrentLocation();
            if (locationResult.success && locationResult.location) {
              const { latitude, longitude } = locationResult.location;
              voiceCommandProcessor.speakLocation(latitude, longitude);
            }
            break;

          case 'open_profile':
            router.push('/profile');
            break;

          case 'help':
            showNotification("Voice commands help spoken", "info");
            break;

          case 'stop_listening':
            // Already handled by processor
            break;
        }
      },

      onError: (error: string) => {
        console.error('[Voice] Error:', error);
        showNotification(error, "error");
      },

      onListeningStart: () => {
        setIsListening(true);
        showNotification("Listening for commands...", "info");
      },

      onListeningStop: () => {
        setIsListening(false);
        showNotification("Voice control stopped", "info");
      },
    });

    return () => {
      voiceCommandProcessor.destroy();
    };
  }, [router, showNotification, lastMatch]);

  const handleToggleListening = () => {
    if (isListening) {
      voiceCommandProcessor.stopListening();
    } else {
      voiceCommandProcessor.startListening();
    }
  }

  if (!isSupported) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>
            Voice control is not supported in your browser. Please use a modern browser like Chrome, Edge, or Safari.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Voice Control Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Commands</CardTitle>
          <CardDescription>Tap the microphone to start listening for voice commands</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={handleToggleListening}
            className={`w-32 h-32 rounded-full ${
              isListening ? "bg-primary animate-pulse" : "bg-secondary"
            } hover:opacity-90`}
          >
            {isListening ? <Mic className="w-12 h-12" /> : <MicOff className="w-12 h-12" />}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            {isListening ? "Listening... Speak your command" : "Tap to activate voice control"}
          </p>
        </CardContent>
      </Card>

      {/* Last Command */}
      {lastCommand && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last Command</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">{lastCommand}</p>
              </div>
              {lastMatch && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    {lastMatch.confidence}% confidence
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Commands */}
      <VoiceCommands />

      {/* Command History */}
      {commandHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {commandHistory.map((cmd, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  {cmd.success ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span className={cmd.success ? "text-foreground" : "text-muted-foreground line-through"}>
                    {cmd.text}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
