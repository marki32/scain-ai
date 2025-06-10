import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AnalysisResult {
  id: string;
  imageUri: string;
  analysis: string;
  timestamp: string;
}

const STORAGE_KEY = '@analysis_history';

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAnalysis = async (analysis: Omit<AnalysisResult, 'id'>) => {
    try {
      const newAnalysis: AnalysisResult = {
        ...analysis,
        id: Date.now().toString(),
      };
      
      const updatedHistory = [newAnalysis, ...history];
      setHistory(updatedHistory);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
  };

  const clearHistory = async () => {
    try {
      setHistory([]);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return {
    history,
    isLoading,
    saveAnalysis,
    clearHistory,
  };
}