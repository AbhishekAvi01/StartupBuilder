/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  idea: string;
  step: "problemSolution" | "marketResearch" | "businessModel" | "pitchDeck";
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, step }: RequestBody = await req.json();

    if (!idea || !step) {
      return new Response(
        JSON.stringify({ error: "Missing idea or step parameter" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Processing step: ${step} for idea: ${idea.substring(0, 50)}...`);

    // Define prompts for each step (matching the original LangChain tools)
    const prompts: Record<string, string> = {
      problemSolution: `Refine this startup idea into a clear problem-solution format:\n${idea}\n\nFormat your response as:\nProblem: <clear problem statement>\nSolution: <your proposed solution>`,

      marketResearch: `Based on this startup idea:\n${idea}\n\nProvide comprehensive market research covering:\n- Target audience\n- Market size\n- Demand analysis\n- Key competitors\n- Current trends\n- Growth potential`,

      businessModel: `For this startup idea:\n${idea}\n\nCreate a comprehensive 9-block Business Model Canvas covering:\n1. Key Partners\n2. Key Activities\n3. Key Resources\n4. Value Propositions\n5. Customer Relationships\n6. Channels\n7. Customer Segments\n8. Cost Structure\n9. Revenue Streams`,

      pitchDeck: `For this startup idea:\n${idea}\n\nGenerate content for a 10-slide pitch deck with bullet points for:\nSlide 1: Problem\nSlide 2: Solution\nSlide 3: Market Opportunity\nSlide 4: Product/Service\nSlide 5: Business Model\nSlide 6: Competition\nSlide 7: Competitive Advantage\nSlide 8: Go-to-Market Strategy\nSlide 9: Team\nSlide 10: Financial Projections & Ask`,
    };

    const systemPrompt = `You are an expert startup advisor and business analyst with 20+ years of experience helping entrepreneurs refine ideas and build successful companies. Provide detailed, actionable, and professional insights.`;

    // Call Lovable AI (Gemini)
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompts[step] },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI Gateway error (${response.status}):`, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "Payment required. Please add credits to your workspace.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "";

    console.log(`Successfully generated ${step} (${result.length} chars)`);

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in startup-agent:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
