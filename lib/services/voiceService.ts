// Voice Service - Web Speech API wrapper
// Handles speech recognition (voice commands) and speech synthesis (text-to-speech)

type SpeechRecognitionType = typeof SpeechRecognition | typeof webkitSpeechRecognition;
type SpeechRecognitionInstance = SpeechRecognition | webkitSpeechRecognition;

interface VoiceCommand {
  transcript: string;
  confidence: number;
  timestamp: string;
}

class VoiceService {
  private recognition: SpeechRecognitionInstance | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private onCommandCallback: ((command: VoiceCommand) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    // Initialize Speech Recognition
    if (this.isSpeechRecognitionSupported()) {
      const SpeechRecognitionAPI = (window.SpeechRecognition ||
        window.webkitSpeechRecognition) as SpeechRecognitionType;

      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;

      this.setupRecognitionHandlers();
    }

    // Initialize Speech Synthesis
    if (this.isSpeechSynthesisSupported()) {
      this.synthesis = window.speechSynthesis;
    }
  }

  // Check if Speech Recognition is supported
  isSpeechRecognitionSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  // Check if Speech Synthesis is supported
  isSpeechSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // Setup recognition event handlers
  private setupRecognitionHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const result = event.results[last];
      const transcript = result[0].transcript.trim();
      const confidence = result[0].confidence;

      const command: VoiceCommand = {
        transcript,
        confidence,
        timestamp: new Date().toISOString(),
      };

      if (this.onCommandCallback) {
        this.onCommandCallback(command);
      }
    };

    this.recognition.onerror = (event) => {
      let errorMessage = 'Voice recognition error';

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied';
          break;
        case 'network':
          errorMessage = 'Network error';
          break;
        default:
          errorMessage = `Voice error: ${event.error}`;
      }

      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        // Restart if we want continuous listening
        try {
          this.recognition?.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
        }
      }
    };
  }

  // Start listening for voice commands
  startListening(
    onCommand: (command: VoiceCommand) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      onError?.('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      return true; // Already listening
    }

    this.onCommandCallback = onCommand;
    this.onErrorCallback = onError || null;

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      onError?.('Failed to start voice recognition');
      return false;
    }
  }

  // Stop listening
  stopListening(): void {
    if (!this.recognition || !this.isListening) return;

    this.isListening = false;
    this.recognition.stop();
    this.onCommandCallback = null;
    this.onErrorCallback = null;
  }

  // Get listening status
  getIsListening(): boolean {
    return this.isListening;
  }

  // Speak text (Text-to-Speech)
  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }): void {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;
    utterance.volume = options?.volume || 1.0;

    this.synthesis.speak(utterance);
  }

  // Stop speaking
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Check if currently speaking
  isSpeaking(): boolean {
    return this.synthesis?.speaking || false;
  }

  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  // Request microphone permission (implicit through start)
  async requestMicrophonePermission(): Promise<PermissionState | 'unknown'> {
    try {
      if (!('permissions' in navigator)) {
        return 'unknown';
      }

      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return result.state;
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return 'unknown';
    }
  }

  // Speak with promise (wait for speech to complete)
  speakAsync(text: string, options?: { rate?: number; pitch?: number; volume?: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = options?.rate || 1.0;
      utterance.pitch = options?.pitch || 1.0;
      utterance.volume = options?.volume || 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  // Clean up
  destroy(): void {
    this.stopListening();
    this.stopSpeaking();
    this.recognition = null;
    this.synthesis = null;
  }
}

// Export singleton instance
const voiceService = new VoiceService();
export default voiceService;

// Type augmentation for webkit prefix
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
