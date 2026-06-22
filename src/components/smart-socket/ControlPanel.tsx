"use client";

import { useState } from "react";
import {
  COMPONENTS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  WIRES,
  type ComponentCategory,
  type ComponentSpec,
} from "@/lib/smart-socket-data";

interface Props {
  isPowered: boolean;
  onTogglePower: () => void;
  activeCategory: ComponentCategory | "all";
  onCategoryChange: (c: ComponentCategory | "all") => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function ControlPanel({
  isPowered,
  onTogglePower,
  activeCategory,
  onCategoryChange,
  selectedId,
  onSelect,
}: Props) {
  const [activeTab, setActiveTab] = useState<"description" | "components" | "specs">(
    "description"
  );

  const selected = COMPONENTS.find((c) => c.id === selectedId) || null;

  return (
    <div className="pointer-events-auto flex h-full w-full flex-col gap-3 overflow-y-auto p-4 text-slate-100">
      {/* Header */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-4 backdrop-blur">
        <h1 className="text-lg font-bold tracking-tight">
          Smart USB Power Socket
        </h1>
        <p className="text-xs text-slate-400">
          3D Working Model &middot; Hassan Usman Katsina Polytechnic &middot; Dept. of Electrical Eng.
        </p>
      </div>

      {/* Power toggle */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-4 backdrop-blur">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">System Power</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              isPowered
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {isPowered ? "● ONLINE" : "● OFFLINE"}
          </span>
        </div>
        <button
          onClick={onTogglePower}
          className={`w-full rounded-md py-2 text-sm font-bold transition ${
            isPowered
              ? "bg-red-600 hover:bg-red-500"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          {isPowered ? "TURN OFF SYSTEM" : "TURN ON SYSTEM"}
        </button>
        <p className="mt-2 text-[10px] leading-tight text-slate-400">
          Toggle the system to see animated current flow through the power path
          and data flow through the Wi-Fi communication path.
        </p>
      </div>

      {/* Category filter */}
      <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-4 backdrop-blur">
        <span className="mb-2 block text-sm font-semibold">Signal Paths</span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onCategoryChange("all")}
            className={`rounded px-2 py-1 text-[11px] font-semibold transition ${
              activeCategory === "all"
                ? "bg-slate-100 text-slate-900"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            All Paths
          </button>
          {(["power", "sensing", "control", "communication"] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`rounded px-2 py-1 text-[11px] font-semibold transition ${
                  activeCategory === cat
                    ? "text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                style={
                  activeCategory === cat
                    ? { background: CATEGORY_COLORS[cat] }
                    : undefined
                }
              >
                {CATEGORY_LABELS[cat].split(" ")[0]}
              </button>
            )
          )}
        </div>
        {activeCategory !== "all" && (
          <p className="mt-2 text-[10px] leading-tight text-slate-400">
            Showing only:{" "}
            <span style={{ color: CATEGORY_COLORS[activeCategory] }}>
              {CATEGORY_LABELS[activeCategory]}
            </span>
            . Other paths are dimmed.
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex-1 rounded-lg border border-slate-700 bg-slate-900/80 backdrop-blur">
        <div className="flex border-b border-slate-700">
          {(["description", "components", "specs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wide transition ${
                activeTab === tab
                  ? "border-b-2 border-cyan-400 text-cyan-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "description"
                ? "How it Works"
                : tab === "components"
                ? "Components"
                : "Specs"}
            </button>
          ))}
        </div>

        <div className="max-h-[calc(100vh-22rem)] overflow-y-auto p-4 text-xs leading-relaxed">
          {activeTab === "description" && <WorkingDescription isPowered={isPowered} />}
          {activeTab === "components" && (
            <ComponentList
              components={COMPONENTS}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          )}
          {activeTab === "specs" && (
            <SpecsView selected={selected} />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Working description ----------

function WorkingDescription({ isPowered }: { isPowered: boolean }) {
  return (
    <div className="space-y-3 text-slate-300">
      <section>
        <h3 className="mb-1 font-bold text-cyan-300">Overview</h3>
        <p>
          This 3D model visualises a <strong>Smart USB Power Socket</strong> that
          converts a 12V automotive battery supply into a stable 5V USB output,
          and adds Wi-Fi remote monitoring and control via an Android app
          developed using Google Antigravity.
        </p>
      </section>

      <section>
        <h3 className="mb-1 font-bold text-orange-300">
          Power Path (12V → 5V)
        </h3>
        <p>
          Current flows from the <strong>12V battery</strong> through a{" "}
          <strong>1N4007 diode</strong> (reverse-polarity protection, drops ~0.7V)
          into the <strong>LM317 regulator</strong>, which uses the R1/R2 divider
          (270Ω / 820Ω) to produce a stable 5.09V output. The output is filtered
          by C1, C2, C3, C4 and clamped by a 5.6V Zener diode before reaching
          the <strong>USB Type-A socket</strong>, where a red LED indicates power
          is present.
        </p>
      </section>

      <section>
        <h3 className="mb-1 font-bold text-red-300">
          Sensing Path (analog feedback)
        </h3>
        <p>
          An <strong>ACS712 hall-effect sensor</strong> measures load current
          (66mV/A, ±5A range) and a <strong>10:1 voltage divider</strong> scales
          the 5V output down to 0.5V for the ESP8266 ADC. The ESP8266 samples both
          at 10 Hz and computes instantaneous power as V × I.
        </p>
      </section>

      <section>
        <h3 className="mb-1 font-bold text-purple-300">Control Path</h3>
        <p>
          The <strong>ESP8266 NodeMCU</strong> is the system brain. It reads
          sensors, drives a <strong>5V relay</strong> (GPIO4, active-low) that
          interrupts the 5V rail to the USB socket, and hosts an HTTP server
          exposing <code className="rounded bg-slate-800 px-1">/status</code>,{" "}
          <code className="rounded bg-slate-800 px-1">/relay</code>,{" "}
          <code className="rounded bg-slate-800 px-1">/history</code>, and{" "}
          <code className="rounded bg-slate-800 px-1">/schedules</code> JSON
          endpoints.
        </p>
      </section>

      <section>
        <h3 className="mb-1 font-bold text-blue-300">
          Communication Path (Wi-Fi)
        </h3>
        <p>
          The ESP8266 joins the local 2.4GHz Wi-Fi network hosted by a{" "}
          <strong>Wi-Fi router</strong>. The <strong>Android app</strong> (built
          with Google Antigravity using Kotlin + Jetpack Compose + MVVM) polls
          the ESP8266 every 2 seconds to display voltage, current, and power,
          toggle the relay, render a 24h power chart (MPAndroidChart), and
          schedule ON/OFF times.
        </p>
      </section>

      <section className="rounded-md border border-cyan-500/30 bg-cyan-500/10 p-2.5">
        <p className="text-[11px] leading-snug text-cyan-100">
          <strong>👉 Try it:</strong> Click{" "}
          <strong>{isPowered ? "TURN OFF SYSTEM" : "TURN ON SYSTEM"}</strong>{" "}
          above to see animated current/data flow. Click any component in the 3D
          scene or in the Components tab to see its full specification. Use the
          Signal Paths buttons to isolate one path.
        </p>
      </section>

      <section>
        <h3 className="mb-1 font-bold text-slate-200">Key Specifications</h3>
        <ul className="list-disc space-y-0.5 pl-4">
          <li>Input: 12V DC (cigar-lighter plug or 12V/2A adapter)</li>
          <li>Output: 5V DC, 1.2A max (USB 2.0 BC 1.2)</li>
          <li>Regulation: Vout = 1.25 × (1 + R2/R1) = 5.09V</li>
          <li>Connectivity: Wi-Fi 2.4GHz (ESP8266, 802.11 b/g/n)</li>
          <li>App: Android 8.0+, Kotlin + Jetpack Compose</li>
          <li>Current sensing: ACS712, ±5A, 66mV/A</li>
          <li>Control: 5V relay, 10A contacts, opto-isolated</li>
        </ul>
      </section>
    </div>
  );
}

// ---------- Component list ----------

function ComponentList({
  components,
  selectedId,
  onSelect,
}: {
  components: ComponentSpec[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="mb-2 text-[10px] text-slate-400">
        Click a component to view full specs.
      </p>
      {components.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(selectedId === c.id ? null : c.id)}
          className={`w-full rounded-md border px-3 py-2 text-left transition ${
            selectedId === c.id
              ? "border-cyan-400 bg-cyan-500/10"
              : "border-slate-700 bg-slate-800/40 hover:border-slate-500"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: CATEGORY_COLORS[c.category] }}
                />
                <span className="truncate text-xs font-semibold text-slate-100">
                  {c.name}
                </span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight text-slate-400">
                {c.role}
              </p>
            </div>
            <span className="flex-shrink-0 rounded bg-slate-700 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
              {c.shortLabel}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ---------- Specs view ----------

function SpecsView({ selected }: { selected: ComponentSpec | null }) {
  if (!selected) {
    return (
      <div className="text-center text-slate-400">
        <p className="text-xs">
          Select a component from the 3D scene or the Components tab to view its
          full specifications.
        </p>
      </div>
    );
  }

  // Find all wires connected to this component
  const connectedWires = WIRES.filter(
    (w) => w.from === selected.id || w.to === selected.id
  );

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-bold text-cyan-300">{selected.name}</h3>
        <p className="text-[10px] uppercase tracking-wide text-slate-400">
          {CATEGORY_LABELS[selected.category]}
        </p>
      </div>

      <div>
        <h4 className="mb-1 text-[11px] font-bold text-slate-200">Description</h4>
        <p className="text-[11px] leading-relaxed text-slate-300">
          {selected.description}
        </p>
      </div>

      <div>
        <h4 className="mb-1 text-[11px] font-bold text-slate-200">Specification</h4>
        <p className="rounded bg-slate-800/60 p-2 font-mono text-[10px] leading-relaxed text-amber-200">
          {selected.spec}
        </p>
      </div>

      <div>
        <h4 className="mb-1 text-[11px] font-bold text-slate-200">Role in System</h4>
        <p className="text-[11px] leading-relaxed text-slate-300">{selected.role}</p>
      </div>

      <div>
        <h4 className="mb-1 text-[11px] font-bold text-slate-200">
          Connections ({connectedWires.length})
        </h4>
        <div className="space-y-1">
          {connectedWires.map((w, i) => {
            const otherId = w.from === selected.id ? w.to : w.from;
            const other = COMPONENTS.find((c) => c.id === otherId);
            return (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[10px] text-slate-300"
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: CATEGORY_COLORS[w.category] }}
                />
                <span>
                  ↔ {other?.name || otherId}{" "}
                  <span className="text-slate-500">({w.label})</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
