const GEMINI_API_KEY = 'AIzaSyAvxUKMG_0NRu2u1ypBlWcGBApwqm7OD_c';
const GEMINI_TEXT_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const GEMINI_IMAGE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Generate a batch of creative romantic scene prompts using Gemini.
 */
export async function generateScenePrompts(
    partner1: string,
    partner2: string,
    count: number = 6
): Promise<string[]> {
    try {
        const response = await fetch(GEMINI_TEXT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `Generate exactly ${count} short, vivid, romantic scene descriptions for a couple named ${partner1} and ${partner2}. 
Each scene should be a single sentence describing a beautiful setting or activity, like:
- "Dancing under string lights in a rooftop garden at sunset"
- "Walking hand in hand on a misty forest trail"
- "Laughing together on the bow of a yacht at golden hour"

Return ONLY a JSON array of strings, nothing else. Example: ["scene 1", "scene 2"]`,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 1.0,
                    topP: 0.95,
                },
            }),
        });

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        // Extract JSON array from the response (strip markdown code fences if present)
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const prompts: string[] = JSON.parse(cleaned);
        return prompts.slice(0, count);
    } catch (error) {
        console.warn('Failed to generate prompts, using fallback:', error);
        return [
            'Dancing under string lights at a rooftop garden party',
            'Walking hand in hand through a misty enchanted forest',
            'Laughing on the bow of a luxury yacht at golden hour',
            'Strolling through a lavender field in Provence at sunset',
            'Sharing wine at a cozy candlelit cabin in the mountains',
            'Twirling in the rain on an old European cobblestone street',
        ].slice(0, count);
    }
}

/**
 * Generate an AI image for a given scene prompt using Gemini 2.0 Flash (image generation).
 * Returns a base64 data URI string.
 */
export async function generateImage(scenePrompt: string): Promise<string | null> {
    try {
        const fullPrompt = `Create a beautiful, dreamy, artistic illustration of a couple: ${scenePrompt}. 
Style: romantic, warm colors, soft lighting, wedding photography inspired, elegant and timeless.`;

        const response = await fetch(GEMINI_IMAGE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: fullPrompt }],
                    },
                ],
                generationConfig: {
                    responseModalities: ['IMAGE', 'TEXT'],
                    temperature: 1.0,
                },
            }),
        });

        const data = await response.json();

        // Find the image part in the response
        const parts = data?.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
            if (part.inlineData) {
                const { mimeType, data: base64Data } = part.inlineData;
                return `data:${mimeType};base64,${base64Data}`;
            }
        }

        console.warn('No image found in Gemini response');
        return null;
    } catch (error) {
        console.warn('Failed to generate image:', error);
        return null;
    }
}
