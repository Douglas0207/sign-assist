import { type GestureInterpretation, type InsertGestureInterpretation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Gesture interpretation history
  saveGestureInterpretation(data: InsertGestureInterpretation): Promise<GestureInterpretation>;
  getGestureInterpretations(limit?: number): Promise<GestureInterpretation[]>;
  getGestureInterpretationById(id: string): Promise<GestureInterpretation | undefined>;
}

export class MemStorage implements IStorage {
  private gestureInterpretations: Map<string, GestureInterpretation>;

  constructor() {
    this.gestureInterpretations = new Map();
  }

  async saveGestureInterpretation(
    data: InsertGestureInterpretation
  ): Promise<GestureInterpretation> {
    const id = randomUUID();
    const interpretation: GestureInterpretation = {
      ...data,
      id,
      timestamp: data.timestamp || Date.now(),
    };
    this.gestureInterpretations.set(id, interpretation);
    return interpretation;
  }

  async getGestureInterpretations(limit: number = 50): Promise<GestureInterpretation[]> {
    const all = Array.from(this.gestureInterpretations.values());
    // Sort by timestamp descending (newest first)
    all.sort((a, b) => b.timestamp - a.timestamp);
    return all.slice(0, limit);
  }

  async getGestureInterpretationById(id: string): Promise<GestureInterpretation | undefined> {
    return this.gestureInterpretations.get(id);
  }
}

export const storage = new MemStorage();
