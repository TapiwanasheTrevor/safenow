// Re-export from new implementation with adapter for backward compatibility
import voiceServiceNew from '@/lib/services/voiceService';

class VoiceService {
  private isListening = false;
  private onCommandCallback: ((command: string) => void) | null = null;

  isSupported(): boolean {
    return voiceServiceNew.isSpeechRecognitionSupported();
  }

  startListening(onCommand: (command: string) => void): void {
    if (!this.isSupported() || this.isListening) return;

    this.onCommandCallback = onCommand;

    const started = voiceServiceNew.startListening(
      (command) => {
        console.log('[Voice] Command received:', command.transcript);
        if (this.onCommandCallback) {
          this.onCommandCallback(command.transcript);
        }
      },
      (error) => {
        console.error('[Voice] Error:', error);
      }
    );

    if (started) {
      this.isListening = true;
      console.log('[Voice] Voice recognition started');
    }
  }

  stopListening(): void {
    if (!this.isSupported() || !this.isListening) return;

    voiceServiceNew.stopListening();
    this.isListening = false;
    console.log('[Voice] Voice recognition stopped');
  }

  getIsListening(): boolean {
    return voiceServiceNew.getIsListening();
  }

  speak(text: string, onEnd?: () => void): void {
    if (!voiceServiceNew.isSpeechSynthesisSupported()) return;

    if (onEnd) {
      voiceServiceNew.speakAsync(text, { rate: 0.9 }).then(onEnd).catch(console.error);
    } else {
      voiceServiceNew.speak(text, { rate: 0.9 });
    }
  }

  stopSpeaking(): void {
    voiceServiceNew.stopSpeaking();
  }
}

export const voiceService = new VoiceService();
