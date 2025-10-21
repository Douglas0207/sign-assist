// Reference: javascript_websocket integration blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { interpretGesture, generateSampleInterpretation } from "./openai";
import { z } from "zod";
import { SensorData } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time sensor data simulation
  // Following blueprint: separate path to avoid conflicts with Vite HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Track connected clients
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    clients.add(ws);

    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connected' }));

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        if (data.type === 'start_simulation') {
          console.log('Starting sensor simulation');
        } else if (data.type === 'stop_simulation') {
          console.log('Stopping sensor simulation');
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Broadcast sensor data to all connected clients
  function broadcastSensorData(data: SensorData) {
    const message = JSON.stringify({ type: 'sensor_data', data });
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Sensor simulation interval (runs continuously when clients are connected)
  setInterval(() => {
    if (clients.size > 0) {
      const simulatedData: SensorData = {
        thumb: Math.floor(Math.random() * 1024),
        index: Math.floor(Math.random() * 1024),
        middle: Math.floor(Math.random() * 1024),
        ring: Math.floor(Math.random() * 1024),
        pinky: Math.floor(Math.random() * 1024),
        timestamp: Date.now(),
      };
      broadcastSensorData(simulatedData);
    }
  }, 500); // Update every 500ms

  // API Routes

  // POST /api/interpret-gesture - Interpret gesture using OpenAI
  app.post('/api/interpret-gesture', async (req, res) => {
    try {
      const { handLandmarks, sensorData, context, useSimulation } = req.body;

      let interpretation;

      if (useSimulation) {
        // Use sample interpretation for testing
        interpretation = generateSampleInterpretation(sensorData);
      } else {
        // Use OpenAI for real interpretation
        interpretation = await interpretGesture({
          handLandmarks,
          sensorData,
          context,
        });
      }

      // Save to storage with timestamp
      await storage.saveGestureInterpretation({
        gestureData: { handLandmarks, sensorData },
        interpretedText: interpretation.interpretedText,
        command: interpretation.command,
        confidence: interpretation.confidence,
        timestamp: interpretation.timestamp,
      });

      res.json(interpretation);
    } catch (error) {
      console.error('Gesture interpretation error:', error);
      res.status(500).json({
        error: 'Failed to interpret gesture',
        message: (error as Error).message,
      });
    }
  });

  // GET /api/gesture-history - Get gesture interpretation history
  app.get('/api/gesture-history', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const history = await storage.getGestureInterpretations(limit);
      res.json(history);
    } catch (error) {
      console.error('Error fetching gesture history:', error);
      res.status(500).json({
        error: 'Failed to fetch gesture history',
        message: (error as Error).message,
      });
    }
  });

  // GET /api/gesture/:id - Get specific gesture interpretation
  app.get('/api/gesture/:id', async (req, res) => {
    try {
      const interpretation = await storage.getGestureInterpretationById(req.params.id);
      
      if (!interpretation) {
        return res.status(404).json({ error: 'Gesture interpretation not found' });
      }

      res.json(interpretation);
    } catch (error) {
      console.error('Error fetching gesture:', error);
      res.status(500).json({
        error: 'Failed to fetch gesture',
        message: (error as Error).message,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      websocket: {
        clients: clients.size,
      },
    });
  });

  return httpServer;
}
