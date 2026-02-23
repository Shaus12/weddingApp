import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const {
            partner1,
            partner2,
            imageUrl,
            prompt: userPrompt
        } = await req.json()

        // Hardcoded API key as requested by the user
        const API_KEY = 'f5d133b7bacbbdf3c63abdba52070506';

        // Construct a cute prompt if one isn't strictly provided
        const finalPrompt = userPrompt || `A cute, romantic, and highly cinematic video of a couple ${partner1 ? `named ${partner1}` : ''} ${partner2 ? `and ${partner2}` : ''} sharing a lovely moment together. Beautiful lighting, elegant atmosphere.`;

        // Request body matching Kie.ai Seedance documentation patterns
        const requestBody = {
            prompt: finalPrompt,
            model: 'seedance-1-5-pro',
            duration: 5,
            aspectRatio: '16:9',
            quality: '1080p',
            ...(imageUrl && { imageUrl })
        };

        let lastResponseData = null;
        let success = false;
        let retries = 0;
        const MAX_RETRIES = 3;
        let lastError = null;

        // Perform up to 3 retries (Pro accounts retry feature)
        while (retries < MAX_RETRIES && !success) {
            try {
                const response = await fetch('https://api.kie.ai/v1/video/generations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify(requestBody)
                });

                lastResponseData = await response.json();

                if (response.ok) {
                    success = true;
                } else {
                    throw new Error(lastResponseData.error?.message || lastResponseData.message || 'API generation failed');
                }
            } catch (err) {
                lastError = err;
                retries++;
                console.log(`Attempt ${retries} failed: ${err.message}. Retrying...`);
                if (retries < MAX_RETRIES) {
                    // Wait 2 seconds before retrying
                    await new Promise(res => setTimeout(res, 2000));
                }
            }
        }

        if (!success) {
            throw lastError || new Error('Video generation failed after 3 retries.');
        }

        // Return the successfully generated data
        return new Response(
            JSON.stringify({
                success: true,
                message: 'Video generated successfully',
                data: lastResponseData
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        )
    }
})
