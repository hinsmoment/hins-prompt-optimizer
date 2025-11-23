import { MODEL_NANO, MODEL_JIMENG, MODEL_MIDJOURNEY } from '../constants';

export const generatePromptOpenAI = async (apiKey, baseUrl, modelName, modelType, userPrompt, midjourneyParams = {}) => {
    if (!apiKey) throw new Error("API Key is missing");
    if (!baseUrl) throw new Error("Base URL is missing");
    if (!modelName) throw new Error("Model Name is missing");

    // Ensure baseUrl ends with /v1 or /v1/ if not present, but be careful not to double it if user provided it.
    // Many compatible APIs use /v1/chat/completions.
    // We will assume the user provides the base URL up to the version or root, and we append /chat/completions.
    // Common convention: https://api.example.com/v1

    let endpoint = baseUrl;
    if (endpoint.endsWith('/')) endpoint = endpoint.slice(0, -1);
    if (!endpoint.endsWith('/chat/completions')) {
        endpoint = `${endpoint}/chat/completions`;
    }

    let systemInstruction = "";

    if (modelType === MODEL_NANO) {
        const arInstruction = midjourneyParams.ar ? `\n- **Aspect Ratio**: The image MUST be in ${midjourneyParams.ar} format.` : "";
        systemInstruction = `You are an expert AI Art Prompt Engineer.
Your task is to take a simple user idea and expand it into a rich, descriptive, natural language prompt.

Structure the prompt to include:
- **Subject**: Detailed description of the main subject.
- **Details**: Clothing, textures, accessories.
- **Environment**: Background, lighting, weather, time of day.
- **Mood/Atmosphere**: Emotional tone, colors.
- **Style**: Artistic style (e.g., Photorealistic, Oil Painting, Cyberpunk).
- **Camera**: Lens type, angle, focus (if photorealistic).${arInstruction}

Output ONLY the final prompt in English. Do not include labels like "Subject:" in the final output, just flow naturally.`;
    } else if (modelType === MODEL_JIMENG) {
        const arInstruction = midjourneyParams.ar ? `\n- Aspect Ratio (画幅比例): ${midjourneyParams.ar}` : "";
        systemInstruction = `You are an expert AI Art Prompt Engineer for Jimeng AI (SeaDream 4.0).
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

Output ONLY the final Chinese prompt.`;
    } else if (modelType === MODEL_MIDJOURNEY) {
        systemInstruction = `You are an expert AI Art Prompt Engineer for Midjourney v6.
Your task is to take a simple user idea and expand it into a detailed Midjourney prompt.

Structure:
[Subject Description], [Environment & Context], [Art Style & Medium], [Lighting & Color Palette], [Camera & Composition], [Mood & Atmosphere]

- Use precise, evocative vocabulary.
- Focus on visual descriptors.

Output ONLY the prompt text. Do NOT include parameters like --ar or --v yet (these will be appended by the system).`;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const body = {
        model: modelName,
        messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: `Optimize this prompt for ${modelType}: "${userPrompt}"` }
        ],
        stream: false
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        let responseText = data.choices[0].message.content.trim();

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

    } catch (error) {
        console.error("OpenAI Service Error:", error);
        throw error;
    }
};

export const translateTextOpenAI = async (apiKey, baseUrl, modelName, text, targetLanguage = 'Chinese (Simplified)') => {
    if (!apiKey) throw new Error("API Key is missing");
    if (!baseUrl) throw new Error("Base URL is missing");

    let endpoint = baseUrl;
    if (endpoint.endsWith('/')) endpoint = endpoint.slice(0, -1);
    if (!endpoint.endsWith('/chat/completions')) {
        endpoint = `${endpoint}/chat/completions`;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const body = {
        model: modelName,
        messages: [
            { role: "system", content: `You are a professional translator. Your task is to translate the following AI art prompt into ${targetLanguage}. Provide a clear and accurate translation that captures the artistic intent. Output ONLY the translation.` },
            { role: "user", content: text }
        ],
        stream: false
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Translation Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();

    } catch (error) {
        console.error("OpenAI Translation Error:", error);
        throw error;
    }
};
