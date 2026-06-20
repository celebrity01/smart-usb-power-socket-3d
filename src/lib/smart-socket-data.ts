/**
 * Component specifications and metadata for the Smart USB Power Socket 3D model.
 * Each component has:
 *   - id: unique identifier used by the 3D scene
 *   - name: display name
 *   - category: power | sensing | control | communication
 *   - position: [x, y, z] in 3D space
 *   - color: hex color for the 3D mesh
 *   - description: short text shown in tooltip / info panel
 *   - spec: technical specification string
 *   - pins: array of connection endpoints (for wires)
 *   - role: human-readable role for the working description
 */

export type ComponentCategory =
  | "power"
  | "sensing"
  | "control"
  | "communication";

export interface ComponentSpec {
  id: string;
  name: string;
  shortLabel: string;
  category: ComponentCategory;
  position: [number, number, number];
  color: string;
  shape:
    | "cylinder-battery"
    | "diode"
    | "ic-to220"
    | "capacitor-cyl"
    | "zener"
    | "resistor"
    | "led"
    | "usb-socket"
    | "pcb-board"
    | "esp8266"
    | "relay"
    | "router"
    | "phone"
    | "acsource";
  description: string;
  spec: string;
  role: string;
}

export const COMPONENTS: ComponentSpec[] = [
  {
    id: "battery",
    name: "12V Battery (Cigar Plug)",
    shortLabel: "12V",
    category: "power",
    position: [-9, 0.4, 0],
    color: "#FFB366",
    shape: "cylinder-battery",
    description:
      "12V automotive lead-acid battery accessed through the vehicle's cigar-lighter socket. Provides the raw DC input that the smart socket will step down to 5V for USB devices.",
    spec: "12V DC, 7Ah typical, cigar-lighter plug with 5A fuse",
    role: "Primary power source — supplies 12V DC to the regulator input.",
  },
  {
    id: "diode",
    name: "1N4007 Reverse-Polarity Diode",
    shortLabel: "D1",
    category: "power",
    position: [-6.5, 0.4, 0],
    color: "#FFE066",
    shape: "diode",
    description:
      "Series 1N4007 rectifier diode provides reverse-polarity protection. If the cigar-lighter plug is connected backwards, the diode blocks current flow and protects the downstream regulator.",
    spec: "1A, 1000V, Vf ≈ 0.7V, DO-41 axial package",
    role: "Reverse-polarity protection — blocks current if input is reversed.",
  },
  {
    id: "regulator",
    name: "LM317 Voltage Regulator",
    shortLabel: "LM317",
    category: "power",
    position: [-4, 0.6, 0],
    color: "#7FBF7F",
    shape: "ic-to220",
    description:
      "Adjustable 3-terminal linear regulator. Steps the 12V input down to a stable 5V output. Output voltage is set by the external R1/R2 divider (270Ω / 820Ω → 5.09V).",
    spec: "Vout = 1.25 × (1 + R2/R1) = 5.09V, 1.5A max, TO-220 package",
    role: "Voltage conversion — reduces 12V to a regulated 5V for USB devices.",
  },
  {
    id: "caps",
    name: "Filter Capacitors + Zener",
    shortLabel: "C1-C4 + ZD1",
    category: "power",
    position: [-1.5, 0.4, 0],
    color: "#7FBF7F",
    shape: "capacitor-cyl",
    description:
      "Input/output filtering: C1 470µF (input ripple), C2 10µF (output transient), C3 1µF, C4 0.1µF (HF noise). 5.6V Zener diode clamps output for over-voltage protection.",
    spec: "C1: 470µF/25V • C2: 10µF/25V • C3: 1µF/10V • C4: 0.1µF • ZD1: 5.6V/1W",
    role: "Filtering & protection — smooths output and clamps over-voltage.",
  },
  {
    id: "usb",
    name: "USB Type-A Socket + LED",
    shortLabel: "USB",
    category: "power",
    position: [1.5, 0.4, 0],
    color: "#7FB3D5",
    shape: "usb-socket",
    description:
      "Standard USB 2.0 Type-A female socket delivering 5V at up to 1.2A. A red LED with 330Ω current-limiting resistor provides visual confirmation that 5V is present.",
    spec: "USB 2.0 Type-A, 5V/1.2A max, LED indicator (red, 2V, 9mA)",
    role: "Output port — supplies 5V DC to the connected USB device.",
  },
  {
    id: "acs712",
    name: "ACS712 Current Sensor",
    shortLabel: "ACS712",
    category: "sensing",
    position: [-4, -2.2, 0],
    color: "#F5A0A0",
    shape: "ic-to220",
    description:
      "Hall-effect current sensor measures the load current flowing through the regulator output. Analogue output (66mV/A, centred at 2.5V) is read by the ESP8266 ADC.",
    spec: "±5A range, 66mV/A sensitivity, 80kHz bandwidth, ±1.5% accuracy",
    role: "Current measurement — reports load current to the ESP8266.",
  },
  {
    id: "vdivider",
    name: "Voltage Divider (V-sense)",
    shortLabel: "Vdiv",
    category: "sensing",
    position: [-1.5, -2.2, 0],
    color: "#F5A0A0",
    shape: "resistor",
    description:
      "Two 10kΩ resistors form a 10:1 voltage divider that scales the 5V output down to 0.5V — within the ESP8266 ADC's 0–1V range — for safe voltage measurement.",
    spec: "R = 10kΩ + 10kΩ (1/4W, 5%), ratio = 10:1, Vout = Vin/10",
    role: "Voltage measurement — scales 5V down to ESP8266 ADC range.",
  },
  {
    id: "esp8266",
    name: "ESP8266 NodeMCU",
    shortLabel: "ESP8266",
    category: "control",
    position: [-4, -4.4, 0],
    color: "#C8A8E0",
    shape: "esp8266",
    description:
      "Wi-Fi microcontroller — the brain of the smart socket. Reads voltage & current from sensors, drives the relay, hosts an HTTP server, and exposes /status, /relay, /history endpoints to the Android app.",
    spec: "ESP-12E, 80MHz Tensic LX106, 4MB flash, 11 GPIO, 802.11 b/g/n Wi-Fi",
    role: "Central controller — senses, controls, and communicates.",
  },
  {
    id: "relay",
    name: "5V Relay Module",
    shortLabel: "RLY",
    category: "control",
    position: [-1, -4.4, 0],
    color: "#C8A8E0",
    shape: "relay",
    description:
      "Single-channel opto-isolated relay placed between the regulator output and the USB socket. Under ESP8266 command, it interrupts the 5V rail to switch charging on/off remotely.",
    spec: "5V coil, 10A contacts @ 250VAC, opto-isolated, active-low trigger",
    role: "Switch — opens/closes the 5V rail under app command.",
  },
  {
    id: "router",
    name: "Wi-Fi Router",
    shortLabel: "Router",
    category: "communication",
    position: [3, -4.4, 0],
    color: "#FFB366",
    shape: "router",
    description:
      "Standard 2.4GHz Wi-Fi router. Provides the local network that the ESP8266 joins and over which the Android app communicates with the smart socket.",
    spec: "802.11 b/g/n, 2.4GHz, WPA2-PSK, typical range 10–30m indoor",
    role: "Network bridge — connects ESP8266 to the Android device.",
  },
  {
    id: "phone",
    name: "Android Device (Google Antigravity App)",
    shortLabel: "App",
    category: "communication",
    position: [7, -4.4, 0],
    color: "#7FB3D5",
    shape: "phone",
    description:
      "Android smartphone running the companion app built with Google Antigravity. Displays real-time V/I/P, toggle button, 24h power chart, and scheduling UI. Communicates with ESP8266 over Wi-Fi HTTP/JSON.",
    spec: "Android 8.0+, Kotlin + Jetpack Compose, MVVM, Retrofit + MPAndroidChart",
    role: "User interface — monitors and controls the smart socket.",
  },
];

/**
 * Wire connections between components.
 * Each wire has: from (component id), to (component id), category (color), label
 */
export interface WireSpec {
  from: string;
  to: string;
  category: ComponentCategory;
  label: string;
}

export const WIRES: WireSpec[] = [
  // Power path (12V → 5V)
  { from: "battery",   to: "diode",     category: "power",        label: "12V in" },
  { from: "diode",     to: "regulator", category: "power",        label: "11.3V" },
  { from: "regulator", to: "caps",      category: "power",        label: "5V raw" },
  { from: "caps",      to: "usb",       category: "power",        label: "5V clean" },
  // Sensing taps
  { from: "regulator", to: "acs712",    category: "sensing",      label: "I-sense" },
  { from: "caps",      to: "vdivider",  category: "sensing",      label: "V-sense" },
  // Sensing → ESP8266
  { from: "acs712",    to: "esp8266",   category: "sensing",      label: "ADC1" },
  { from: "vdivider",  to: "esp8266",   category: "sensing",      label: "ADC2" },
  // Control: ESP8266 → relay → USB (relay interrupts 5V line)
  { from: "esp8266",   to: "relay",     category: "control",      label: "GPIO4" },
  { from: "relay",     to: "usb",       category: "control",      label: "5V switched" },
  // Communication: ESP8266 → router → phone
  { from: "esp8266",   to: "router",    category: "communication",label: "Wi-Fi 2.4GHz" },
  { from: "router",    to: "phone",     category: "communication",label: "Wi-Fi 2.4GHz" },
];

export const CATEGORY_COLORS: Record<ComponentCategory, string> = {
  power: "#FF8C42",
  sensing: "#E74C3C",
  control: "#8E44AD",
  communication: "#2980B9",
};

export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  power: "Power Path (12V → 5V)",
  sensing: "Sensing Path (analog feedback)",
  control: "Control Path",
  communication: "Communication Path (Wi-Fi)",
};
