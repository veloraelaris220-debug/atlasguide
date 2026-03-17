import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 5000;
const VALID_ROLES = new Set(["user", "assistant"]);

function validateMessages(messages: unknown): string | null {
  if (!messages || !Array.isArray(messages)) return "Invalid request: messages must be an array";
  if (messages.length === 0) return "Invalid request: messages cannot be empty";
  if (messages.length > MAX_MESSAGES) return `Too many messages: limit is ${MAX_MESSAGES}`;
  for (const msg of messages) {
    if (!msg || typeof msg !== "object") return "Invalid message format";
    if (typeof msg.role !== "string" || !VALID_ROLES.has(msg.role)) return "Invalid message role";
    if (typeof msg.content !== "string" || msg.content.trim().length === 0) return "Invalid message content";
    if (msg.content.length > MAX_MESSAGE_LENGTH) return `Message too long: limit is ${MAX_MESSAGE_LENGTH} characters`;
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    const validationError = validateMessages(messages);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a friendly and knowledgeable travel guide assistant for a travel planning application called Wanderlust. Your role is to help users plan their trips, suggest destinations, provide travel tips, and answer questions about places around the world.

Key behaviors:
- Be enthusiastic and inspiring about travel
- Provide practical and helpful travel advice
- Suggest destinations based on user preferences
- Share interesting facts about places
- Help with itinerary planning
- Recommend local experiences, food, and attractions
- Consider budget, season, and travel style when giving advice
- Keep responses concise but informative (2-3 paragraphs max)
- Only answer travel-related questions. Politely decline non-travel topics.

Remember: You're here to make travel planning exciting and stress-free!`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", response.status);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
