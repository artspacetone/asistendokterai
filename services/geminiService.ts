import { GoogleGenAI, GenerateContentResponse, Part, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, DRUG_INFO_KEYWORDS } from '../constants';
import { type Message, Sender, type AssessmentPlan } from "../types";

// Fix: Use process.env.API_KEY as per coding guidelines, instead of Vite-specific import.meta.env.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // Fix: Updated error message to reflect the use of process.env.API_KEY.
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash";

export interface AiResponse {
    text: string;
    imageUrl?: string;
    containsDrugInfo?: boolean;
}

// Fix: Removed unused and incorrectly typed buildHistory function.
// The function was returning Content[] instead of the declared Part[], causing a type error.
// The logic for building chat history is correctly implemented within generateAiResponse and generateAssessmentPlan.

export async function generateAiResponse(
  messages: Message[],
  newUserMessage: string,
  imageBase64?: string
): Promise<AiResponse> {
    const history = messages.slice(0, -1).map(msg => {
        const role = msg.sender === Sender.User ? 'user' : 'model';
        const parts: Part[] = [];
        if (msg.text) parts.push({ text: msg.text });
        if (msg.image) {
             const mimeType = msg.image.startsWith('data:image/jpeg') ? 'image/jpeg' : 
                             msg.image.startsWith('data:image/png') ? 'image/png' : 'image/webp';
            const imageData = msg.image.split(',')[1];
            parts.push({ inlineData: { mimeType, data: imageData } });
        }
        return { role, parts };
    });

    const lastUserMessage = messages[messages.length-1];
    const userParts: Part[] = [{ text: lastUserMessage.text }];

    if (lastUserMessage.image) {
        const mimeType = lastUserMessage.image.startsWith('data:image/jpeg') ? 'image/jpeg' : 
                         lastUserMessage.image.startsWith('data:image/png') ? 'image/png' : 'image/webp';
        const imageData = lastUserMessage.image.split(',')[1];
        userParts.unshift({
            inlineData: {
                mimeType,
                data: imageData,
            },
        });
    }
    
    const contents = [...history, { role: 'user', parts: userParts }];

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
    });

    let rawText = response.text;
    let imageUrl: string | undefined = undefined;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = rawText.match(urlRegex);

    if (urls) {
        for (const url of urls) {
            if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url)) {
                imageUrl = url;
                rawText = rawText.replace(url, '').trim();
                break; 
            }
        }
    }

    const containsDrugInfo = DRUG_INFO_KEYWORDS.some(keyword => rawText.toLowerCase().includes(keyword));

    return { text: rawText, imageUrl, containsDrugInfo };
}


export async function generateAssessmentPlan(messages: Message[]): Promise<AssessmentPlan> {
    const history = messages.map(msg => {
        const role = msg.sender === Sender.User ? 'user' : 'model';
        const parts: Part[] = [];
        if (msg.text) parts.push({ text: msg.text });
        if (msg.image) {
             const mimeType = msg.image.startsWith('data:image/jpeg') ? 'image/jpeg' : 
                             msg.image.startsWith('data:image/png') ? 'image/png' : 'image/webp';
            const imageData = msg.image.split(',')[1];
            parts.push({ inlineData: { mimeType, data: imageData } });
        }
        return { role, parts };
    });

    const planPrompt = `
        Berdasarkan seluruh percakapan di atas, buatlah ringkasan dan rencana dalam format JSON.
        - 'assessment': Berikan daftar poin-poin kemungkinan penyebab gejala (diagnosis banding), selalu gunakan kata "kemungkinan" atau "bisa jadi".
        - 'plan': Berikan daftar poin-poin saran non-obat yang aman dan dapat dilakukan.
        - 'nextSteps': Berikan daftar poin-poin langkah selanjutnya yang paling penting, seperti "Segera konsultasi ke dokter umum" atau "Observasi gejala selama 1-2 hari".
    `;
    const contents = [...history, { role: 'user', parts: [{ text: planPrompt }] }];

    const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    assessment: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Daftar kemungkinan penyebab gejala (diagnosis banding)."
                    },
                    plan: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Daftar saran non-obat yang aman."
                    },
                    nextSteps: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Daftar langkah selanjutnya yang disarankan."
                    }
                },
                required: ["assessment", "plan", "nextSteps"]
            },
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AssessmentPlan;
}
