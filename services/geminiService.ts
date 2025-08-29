
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const translateTextAndImage = async (
    text: string,
    base64Image: string | null,
    systemInstruction: string
): Promise<string> => {
    try {
        const parts: any[] = [{ text }];

        if (base64Image) {
            parts.unshift({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Image,
                },
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: parts },
            config: {
                systemInstruction: systemInstruction,
            },
        });

        const translation = response.text;
        if (!translation) {
            throw new Error("Received an empty response from the API.");
        }

        return translation;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get translation from Gemini API.");
    }
};
