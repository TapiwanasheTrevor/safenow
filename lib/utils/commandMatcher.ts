// Command Matcher - Fuzzy matching for voice commands
// Matches spoken text to defined voice command patterns

import voiceCommands, {
  type VoiceCommandAction,
  firstAidKeywords,
} from '@/lib/data/voiceCommands';

export interface CommandMatch {
  action: VoiceCommandAction;
  confidence: number;
  matchedPattern: string;
  parameters?: Record<string, string>;
}

export interface CommandMatchResult {
  success: boolean;
  match?: CommandMatch;
  error?: string;
}

class CommandMatcher {
  private confidenceThreshold = 0.6; // Minimum confidence to accept a match

  // Match spoken text to a voice command
  matchCommand(transcript: string): CommandMatchResult {
    const normalizedTranscript = this.normalizeText(transcript);

    if (!normalizedTranscript) {
      return {
        success: false,
        error: 'Empty transcript',
      };
    }

    // Find best matching command
    let bestMatch: CommandMatch | null = null;
    let highestConfidence = 0;

    for (const command of voiceCommands) {
      for (const pattern of command.patterns) {
        const confidence = this.calculateSimilarity(
          normalizedTranscript,
          this.normalizeText(pattern)
        );

        if (confidence > highestConfidence) {
          highestConfidence = confidence;
          bestMatch = {
            action: command.action,
            confidence,
            matchedPattern: pattern,
          };

          // Extract parameters if needed
          if (command.parameters) {
            const params = this.extractParameters(
              normalizedTranscript,
              command.action
            );
            if (params) {
              bestMatch.parameters = params;
            }
          }
        }
      }
    }

    // Check if match meets confidence threshold
    if (bestMatch && bestMatch.confidence >= this.confidenceThreshold) {
      return {
        success: true,
        match: bestMatch,
      };
    }

    return {
      success: false,
      error: 'No matching command found',
    };
  }

  // Calculate similarity between two strings (0-1 score)
  private calculateSimilarity(text1: string, text2: string): number {
    // Exact match
    if (text1 === text2) {
      return 1.0;
    }

    // Check if one contains the other
    if (text1.includes(text2)) {
      return 0.95;
    }
    if (text2.includes(text1)) {
      return 0.9;
    }

    // Word-based matching
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);

    // Check for word overlap
    const commonWords = words1.filter((word) =>
      words2.some((w) => this.wordSimilarity(word, w) > 0.8)
    );

    const overlapScore = commonWords.length / Math.max(words1.length, words2.length);

    // If significant word overlap, return high confidence
    if (overlapScore > 0.7) {
      return 0.85;
    }

    // Use Levenshtein distance for fuzzy matching
    const distance = this.levenshteinDistance(text1, text2);
    const maxLength = Math.max(text1.length, text2.length);
    const similarity = 1 - distance / maxLength;

    return Math.max(similarity, overlapScore * 0.7);
  }

  // Calculate word-level similarity
  private wordSimilarity(word1: string, word2: string): number {
    if (word1 === word2) return 1.0;
    if (word1.includes(word2) || word2.includes(word1)) return 0.9;

    const distance = this.levenshteinDistance(word1, word2);
    const maxLength = Math.max(word1.length, word2.length);
    return 1 - distance / maxLength;
  }

  // Levenshtein distance algorithm
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    // Initialize matrix
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Extract parameters from transcript (e.g., first aid scenario name)
  private extractParameters(
    transcript: string,
    action: VoiceCommandAction
  ): Record<string, string> | null {
    if (action === 'open_first_aid') {
      // Check for first aid keywords in transcript
      const lowerTranscript = transcript.toLowerCase();

      for (const [keyword, scenarioId] of Object.entries(firstAidKeywords)) {
        if (lowerTranscript.includes(keyword)) {
          return {
            scenario_name: scenarioId,
          };
        }
      }

      // Default to generic first aid
      return {
        scenario_name: 'cpr', // Default scenario
      };
    }

    return null;
  }

  // Normalize text for comparison
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:]/g, '') // Remove punctuation
      .replace(/\s+/g, ' '); // Normalize whitespace
  }

  // Set confidence threshold (0-1)
  setConfidenceThreshold(threshold: number): void {
    if (threshold >= 0 && threshold <= 1) {
      this.confidenceThreshold = threshold;
    }
  }

  // Get current confidence threshold
  getConfidenceThreshold(): number {
    return this.confidenceThreshold;
  }

  // Get all available command patterns (for help/debugging)
  getAllPatterns(): string[] {
    return voiceCommands.flatMap((cmd) => cmd.patterns);
  }

  // Get command action by pattern
  getActionByPattern(pattern: string): VoiceCommandAction | null {
    const normalizedPattern = this.normalizeText(pattern);

    for (const command of voiceCommands) {
      if (
        command.patterns.some(
          (p) => this.normalizeText(p) === normalizedPattern
        )
      ) {
        return command.action;
      }
    }

    return null;
  }
}

// Export singleton instance
const commandMatcher = new CommandMatcher();
export default commandMatcher;
