
import { GoogleGenAI, GenerateContentResponse, Part, Type, Content } from "@google/genai";
import { SYSTEM_INSTRUCTION, DRUG_INFO_KEYWORDS } from '../constants';
import { type Message, Sender, type AssessmentPlan } from "../types";

// This is the correct way to access environment variables in a Vite project.
// Vercel will replace this with your secret variable during the build process.
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_API_KEY environment variable is not set. Please check your Vercel project settings and ensure the variable is named correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash";

export interface AiResponse {
    text: string;
    imageUrl?: string;
    containsDrugInfo?: boolean;
}

// Helper function to build the conversation history in the format expected by the Gemini API.
function buildHistory(messages: Message[]): Content[] {
    return messages.map(msg => {
        const role = msg.sender === Sender.User ? 'user' : 'model';
        const parts: Part[] = [];

        // Ensure text is always added as a part if it exists
        if (msg.text) {
            parts.push({ text: msg.text });
        }

        // Handle images, ensuring they are correctly formatted
        if (msg.image && msg.image.startsWith('data:image')) {
            try {
                const [header, data] = msg.image.split(',');
                if (header && data) {
                    const mimeType = header.split(':')[1].split(';')[0];
                    parts.push({ inlineData: { mimeType, data } });
                }
            } catch (error) {
                console.error("Failed to process inline image data:", error);
            }
        }
        
        return { role, parts };
    });
}

export async function generateAiResponse(
  messages: Message[]
): Promise<AiResponse> {
    // The history for the API call should be all messages *except* the last one.
    const history = buildHistory(messages.slice(0, -1));
    const lastUserMessage = messages[messages.length - 1];

    // The last message is the current input to the model.
    const userParts: Part[] = [{ text: lastUserMessage.text }];

    if (lastUserMessage.image) {
        const [header, data] = lastUserMessage.image.split(',');
        const mimeType = header.split(':')[1].split(';')[0];
        // For multimodal input, it's often better to put the image first.
        userParts.unshift({
            inlineData: {
                mimeType,
                data,
            },
        });
    }
    
    // Combine history with the current user message.
    const contents: Content[] = [...history, { role: 'user', parts: userParts }];

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
    });

    let rawText = response.text;
    let imageUrl: string | undefined = undefined;

    // Regex to find all URLs in the text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = rawText.match(urlRegex);

    if (urls) {
        for (const url of urls) {
            // Check if the URL is for an image, allowing for query parameters
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
    const history = buildHistory(messages);
    const planPrompt = `
        Berdasarkan seluruh percakapan di atas, buatlah ringkasan dan rencana dalam format JSON.
        - 'assessment': Berikan daftar poin-poin kemungkinan penyebab gejala (diagnosis banding), selalu gunakan kata "kemungkinan" atau "bisa jadi".
        - 'plan': Berikan daftar poin-poin saran non-obat yang aman dan dapat dilakukan.
        - 'nextSteps': Berikan daftar poin-poin langkah selanjutnya yang paling penting, seperti "Segera konsultasi ke dokter umum" atau "Observasi gejala selama 1-2 hari".
    `;
    const contents: Content[] = [...history, { role: 'user', parts: [{ text: planPrompt }] }];

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
