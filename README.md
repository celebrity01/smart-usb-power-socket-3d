# Smart USB Power Socket — 3D Working Model

An interactive 3D visualization of a **Smart USB Power Socket with Android Monitoring Application**, built with React Three Fiber and Next.js 16. This is the visual companion to the HND project by **Yusuf Umar Saleh (Reg. No. N23EE010)** at **Hassan Usman Katsina Polytechnic, Katsina**, Department of Electrical Engineering (2025/2026 session).

![Smart USB Power Socket — 3D Model](https://img.shields.io/badge/3D-React_Three_Fiber-blue) ![Next.js 16](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vercel Ready](https://img.shields.io/badge/Vercel-Ready-black)

## Live Demo

After deploying to Vercel, your live URL will appear here.

## What It Shows

The 3D model visualises the complete signal flow of the smart socket system:

- **Power Path (12V → 5V)** — Battery → 1N4007 Diode → LM317 Regulator → Filter Caps + Zener → USB Socket + LED
- **Sensing Path** — ACS712 Current Sensor + Voltage Divider → ESP8266 ADC
- **Control Path** — ESP8266 → Relay → USB Socket (interrupts 5V line)
- **Communication Path (Wi-Fi)** — ESP8266 → Wi-Fi Router → Android Device running the Google Antigravity app

## Features

- **Interactive 3D scene** — drag to rotate, scroll to zoom, right-click drag to pan
- **Power toggle** — turn the system on/off to see animated current/data flow particles along the wires
- **Component click** — click any 3D component (or use the Components tab) to see full specs, role, and connections
- **Signal path filter** — isolate one path (Power/Sensing/Control/Communication) to dim the others
- **Working description** — built-in "How it Works" panel explaining the system
- **Responsive** — works on desktop (side panel) and mobile (slide-up panel)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| 3D Engine | Three.js + @react-three/fiber + @react-three/drei |
| Styling | Tailwind CSS 4 |
| Deployment | Vercel |

## Local Development

```bash
# Install dependencies
bun install  # or npm install

# Run dev server
bun run dev  # or npm run dev

# Open http://localhost:3000
```

## Deploy to Vercel

### Option A — One-click via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this GitHub repository
3. Vercel auto-detects Next.js — accept the defaults
4. Click **Deploy**

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel        # preview deployment
vercel --prod # production deployment
```

No environment variables are required — the 3D model is fully client-side.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   └── page.tsx                # Main page (3D scene + UI overlay)
├── components/
│   └── smart-socket/
│       ├── Scene.tsx           # Canvas, lighting, camera, OrbitControls
│       ├── ComponentMesh.tsx   # 3D mesh renderer for each component
│       ├── Wires.tsx           # Curved wires with animated flow particles
│       └── ControlPanel.tsx    # Side panel UI (tabs, specs, description)
└── lib/
    └── smart-socket-data.ts    # Component & wire specifications
```

## The Actual Hardware Project

This 3D model is the visual companion to a real undergraduate hardware project that includes:

- **Hardware**: LM317-based 12V-to-5V regulator with reverse-polarity protection, filtering, and over-voltage clamping
- **Firmware**: ESP8266 Arduino sketch hosting HTTP endpoints (/status, /relay, /history, /schedules)
- **Android App**: Kotlin + Jetpack Compose MVVM app built with Google Antigravity, with dashboard, power chart (MPAndroidChart), and scheduling
- **Testing**: voltage stability across 0–1.2A load, app response time across 1–15m Wi-Fi distance, energy-metering accuracy vs benchtop multimeter

## Academic Context

- **Institution**: Hassan Usman Katsina Polytechnic, Katsina
- **School**: School of Engineering
- **Department**: Electrical Engineering
- **Student**: Yusuf Umar Saleh
- **Reg. No.**: N23EE010
- **Programme**: Higher National Diploma (HND)
- **Session**: 2025 / 2026
- **Supervisor**: [Supervisor Name]

## License

MIT — free to use for educational purposes. Attribution appreciated.

---

Built as part of an HND project at Hassan Usman Katsina Polytechnic, Katsina.
