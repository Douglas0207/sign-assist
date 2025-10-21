# Design Guidelines: Sign Language AI Assistant

## Design Approach

**Selected Framework**: Material Design 3 + Modern Dashboard Patterns (Linear/Vercel-inspired)

**Justification**: This assistive technology requires exceptional clarity, real-time visual feedback, and accessibility. Material Design provides robust patterns for data-dense interfaces while maintaining visual hierarchy. We'll enhance it with modern dashboard aesthetics for a professional, trustworthy feel.

**Key Design Principles**:
- **Clarity Above All**: Real-time data must be instantly readable
- **Accessibility-First**: High contrast, large touch targets, screen reader support
- **Responsive Feedback**: Immediate visual confirmation of gesture recognition
- **Professional Trust**: Clean, modern aesthetic that inspires confidence in the technology

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**:
- Background Primary: `222 15% 11%` (deep charcoal)
- Background Secondary: `222 15% 15%` (elevated surfaces)
- Primary Brand: `217 91% 60%` (vibrant blue - trust and technology)
- Success/Active: `142 76% 45%` (green for successful recognition)
- Warning: `38 92% 50%` (amber for calibration/warnings)
- Error: `0 84% 60%` (red for failed recognition)
- Text Primary: `0 0% 98%`
- Text Secondary: `0 0% 70%`

**Light Mode**:
- Background: `0 0% 98%`
- Surface: `0 0% 100%`
- Primary: `217 91% 45%`
- Text Primary: `222 15% 15%`
- Text Secondary: `222 8% 45%`

### B. Typography

**Families**:
- Primary: Inter (via Google Fonts) - UI text, labels, body
- Monospace: JetBrains Mono - sensor data, technical readouts, timestamps

**Hierarchy**:
- Hero Heading: 3xl/4xl, font-bold (36-48px)
- Section Heading: xl/2xl, font-semibold (20-24px)
- Card Title: lg, font-medium (18px)
- Body Text: base, font-normal (16px)
- Caption/Labels: sm, font-medium (14px)
- Technical Data: sm/xs, font-mono (12-14px)

### C. Layout System

**Spacing Units**: Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16, 24
- Component padding: `p-6` to `p-8`
- Section gaps: `gap-6` to `gap-8`
- Page margins: `px-6 lg:px-12`
- Card spacing: `space-y-4`

**Grid System**:
- Main Dashboard: 12-column grid (`grid-cols-1 lg:grid-cols-12`)
- Video feed takes 8 columns, sidebar 4 columns on desktop
- Mobile: Single column stack with video feed first

### D. Component Library

**Primary Components**:

1. **Real-Time Video Display**
   - Large, centered webcam feed with rounded corners (`rounded-xl`)
   - Overlay showing detected hand landmarks (skeletal visualization)
   - Live status indicator (pulsing green dot when active)
   - Frame border glows blue during active recognition

2. **Gesture Interpretation Panel**
   - Prominent card displaying interpreted text with typing animation
   - Command confidence meter (0-100%)
   - Action status chip ("Processing", "Recognized", "Executed")
   - Recent gestures history list (last 5-10 interpretations)

3. **Sensor Data Dashboard** (Hardware Simulation)
   - 5 vertical progress bars representing each finger flex sensor
   - Real-time numerical values in monospace font
   - Color-coded based on flex degree (blue → cyan → green)
   - Mini sparkline graphs showing last 10 readings

4. **Control Panel**
   - Large toggle buttons: Start/Stop Recognition, Calibrate
   - Settings dropdown for sensitivity, language, voice output
   - Connection status for simulated hardware

5. **Command Action Feed**
   - Timeline-style list of executed commands
   - Each entry shows: timestamp, gesture, interpreted text, action taken
   - Expandable detail view for AI reasoning

**Navigation**: Top navbar with logo, dashboard/settings/about tabs, theme toggle

**Cards & Surfaces**:
- Elevated cards: `bg-zinc-900 rounded-xl shadow-lg border border-zinc-800`
- Subtle hover: `hover:border-zinc-700 transition-colors`
- No drop shadows in dark mode, use border highlights

**Forms & Inputs**:
- Dark inputs: `bg-zinc-800 border-zinc-700 focus:border-blue-500`
- Large touch targets (min 44px height)
- Clear labels with helper text

**Overlays**:
- Modal dialogs: Centered, max-w-md, backdrop blur
- Toast notifications: Bottom-right, auto-dismiss
- Calibration wizard: Full-screen overlay with step indicators

### E. Animations

**Minimal, Purposeful Only**:
- Gesture recognition pulse: Subtle scale animation on video border when detecting
- Confidence meter: Smooth width transition (duration-300)
- Success confirmation: Quick green flash on successful interpretation
- Loading states: Simple spinner, no elaborate loaders
- NO scroll-based animations, NO page transitions

---

## Images

**No Large Hero Image**: This is a utility dashboard, not a marketing page. Focus is on real-time functionality.

**Functional Images**:
1. **Webcam Feed**: Live video capture displayed prominently in main content area
2. **Hand Landmark Visualization**: Overlay skeleton showing detected finger joints and connections
3. **Empty State Illustrations**: Simple, minimal illustrations when webcam is inactive (e.g., hand icon with "Enable camera to start")
4. **Tutorial/Onboarding**: Small inline diagrams showing proper hand positioning

---

## Layout Structure

**Dashboard Layout**:
```
├─ Top Navbar (fixed)
├─ Main Grid Container
│  ├─ Left Section (8 cols): Live Video Feed + Overlay
│  └─ Right Sidebar (4 cols): 
│     ├─ Interpretation Panel
│     ├─ Sensor Data Visualization
│     └─ Control Panel
└─ Bottom Panel: Command History Timeline (collapsible)
```

**Mobile Adaptation**:
- Stack vertically: Video → Interpretation → Controls → Sensors → History
- Video feed takes full width but constrained height (max-h-96)
- Sticky control panel at bottom for quick access

---

## Accessibility Mandates

- WCAG 2.1 AA minimum contrast ratios (4.5:1 for text)
- All interactive elements keyboard navigable
- Screen reader labels for all sensor data and status indicators
- High contrast mode toggle option
- Font size controls (base 16px, scalable to 20px)
- Focus indicators: 2px blue ring on all focusable elements
- Alternative text for all gesture interpretations (for screen readers)

---

**Overall Aesthetic**: Modern technical dashboard with clean lines, consistent spacing, and purposeful color use. Prioritize clarity and immediate readability over decorative elements. The interface should feel like a professional assistive tool—trustworthy, responsive, and empowering.