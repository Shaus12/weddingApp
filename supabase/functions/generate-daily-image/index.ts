import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { partner1, partner2, styleInfo, baseImage } = await req.json()

        // Securely pull API key from Supabase Environment
        const API_KEY = Deno.env.get('NANO_BANANA_API_KEY')

        if (!API_KEY) {
            throw new Error('NANO_BANANA_API_KEY environment variable is missing')
        }

        // Example prompt construction
        const prompt = `A highly cinematic and romantic photo of a couple named ${partner1} and ${partner2}. Setting: modern beautiful aesthetic. Theme: ${styleInfo || 'Elegant Classic'}. Lighting: dramatic, glowing, warm.`

        // Call Nano Banana Pro API (replace with exact endpoint depending on exact Nano Banana docs)
        // Here we use a hypothetical endpoint for image generation
        // If baseImage exists, we construct an image-to-image payload
        // (Note: actual payload shape depends entirely on Nano Banana API schema)
        const requestBody = {
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            ...(baseImage && { init_image: baseImage })
        }

        const response = await fetch('https://api.nanobanana.com/v1/images/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestBody)
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to generate image')
        }

        // Assuming Nano Banana returns `{ data: [{ url: "..." }] }`
        const imageUrl = data.data[0].url

        return new Response(
            JSON.stringify({ imageUrl }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        )
    }
})
