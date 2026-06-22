"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ControlPanel } from "@/components/smart-socket/ControlPanel";
import type { ComponentCategory } from "@/lib/smart-socket-data";

// Three.js requires WebGL — must be loaded client-side only
const Scene = dynamic(
  () => import("@/components/smart-socket/Scene").then((m) => m.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3 text-cyan-300">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-sm">Loading 3D model…</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [isPowered, setIsPowered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* 3D scene fills the whole viewport */}
      <div className="absolute inset-0">
        <Scene
          isPowered={isPowered}
          activeCategory={activeCategory}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>

      {/* Top bar — minimal, fades over scene */}
      <header className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-3">
        <div className="pointer-events-auto rounded-lg border border-slate-700/50 bg-slate-900/70 px-3 py-1.5 backdrop-blur">
          <h1 className="text-sm font-bold tracking-tight sm:text-base">
            Smart USB Power Socket
          </h1>
          <p className="hidden text-[10px] text-slate-400 sm:block">
            3D Working Model · Nile University of Nigeria
          </p>
        </div>

        {/* Live status pill */}
        <div
          className={`pointer-events-auto flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur ${
            isPowered
              ? "border border-green-500/40 bg-green-500/20 text-green-300"
              : "border border-red-500/40 bg-red-500/20 text-red-300"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isPowered ? "animate-pulse bg-green-400" : "bg-red-400"
            }`}
          />
          {isPowered ? "POWERED · 5.09V" : "STANDBY"}
        </div>
      </header>

      {/* Desktop side panel */}
      <aside className="absolute right-0 top-0 z-10 hidden h-full w-[380px] lg:block">
        <ControlPanel
          isPowered={isPowered}
          onTogglePower={() => setIsPowered((p) => !p)}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </aside>

      {/* Mobile slide-up panel toggle */}
      {isMobile && (
        <>
          <button
            onClick={() => setIsMobilePanelOpen((v) => !v)}
            className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-slate-600 bg-slate-900/90 px-4 py-2 text-xs font-bold backdrop-blur"
          >
            {isMobilePanelOpen ? "▼ Close Panel" : "▲ Open Panel"}
          </button>
          {isMobilePanelOpen && (
            <div className="absolute bottom-0 left-0 right-0 z-10 max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-slate-700 bg-slate-950/95 backdrop-blur">
              <ControlPanel
                isPowered={isPowered}
                onTogglePower={() => setIsPowered((p) => !p)}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          )}
        </>
      )}

      {/* Footer hint */}
      <footer className="pointer-events-none absolute bottom-2 left-2 z-10 hidden rounded bg-slate-900/70 px-2 py-1 text-[10px] text-slate-400 backdrop-blur md:block">
        Drag to rotate · Scroll to zoom · Right-click drag to pan · Click a component for details
      </footer>
    </div>
  );
}
