interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function analyzeImage(imageUri: string): Promise<string> {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file');
    }

    // Convert image to base64
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.readAsDataURL(blob);
    });

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: "Analyze this image and tell me what you see. Be descriptive but concise. Start your response with 'This is' or 'I can see'."
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      }
    };

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
    }

    const data: GeminiResponse = await geminiResponse.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No analysis result received from Gemini');
    }

    const analysis = data.candidates[0].content.parts[0].text;
    return analysis;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}