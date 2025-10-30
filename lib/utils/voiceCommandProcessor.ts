// Voice Command Processor - Integrates voice recognition with command matching
// Handles the complete voice command flow: listen -> match -> execute -> respond

import voiceService from '@/lib/services/voiceService';
import commandMatcher, { type CommandMatch } from './commandMatcher';
import { type VoiceCommandAction } from '@/lib/data/voiceCommands';

export interface VoiceCommandCallback {
  onCommandRecognized?: (action: VoiceCommandAction, match: CommandMatch) => void;
  onCommandExecuted?: (action: VoiceCommandAction, success: boolean) => void;
  onError?: (error: string) => void;
  onListeningStart?: () => void;
  onListeningStop?: () => void;
}

class VoiceCommandProcessor {
  private callbacks: VoiceCommandCallback = {};
  private isProcessing: boolean = false;
  private lastCommandTime: number = 0;
  private commandCooldown: number = 1000; // 1 second between commands

  // Initialize voice command processing
  initialize(callbacks: VoiceCommandCallback): boolean {
    this.callbacks = callbacks;

    // Check if voice recognition is supported
    if (!voiceService.isSpeechRecognitionSupported()) {
      this.callbacks.onError?.('Voice recognition not supported in this browser');
      return false;
    }

    return true;
  }

  // Start listening for voice commands
  startListening(): boolean {
    if (this.isProcessing) {
      return true; // Already listening
    }

    const started = voiceService.startListening(
      (command) => this.handleVoiceInput(command.transcript, command.confidence),
      (error) => this.callbacks.onError?.(error)
    );

    if (started) {
      this.isProcessing = true;
      this.callbacks.onListeningStart?.();

      // Provide audio feedback
      this.speak('Voice commands activated', { rate: 1.2 });
    }

    return started;
  }

  // Stop listening for voice commands
  stopListening(): void {
    if (!this.isProcessing) return;

    voiceService.stopListening();
    this.isProcessing = false;
    this.callbacks.onListeningStop?.();

    // Provide audio feedback
    this.speak('Voice commands deactivated', { rate: 1.2 });
  }

  // Handle voice input
  private handleVoiceInput(transcript: string, confidence: number): void {
    console.log(`[Voice] Received: "${transcript}" (confidence: ${confidence})`);

    // Check cooldown to prevent rapid-fire commands
    const now = Date.now();
    if (now - this.lastCommandTime < this.commandCooldown) {
      console.log('[Voice] Command ignored - cooldown active');
      return;
    }

    // Match command
    const matchResult = commandMatcher.matchCommand(transcript);

    if (!matchResult.success || !matchResult.match) {
      console.log(`[Voice] No match found for: "${transcript}"`);
      this.callbacks.onError?.(`Command not recognized: ${transcript}`);
      this.speak('Command not recognized. Say "help" for available commands.');
      return;
    }

    const match = matchResult.match;
    console.log(
      `[Voice] Matched action: ${match.action} (confidence: ${match.confidence})`
    );

    // Update last command time
    this.lastCommandTime = now;

    // Notify command recognized
    this.callbacks.onCommandRecognized?.(match.action, match);

    // Execute command
    this.executeCommand(match);
  }

  // Execute matched command
  private executeCommand(match: CommandMatch): void {
    const { action, parameters } = match;

    try {
      switch (action) {
        case 'trigger_alert':
          this.speak('Triggering emergency alert');
          this.callbacks.onCommandExecuted?.(action, true);
          break;

        case 'open_first_aid':
          const scenarioName = parameters?.scenario_name || 'general';
          this.speak(`Opening ${scenarioName} first aid guide`);
          this.callbacks.onCommandExecuted?.(action, true);
          break;

        case 'call_contact':
          this.speak('Opening emergency contacts');
          this.callbacks.onCommandExecuted?.(action, true);
          break;

        case 'speak_location':
          this.speak('Getting your current location');
          this.callbacks.onCommandExecuted?.(action, true);
          break;

        case 'stop_listening':
          this.speak('Stopping voice commands');
          this.callbacks.onCommandExecuted?.(action, true);
          // Stop listening after speaking
          setTimeout(() => this.stopListening(), 1000);
          break;

        case 'open_profile':
          this.speak('Opening your profile');
          this.callbacks.onCommandExecuted?.(action, true);
          break;

        case 'help':
          this.speakHelpCommands();
          this.callbacks.onCommandExecuted?.(action, true);
          break;

        default:
          this.callbacks.onError?.(`Unknown action: ${action}`);
          this.callbacks.onCommandExecuted?.(action, false);
      }
    } catch (error) {
      console.error('[Voice] Command execution error:', error);
      this.callbacks.onError?.(`Failed to execute command: ${action}`);
      this.callbacks.onCommandExecuted?.(action, false);
    }
  }

  // Speak help commands
  private speakHelpCommands(): void {
    const helpText = `
      Available voice commands:
      Say "emergency" to trigger an alert.
      Say "C P R" or "choking" for first aid guides.
      Say "where am I" to hear your location.
      Say "call contact" to alert your contacts.
      Say "stop" to deactivate voice commands.
    `;

    this.speak(helpText, { rate: 0.9 });
  }

  // Speak location information
  async speakLocation(
    latitude: number,
    longitude: number,
    address?: string
  ): Promise<void> {
    let locationText = `Your location is: latitude ${latitude.toFixed(
      4
    )}, longitude ${longitude.toFixed(4)}`;

    if (address) {
      locationText += `. Address: ${address}`;
    }

    this.speak(locationText, { rate: 0.9 });
  }

  // Speak first aid step
  speakFirstAidStep(step: string, stepNumber: number, totalSteps: number): void {
    const text = `Step ${stepNumber} of ${totalSteps}: ${step}`;
    this.speak(text, { rate: 0.9 });
  }

  // Speak text with options
  speak(
    text: string,
    options?: { rate?: number; pitch?: number; volume?: number }
  ): void {
    if (!voiceService.isSpeechSynthesisSupported()) {
      console.warn('[Voice] Speech synthesis not supported');
      return;
    }

    voiceService.speak(text, options);
  }

  // Speak text asynchronously (wait for completion)
  async speakAsync(
    text: string,
    options?: { rate?: number; pitch?: number; volume?: number }
  ): Promise<void> {
    if (!voiceService.isSpeechSynthesisSupported()) {
      console.warn('[Voice] Speech synthesis not supported');
      return;
    }

    return voiceService.speakAsync(text, options);
  }

  // Stop speaking
  stopSpeaking(): void {
    voiceService.stopSpeaking();
  }

  // Get listening status
  isListening(): boolean {
    return this.isProcessing;
  }

  // Check if speech synthesis is supported
  isSpeechSynthesisSupported(): boolean {
    return voiceService.isSpeechSynthesisSupported();
  }

  // Check if speech recognition is supported
  isSpeechRecognitionSupported(): boolean {
    return voiceService.isSpeechRecognitionSupported();
  }

  // Set command cooldown (milliseconds)
  setCommandCooldown(ms: number): void {
    this.commandCooldown = Math.max(0, ms);
  }

  // Get command cooldown
  getCommandCooldown(): number {
    return this.commandCooldown;
  }

  // Test voice synthesis
  testSpeech(text: string = 'Testing voice output'): void {
    this.speak(text);
  }

  // Clean up
  destroy(): void {
    this.stopListening();
    this.stopSpeaking();
    this.callbacks = {};
  }
}

// Export singleton instance
const voiceCommandProcessor = new VoiceCommandProcessor();
export default voiceCommandProcessor;
