import type { GeminiResponse, Route, AccessibilityProfile } from '../types';

export class GeminiService {
  private apiKey: string | null = null;

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  async analyzeAccessibility(imageBase64: string): Promise<GeminiResponse> {
    if (!this.apiKey) {
      // Demo response
      return {
        text: "**DEMO MODE**: Based on the image, the hallway appears clear of major obstacles. The flooring is smooth and suitable for wheelchairs. However, lighting seems slightly dim, which may be a consideration for visual impairments.",
        isDemo: true
      };
    }

    // Real API call would go here
    throw new Error('Real Gemini API integration not implemented yet');
  }

  async explainRoute(route: Route, profile: AccessibilityProfile): Promise<GeminiResponse> {
    if (!this.apiKey) {
      return {
        text: `**DEMO MODE**: Your route has been tailored for a ${profile} profile. It covers ${Math.round(route.totalDistance)} meters. ` +
              (route.warnings.length > 0 
                ? 'Please note: ' + route.warnings.join(', ') 
                : 'The path is fully accessible with no known barriers.'),
        isDemo: true
      };
    }

    // Real API call would go here
    throw new Error('Real Gemini API integration not implemented yet');
  }

  async readSignage(imageBase64: string): Promise<GeminiResponse> {
    if (!this.apiKey) {
      return {
        text: "**DEMO MODE**: The sign points towards 'Elevators (Floors 1-5) ➔' and 'Restrooms ◂'.",
        isDemo: true
      };
    }

    // Real API call would go here
    throw new Error('Real Gemini API integration not implemented yet');
  }
}
