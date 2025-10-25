
import { GoogleGenAI, Chat, GenerateContentResponse, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Text Generation Service ---
const generateTextWithPrompt = async (model: string, prompt: string): Promise<string> => {
  if (!API_KEY) throw new Error("Gemini API key is not configured.");
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    console.error(`Error calling Gemini API for model ${model}:`, error);
    throw new Error(`Failed to generate content from AI. Please check the console.`);
  }
};

export const generateSongLyrics = (prompt: string): Promise<string> => {
  const fullPrompt = `Write song lyrics based on the following prompt. Be creative and follow a standard verse-chorus structure. Do not add any extra commentary, just the lyrics.\n\nPROMPT: "${prompt}"`;
  return generateTextWithPrompt('gemini-2.5-flash', fullPrompt);
};

export const rewriteText = (text: string): Promise<string> => {
  const prompt = `Rewrite and paraphrase the following text to make it sound more engaging and clear. Do not add any commentary before or after, just provide the rewritten text.\n\n---\n\n${text}`;
  return generateTextWithPrompt('gemini-2.5-flash', prompt);
};

export const composeMusic = (prompt: string, instruments: string[]): Promise<string> => {
  const fullPrompt = `
    Act as a music composer. A user wants to create a piece of music.
    Based on their prompt and selected instruments, generate a detailed musical idea.

    Describe the mood, tempo, melody, and rhythm.
    Explain how the selected instruments would interact.
    Suggest a possible chord progression if applicable.
    The output should be a creative and inspiring musical concept.
    Do not add any extra commentary, just the composition idea.

    USER PROMPT: "${prompt}"
    INSTRUMENTS: ${instruments.join(', ')}
  `;
  return generateTextWithPrompt('gemini-2.5-flash', fullPrompt);
};


// --- Image Generation Service ---
export const generateImage = async (prompt: string): Promise<string> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error calling Gemini API for image generation:", error);
        throw new Error("Failed to generate image from AI. Please check the console.");
    }
};


// --- Chat Service ---
let chatInstance: Chat | null = null;

const initializeChat = (): Chat => {
  if (!API_KEY) throw new Error("Gemini API key is not configured.");
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a helpful and creative assistant. Keep your responses concise and friendly.',
    },
  });
};

export const chat = {
  sendMessage: async (message: string): Promise<string> => {
    if (!chatInstance) {
      chatInstance = initializeChat();
    }
    try {
      const response: GenerateContentResponse = await chatInstance.sendMessage({ message });
      return response.text;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw new Error("Failed to get chat response.");
    }
  },
  reset: (): void => {
    chatInstance = null;
  }
};


// --- Audio Transcription Service ---
const blobToBase64 = (blob: Blob): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',', 2);
      const mimeType = header.match(/:(.*?);/)?.[1] || blob.type;
      resolve({ mimeType, data });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  if (!API_KEY) throw new Error("Gemini API key is not configured.");
  try {
    const { mimeType, data: base64Audio } = await blobToBase64(audioBlob);
    const audioPart = { inlineData: { mimeType, data: base64Audio } };
    const textPart = { text: "Transcribe the following audio:" };
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, audioPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for transcription:", error);
    throw new Error("Failed to transcribe audio. Please check the console.");
  }
};


// --- Audio Generation (TTS) Service ---
interface SpeakerConfig {
    name: string;
    voice: string;
}

export const generateVocalTrack = async (prompt: string, speaker1: SpeakerConfig, speaker2: SpeakerConfig): Promise<string> => {
    if (!API_KEY) throw new Error("Gemini API key is not configured.");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    multiSpeakerVoiceConfig: {
                        speakerVoiceConfigs: [
                            {
                                speaker: speaker1.name,
                                voiceConfig: {
                                    prebuiltVoiceConfig: { voiceName: speaker1.voice }
                                }
                            },
                            {
                                speaker: speaker2.name,
                                voiceConfig: {
                                    prebuiltVoiceConfig: { voiceName: speaker2.voice }
                                }
                            }
                        ]
                    }
                }
            }
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data was generated.");
        }
        return base64Audio;
    } catch (error) {
        console.error("Error calling Gemini API for TTS:", error);
        throw new Error("Failed to generate vocal track. Please check the console.");
    }
};

// --- Video Generation Service ---
export const generateVideoFromImage = async (prompt: string, image: File, aspectRatio: '16:9' | '9:16') => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("Gemini API key is not configured.");
    const localAi = new GoogleGenAI({ apiKey });

    const { mimeType, data } = await blobToBase64(image);

    try {
        let operation = await localAi.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt,
            image: {
                imageBytes: data,
                mimeType: mimeType,
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: aspectRatio,
            }
        });
        return operation;
    } catch (error) {
        console.error("Error starting video generation:", error);
        if (error instanceof Error && error.message.includes("Requested entity was not found")) {
             throw new Error("API Key is invalid. Please select a valid API key.");
        }
        throw new Error("Failed to start video generation.");
    }
};

export const getVideoGenerationOperation = async (operation: any) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("Gemini API key is not configured.");
    const localAi = new GoogleGenAI({ apiKey });

    try {
        const updatedOperation = await localAi.operations.getVideosOperation({ operation });
        return updatedOperation;
    } catch (error) {
        console.error("Error polling video generation status:", error);
        throw new Error("Failed to get video generation status.");
    }
};


// --- Audio Decoding Helpers ---
const decode = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

const pcmToWav = (pcmData: Int16Array, sampleRate: number, numChannels: number): Blob => {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    const dataSize = pcmData.length * 2;
    const fileSize = dataSize + 36;

    writeString(0, 'RIFF');
    view.setUint32(4, fileSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    const wavBytes = new Uint8Array(44 + dataSize);
    wavBytes.set(new Uint8Array(header), 0);
    wavBytes.set(new Uint8Array(pcmData.buffer), 44);

    return new Blob([wavBytes], { type: 'audio/wav' });
};


export const createAudioUrlFromBase64 = (base64Audio: string): string => {
    const pcmBytes = decode(base64Audio);
    const pcmData = new Int16Array(pcmBytes.buffer);
    const wavBlob = pcmToWav(pcmData, 24000, 1);
    return URL.createObjectURL(wavBlob);
};