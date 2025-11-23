import { GoogleGenerativeAI } from "@google/generative-ai";

import { MODEL_NANO, MODEL_JIMENG, MODEL_MIDJOURNEY } from '../constants';

export const generatePrompt = async (apiKey, modelType, userPrompt, midjourneyParams = {}, geminiModel = 'gemini-2.5-flash') => {
    if (!apiKey) throw new Error("API Key is missing");

    const genAI = new GoogleGenerativeAI(apiKey);

    let systemInstruction = "";

    if (modelType === MODEL_NANO) {
        const arInstruction = midjourneyParams.ar ? `\n      - **Aspect Ratio**: The image MUST be in ${midjourneyParams.ar} format.` : "";
        systemInstruction = `
      You are an expert AI Art Prompt Engineer for Google's Gemini Image Model (Nano Banana).
      Your task is to take a simple user idea and expand it into a rich, descriptive, natural language prompt.
      
      Structure the prompt to include:
      - **Subject**: Detailed description of the main subject.
      - **Details**: Clothing, textures, accessories.
      - **Environment**: Background, lighting, weather, time of day.
      - **Mood/Atmosphere**: Emotional tone, colors.
      - **Style**: Artistic style (e.g., Photorealistic, Oil Painting, Cyberpunk).
      - **Camera**: Lens type, angle, focus (if photorealistic).${arInstruction}
      
      Output ONLY the final prompt in English. Do not include labels like "Subject:" in the final output, just flow naturally.
    `;
    } else if (modelType === MODEL_JIMENG) {
        const arInstruction = midjourneyParams.ar ? `\n      - Aspect Ratio (画幅比例): ${midjourneyParams.ar}` : "";
        systemInstruction = `
      You are an expert AI Art Prompt Engineer for Jimeng AI (SeaDream 4.0).
      Your task is to take a simple user idea and expand it into a high-quality Chinese prompt.
      
      Constraints:
      - Language: Chinese (Simplified).
      - Length: Under 800 Chinese characters.
      - Structure: Comma-separated phrases or short sentences are preferred.
      
      Include:
      - Subject description (主体描述)
      - Detail description (细节描述)
      - Artist style analysis (艺术家风格分析)
      - Theme features (主题特征)
      - Camera/Lens (相机, 镜头)
      - Composition (构图)
      - Mood/Atmosphere (情绪, 氛围)${arInstruction}
      
      Output ONLY the final Chinese prompt.
    `;
    } else if (modelType === MODEL_MIDJOURNEY) {
        systemInstruction = `
      You are an expert AI Art Prompt Engineer for Midjourney v6.
      Your task is to take a simple user idea and expand it into a detailed Midjourney prompt.
      
      Structure:
      [Subject Description], [Environment & Context], [Art Style & Medium], [Lighting & Color Palette], [Camera & Composition], [Mood & Atmosphere]
      
      - Use precise, evocative vocabulary.
      - Focus on visual descriptors.
      
      Output ONLY the prompt text. Do NOT include parameters like --ar or --v yet (these will be appended by the system).
    `;
    }

    const model = genAI.getGenerativeModel({
        model: geminiModel,
        systemInstruction: systemInstruction
    });

    let result;
    let retries = 3;
    while (retries > 0) {
        try {
            result = await model.generateContent({
                contents: [{
                    role: "user", parts: [{ text: `Optimize this prompt for ${modelType}: "${userPrompt}"` }]
                }]
            });
            break;
        } catch (err) {
            if (err.message.includes('503') && retries > 1) {
                console.warn(`Model overloaded, retrying... (${retries - 1} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                retries--;
            } else {
                throw err;
            }
        }
    }

    let responseText = result.response.text().trim();

    // Post-processing for Midjourney parameters
    if (modelType === MODEL_MIDJOURNEY) {
        const params = [];
        if (midjourneyParams.ar) params.push(`--ar ${midjourneyParams.ar}`);
        if (midjourneyParams.v) params.push(`--v ${midjourneyParams.v}`);
        if (midjourneyParams.s) params.push(`--stylize ${midjourneyParams.s}`);
        if (midjourneyParams.c) params.push(`--chaos ${midjourneyParams.c}`);

        responseText += " " + params.join(" ");
    }

    return responseText;
};

export const translateText = async (apiKey, text, geminiModel = 'gemini-2.5-flash', targetLanguage = 'Chinese (Simplified)') => {
    if (!apiKey) throw new Error("API Key is missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: geminiModel,
        systemInstruction: `You are a professional translator. Your task is to translate the following AI art prompt into ${targetLanguage}. Provide a clear and accurate translation that captures the artistic intent. Output ONLY the translation.`
    });

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: text }] }]
    });

    return result.response.text().trim();
};
