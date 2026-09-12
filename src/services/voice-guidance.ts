import type { RouteStep, AccessibilityProfile } from '../types';

export class VoiceGuidanceService {
  private synth: SpeechSynthesis;
  private currentProfile: AccessibilityProfile | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  setProfile(profile: AccessibilityProfile) {
    this.currentProfile = profile;
  }

  speak(text: string): void {
    if (!this.isSupported()) return;

    this.stop(); // Stop current speech before starting new

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Adjust pitch and rate based on profile
    this.applyProfileAdjustments(utterance);

    this.synth.speak(utterance);
  }

  speakRoute(steps: RouteStep[]): void {
    if (!this.isSupported()) return;
    this.stop();

    let combinedText = "Starting route guidance. ";
    steps.forEach((step, index) => {
      combinedText += `Step ${index + 1}: ${step.instruction}. `;
    });

    const utterance = new SpeechSynthesisUtterance(combinedText);
    this.applyProfileAdjustments(utterance);

    this.synth.speak(utterance);
  }

  stop(): void {
    if (this.isSupported() && this.synth.speaking) {
      this.synth.cancel();
    }
  }

  pause(): void {
    if (this.isSupported() && this.synth.speaking) {
      this.synth.pause();
    }
  }

  resume(): void {
    if (this.isSupported() && this.synth.paused) {
      this.synth.resume();
    }
  }

  private applyProfileAdjustments(utterance: SpeechSynthesisUtterance): void {
    if (!this.currentProfile) return;

    switch (this.currentProfile) {
      case 'elderly':
        // Slower speech rate for elderly
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        break;
      case 'visual_impairment':
        // slightly faster speech rate might be preferred by screen reader users, but keep standard
        utterance.rate = 1.1;
        break;
      case 'hearing_impairment':
      case 'wheelchair':
      default:
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        break;
    }
  }
}
