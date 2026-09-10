import { EWasteVisionProvider, AnalysisResult } from '../types';
import { calculateIndicativeValue } from '../utils/valueEngine';

/**
 * GeminiVisionProvider implements EWasteVisionProvider.
 * Calls the server-side /api/analyze endpoint to ensure API keys remain protected.
 */
export class GeminiVisionProvider implements EWasteVisionProvider {
  name = 'Gemini 3.8 Multimodal Vision';

  async analyzeImage(input: {
    base64: string;
    mimeType: string;
    declaredCategory?: string;
    declaredWeight?: number;
    declaredLocation?: string;
  }): Promise<any> {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: input.base64,
        mimeType: input.mimeType,
        category: input.declaredCategory,
        weight: input.declaredWeight,
        location: input.declaredLocation,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Server responded with status ${response.status}`);
    }

    return await response.json();
  }
}

/**
 * Future YOLO/OpenCV Vision Provider stub for hackathon architecture requirement.
 * Can be swapped seamlessly when local or containerized YOLO weights are loaded.
 */
export class YoloOpenCvVisionProvider implements EWasteVisionProvider {
  name = 'YOLOv8 + OpenCV Edge Detector (Future Extension)';

  async analyzeImage(): Promise<any> {
    throw new Error('YOLOv8/OpenCV local detector is reserved for offline container deployments. Please use Gemini Vision Provider.');
  }
}

export const activeVisionProvider: EWasteVisionProvider = new GeminiVisionProvider();
