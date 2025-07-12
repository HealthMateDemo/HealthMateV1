// OpenAI API service for voice transcription and ChatGPT responses
export interface OpenAIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl = "https://api.openai.com/v1";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
  }

  // Transcribe audio using OpenAI Whisper
  async transcribeAudio(audioBlob: Blob): Promise<OpenAIResponse> {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");
      formData.append("model", "whisper-1");

      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.text,
      };
    } catch (error) {
      console.error("Transcription error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Transcription failed",
      };
    }
  }

  // Get ChatGPT response
  async getChatResponse(
    message: string,
    context?: string
  ): Promise<OpenAIResponse> {
    try {
      const systemPrompt =
        context ||
        `You are a helpful AI health assistant. Provide evidence-based wellness advice and guidance. Be supportive, informative, and professional. Keep responses concise but helpful.`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`ChatGPT request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.choices[0]?.message?.content || "No response received",
      };
    } catch (error) {
      console.error("ChatGPT error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "ChatGPT request failed",
      };
    }
  }

  // Combined function to transcribe and get response
  async processVoiceMessage(audioBlob: Blob): Promise<OpenAIResponse> {
    try {
      // First, transcribe the audio
      const transcriptionResult = await this.transcribeAudio(audioBlob);

      if (!transcriptionResult.success) {
        return transcriptionResult;
      }

      const transcribedText = transcriptionResult.data;

      // Then, get ChatGPT response
      const chatResult = await this.getChatResponse(transcribedText);

      if (!chatResult.success) {
        return chatResult;
      }

      return {
        success: true,
        data: {
          transcription: transcribedText,
          response: chatResult.data,
        },
      };
    } catch (error) {
      console.error("Voice processing error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Voice processing failed",
      };
    }
  }

  // Check if API key is configured
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Create a singleton instance
export const openAIService = new OpenAIService();
