// Reference: javascript_openai integration blueprint
import OpenAI from "openai";
import { GestureInterpretRequest, GestureInterpretResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function interpretGesture(
  request: GestureInterpretRequest
): Promise<GestureInterpretResponse> {
  try {
    const { handLandmarks, sensorData, context } = request;

    // Build a descriptive prompt for the AI
    const prompt = buildGesturePrompt(handLandmarks, sensorData, context);

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an expert sign language interpreter assistant. Analyze hand gestures and sensor data to determine the intended sign language gesture or command. 
          
Respond with JSON in this exact format:
{
  "interpretedText": "A clear, natural description of the gesture or command",
  "command": "action_name" (optional, e.g., "send_message", "play_music", "open_app"),
  "confidence": number (0-100),
  "actionDescription": "Brief description of what action would be taken" (optional)
}

Common gestures to recognize:
- Thumbs up/down
- Peace sign
- Pointing gestures
- Open/closed hand
- Specific letter signs (ASL)
- Custom commands like "Message [name]", "Call [person]", "Play music", "Open [app]"

Consider both the hand position/shape AND the sensor flex values to determine the gesture accurately.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      interpretedText: result.interpretedText || "Unable to interpret gesture",
      command: result.command,
      confidence: Math.max(0, Math.min(100, result.confidence || 0)),
      actionDescription: result.actionDescription,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("OpenAI interpretation error:", error);
    throw new Error("Failed to interpret gesture: " + (error as Error).message);
  }
}

function buildGesturePrompt(
  handLandmarks: any[] | undefined,
  sensorData: any | undefined,
  context?: string
): string {
  let prompt = "Analyze this sign language gesture:\n\n";

  if (sensorData) {
    prompt += `Flex Sensor Data (0-1023 range, higher = more bent):\n`;
    prompt += `- Thumb: ${sensorData.thumb}\n`;
    prompt += `- Index: ${sensorData.index}\n`;
    prompt += `- Middle: ${sensorData.middle}\n`;
    prompt += `- Ring: ${sensorData.ring}\n`;
    prompt += `- Pinky: ${sensorData.pinky}\n\n`;
  }

  if (handLandmarks && handLandmarks.length > 0) {
    prompt += `Hand landmark data detected with ${handLandmarks.length} points.\n`;
    prompt += `Hand appears to be in a specific configuration based on webcam tracking.\n\n`;
  }

  if (context) {
    prompt += `Additional context: ${context}\n\n`;
  }

  prompt += `Based on this data, what gesture or command is the user performing?`;

  return prompt;
}

// Sample gesture simulator for testing without real hardware
export function generateSampleInterpretation(
  sensorData: any
): GestureInterpretResponse {
  const interpretations = [
    {
      interpretedText: "Thumbs up",
      command: "approve",
      confidence: 92,
      actionDescription: "Gesture indicates approval or agreement",
    },
    {
      interpretedText: "Peace sign",
      command: "victory",
      confidence: 88,
      actionDescription: "Two-finger peace/victory gesture detected",
    },
    {
      interpretedText: "Message Robin",
      command: "send_message",
      confidence: 85,
      actionDescription: "Initiating message composition to Robin",
    },
    {
      interpretedText: "Play music",
      command: "play_music",
      confidence: 90,
      actionDescription: "Opening music player application",
    },
    {
      interpretedText: "Open WhatsApp",
      command: "open_whatsapp",
      confidence: 87,
      actionDescription: "Launching WhatsApp application",
    },
  ];

  // Simple random selection for demo
  const selected = interpretations[Math.floor(Math.random() * interpretations.length)];

  return {
    ...selected,
    timestamp: Date.now(),
  };
}
