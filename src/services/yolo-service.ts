import type { ScanResult, Detection } from '../types';

export class YOLOService {
  async detectObjects(imageBase64: string, width: number, height: number): Promise<ScanResult> {
    // Return a mocked delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockDetections: Detection[] = [
      {
        id: 'det-1',
        label: 'stairs',
        confidence: 0.92,
        bbox: { x: 0.1, y: 0.3, width: 0.4, height: 0.5 },
        accessibilityImpact: 'negative',
        impactDescription: 'Stairs detected, which are impassable for wheelchairs.'
      },
      {
        id: 'det-2',
        label: 'ramp',
        confidence: 0.89,
        bbox: { x: 0.55, y: 0.4, width: 0.3, height: 0.3 },
        accessibilityImpact: 'positive',
        impactDescription: 'Accessible ramp available nearby.'
      },
      {
        id: 'det-3',
        label: 'elevator door',
        confidence: 0.95,
        bbox: { x: 0.8, y: 0.2, width: 0.15, height: 0.6 },
        accessibilityImpact: 'positive',
        impactDescription: 'Elevator access available.'
      },
      {
        id: 'det-4',
        label: 'wet floor sign',
        confidence: 0.85,
        bbox: { x: 0.4, y: 0.7, width: 0.1, height: 0.15 },
        accessibilityImpact: 'negative',
        impactDescription: 'Temporary obstacle detected: Wet floor.'
      },
      {
        id: 'det-5',
        label: 'handrail',
        confidence: 0.91,
        bbox: { x: 0.05, y: 0.3, width: 0.45, height: 0.1 },
        accessibilityImpact: 'positive',
        impactDescription: 'Handrail available for support.'
      }
    ];

    // Pick a random subset to simulate different scenes, but for completeness 
    // and testing, we can just return all of them or a specific subset based on random.
    // We'll return 3 random detections to simulate a specific frame.
    const shuffled = mockDetections.sort(() => 0.5 - Math.random());
    const selectedDetections = shuffled.slice(0, 3);

    return {
      detections: selectedDetections,
      isDemo: true,
      processingTime: 800, // ms
      imageWidth: width,
      imageHeight: height
    };
  }

  async detectFromElement(videoElement: HTMLVideoElement): Promise<ScanResult> {
    // In a real implementation this would draw the video frame to a canvas
    // and pass the image data to a model. We'll simulate it using detectObjects.
    return this.detectObjects('mock-base64', videoElement.videoWidth || 640, videoElement.videoHeight || 480);
  }
}
