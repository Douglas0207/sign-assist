import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Gesture interpretation schema
export const gestureInterpretations = pgTable("gesture_interpretations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gestureData: jsonb("gesture_data").notNull(), // Hand landmarks and sensor values
  interpretedText: text("interpreted_text").notNull(),
  command: text("command"), // e.g., "send_message", "play_music"
  confidence: integer("confidence").notNull(), // 0-100
  timestamp: integer("timestamp").notNull(), // Unix timestamp in milliseconds
});

export const insertGestureInterpretationSchema = createInsertSchema(gestureInterpretations).omit({
  id: true,
}).extend({
  timestamp: z.number().optional(),
});

export type InsertGestureInterpretation = z.infer<typeof insertGestureInterpretationSchema>;
export type GestureInterpretation = typeof gestureInterpretations.$inferSelect;

// TypeScript interfaces for real-time data (not persisted)

// Sensor data from simulated Arduino/ESP32 flex sensors
export interface SensorData {
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  pinky: number;
  timestamp: number;
}

// Hand landmarks from MediaPipe/TensorFlow.js
export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandDetection {
  landmarks: HandLandmark[];
  handedness: "Left" | "Right";
  confidence: number;
}

// Gesture interpretation request/response
export interface GestureInterpretRequest {
  handLandmarks?: HandLandmark[];
  sensorData?: SensorData;
  context?: string;
}

export interface GestureInterpretResponse {
  interpretedText: string;
  command?: string;
  confidence: number;
  actionDescription?: string;
  timestamp: number;
}

// Command execution status
export type CommandStatus = "processing" | "recognized" | "executed" | "failed";

export interface CommandExecution {
  id: string;
  gestureType: string;
  interpretedText: string;
  command?: string;
  status: CommandStatus;
  timestamp: number;
  confidence: number;
}
