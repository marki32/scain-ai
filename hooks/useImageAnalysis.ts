import { useState } from 'react';
import { analyzeImage } from '@/services/geminiService';

interface AnalysisResult {
  imageUri: string;
  analysis: string;
  timestamp: string;
}

export function useImageAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (imageUri: string): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeImage(imageUri);
      const result: AnalysisResult = {
        imageUri,
        analysis,
        timestamp: new Date().toLocaleString(),
      };
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image';
      setError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyze,
    isAnalyzing,
    error,
  };
}