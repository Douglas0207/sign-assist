# Sign Language AI Assistant

## Project Overview
A fullstack JavaScript application that bridges communication for speech-impaired users through AI-powered sign language recognition. The system combines webcam-based hand gesture detection with simulated flex sensor data to interpret sign language into actionable commands.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Shadcn UI
- **Backend**: Node.js + Express + WebSocket
- **AI**: OpenAI GPT-5 for gesture interpretation
- **Hand Tracking**: MediaPipe Hands (or TensorFlow.js) - to be integrated
- **Real-time Communication**: WebSocket for sensor data simulation
- **Styling**: Custom design system based on Material Design 3 principles

## Current Status
**MVP Complete** - All three phases finished (October 21, 2025)

**Phase 1**: Schema & Frontend ✅
- Data models and TypeScript interfaces
- Design system (Material Design 3-inspired)
- All React components with professional UI
- Responsive dashboard layout
- Dark/light theme support

**Phase 2**: Backend ✅  
- WebSocket server for real-time sensor simulation
- OpenAI GPT-5 integration for gesture interpretation
- RESTful API endpoints
- In-memory storage with persistence methods
- Sample gesture interpreter for demo mode

**Phase 3**: Integration ✅
- WebSocket connection for live sensor data
- Automatic gesture interpretation (every 3 seconds)
- Text-to-speech voice output
- Command history with backend persistence
- Toast notifications for user feedback
- Complete error handling

**Live Features**:
- Real-time simulated sensor data via WebSocket
- AI-powered gesture interpretation
- Voice output with Web Speech API
- Command history that persists across sessions
- Professional dashboard UI with dark/light modes
- Responsive design (mobile + desktop)
- Camera permission handling

**Future Enhancements** (Post-MVP):
- MediaPipe Hands integration for real webcam gesture tracking
- Real Arduino/ESP32 hardware connection via Bluetooth Web API
- Advanced gesture training and calibration
- User authentication and personalized gesture libraries
- PostgreSQL database for production persistence

## Architecture

### Data Model (shared/schema.ts)
- **GestureInterpretation**: Persisted gesture interpretations with confidence scores
- **SensorData**: Real-time flex sensor values (thumb, index, middle, ring, pinky)
- **HandLandmark**: 3D coordinates for hand tracking
- **CommandExecution**: Command history with status tracking

### Frontend Components
- **Dashboard** (`/`): Main interface with video feed, interpretation panel, controls
- **VideoFeed**: Webcam capture with permission handling and live indicator
- **InterpretationPanel**: Displays AI-interpreted gestures with confidence meter
- **SensorDashboard**: Visualizes simulated Arduino flex sensor values (0-1023)
- **ControlPanel**: Recognition controls, calibration, voice output toggle
- **CommandHistory**: Timeline of executed commands with timestamps
- **ThemeProvider**: Dark/light mode with localStorage persistence

### Backend Routes (To Be Implemented)
- `POST /api/interpret-gesture`: Send hand landmarks + sensor data, receive AI interpretation
- `WebSocket /ws`: Real-time sensor data simulation and updates

### Hardware Integration Points
The app is designed to connect to real Arduino/ESP32 hardware:
- **Simulated JSON format** matches expected Arduino output:
  ```json
  {
    "thumb": 230,
    "index": 180,
    "middle": 520,
    "ring": 780,
    "pinky": 340,
    "timestamp": 1234567890
  }
  ```
- Ready for Bluetooth Web API or Serial Web API integration
- Calibration mode placeholder for sensor tuning

## Design System

### Colors (Dark Mode Primary)
- **Primary**: Blue (#5B9EFF) - Trust and technology
- **Success/Active**: Green (#52B788) - Successful recognition
- **Warning**: Amber (#F59E0B) - Calibration/warnings
- **Error**: Red (#F87171) - Failed recognition
- **Backgrounds**: Deep charcoal with elevated surfaces
- **Chart Colors**: Configured for sensor visualization

### Typography
- **Primary**: Inter - UI text, labels, body
- **Monospace**: JetBrains Mono - Sensor data, technical readouts

### Spacing
- Consistent padding: `p-6` to `p-8` for cards
- Grid gaps: `gap-6` to `gap-8`
- Component spacing: `space-y-4` for vertical rhythm

### Key Features
- Accessibility-first with WCAG 2.1 AA compliance
- Responsive design (mobile-first with desktop optimization)
- Real-time visual feedback (pulsing indicators, confidence meters)
- Professional dashboard aesthetic (Linear/Vercel-inspired)

## User Preferences
- Default theme: Dark mode (accessible for varied lighting conditions)
- Design priority: Clarity and real-time feedback over decoration
- Voice output: Enabled by default for accessibility

## Recent Changes (October 21, 2025)
- Initial project setup with fullstack JavaScript template
- Complete frontend implementation with all MVP components
- Design system configuration matching design guidelines
- Schema definition for gesture interpretation and sensor data
- Theme provider with dark mode support
- Responsive dashboard layout (8-column video + 4-column sidebar)

## Development Notes
- Camera permissions required for gesture recognition
- Web Speech API will be used for text-to-speech output
- WebSocket connection will provide real-time sensor simulation
- OpenAI API key configured via environment variables
- MediaPipe Hands integration planned for Phase 3
