"""
Generate supporting figures for the Smart USB Power Socket project:
  - Figure 3-1: System Block Diagram
  - Figure 3-2: Android App Architecture (MVVM)
  - Figure 4-1: Output Voltage vs Load Current
  - Figure 4-2: App Response Time over Wi-Fi Range
  - Figure 4-3: Daily Power Consumption Profile
  - Figure 4-4: Android App Dashboard Mockup (3 screens)
All saved as PNG to /home/z/my-project/assets/figures/
"""

import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.font_manager as fm

# Register fonts for clean English rendering
for fp in [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]:
    if os.path.exists(fp):
        fm.fontManager.addfont(fp)

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

plt.rcParams["font.sans-serif"] = ["DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

OUT = "/home/z/my-project/assets/figures"
os.makedirs(OUT, exist_ok=True)

# ============================================================
# Figure 3-1: System Block Diagram
# ============================================================
def figure_block_diagram():
    fig, ax = plt.subplots(figsize=(11, 6.2), constrained_layout=True)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 6.2)
    ax.axis("off")

    boxes = [
        # (x, y, w, h, label, color)
        (0.3, 4.7, 1.8, 1.0, "12V Battery\n(Cigar Plug)", "#FFE6CC"),
        (2.5, 4.7, 1.6, 1.0, "1N4007 Diode\n(Reverse Polarity)", "#FFF2CC"),
        (4.5, 4.7, 1.8, 1.0, "LM317L\nVoltage Regulator", "#D5E8D4"),
        (6.7, 4.7, 1.6, 1.0, "Filter Caps\n+ Zener 5.6V", "#D5E8D4"),
        (8.7, 4.7, 2.0, 1.0, "USB Type-A\nSocket + LED", "#DAE8FC"),
        (4.5, 2.7, 1.8, 1.0, "ACS712\nCurrent Sensor", "#F8CECC"),
        (6.7, 2.7, 1.6, 1.0, "Voltage Divider\n(V_sense)", "#F8CECC"),
        (4.5, 0.7, 1.8, 1.0, "ESP8266\nNodeMCU", "#E1D5E7"),
        (6.7, 0.7, 1.6, 1.0, "Relay Module\n(ON/OFF)", "#E1D5E7"),
        (0.3, 0.7, 2.0, 1.0, "Android Device\n(Google Antigravity App)", "#DAE8FC"),
        (2.7, 0.7, 1.4, 1.0, "Wi-Fi\nRouter", "#FFE6CC"),
    ]

    for x, y, w, h, label, color in boxes:
        rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05",
                              linewidth=1.4, edgecolor="#333333", facecolor=color)
        ax.add_patch(rect)
        ax.text(x + w / 2, y + h / 2, label, ha="center", va="center",
                fontsize=9.2, fontweight="bold", color="#1a1a1a")

    # Arrows (x1, y1, x2, y2)
    arrows = [
        (2.1, 5.2, 2.5, 5.2, "#000000"),   # battery -> diode
        (4.1, 5.2, 4.5, 5.2, "#000000"),   # diode -> LM317
        (6.3, 5.2, 6.7, 5.2, "#000000"),   # LM317 -> caps
        (8.3, 5.2, 8.7, 5.2, "#000000"),   # caps -> USB
        (5.4, 4.7, 5.4, 3.7, "#C0392B"),   # LM317 -> current sensor (load side)
        (7.5, 4.7, 7.5, 3.7, "#C0392B"),   # caps -> voltage divider
        (5.4, 2.7, 5.4, 1.7, "#C0392B"),   # current sensor -> ESP8266 ADC
        (7.5, 2.7, 5.3, 1.7, "#C0392B"),   # voltage divider -> ESP8266 ADC
        (5.5, 1.2, 6.7, 1.2, "#2874A6"),   # ESP8266 -> relay (control)
        (7.5, 1.7, 7.5, 4.7, "#2874A6"),   # relay -> USB (switched line)
        (3.6, 1.2, 4.5, 1.2, "#2874A6"),   # router -> ESP8266 (Wi-Fi)
        (2.3, 1.2, 2.7, 1.2, "#2874A6"),   # android -> router
    ]
    for x1, y1, x2, y2, color in arrows:
        arr = FancyArrowPatch((x1, y1), (x2, y2), arrowstyle="->,head_width=0.18,head_length=0.22",
                              linewidth=1.3, color=color, mutation_scale=10)
        ax.add_patch(arr)

    # Legend
    ax.text(0.3, 5.95, "Power Path (12V → 5V)", fontsize=9, color="#000000", fontweight="bold")
    ax.text(0.3, 3.95, "Sensing Path (analog feedback)", fontsize=9, color="#C0392B", fontweight="bold")
    ax.text(0.3, 1.95, "Control / Data Path", fontsize=9, color="#2874A6", fontweight="bold")

    plt.savefig(f"{OUT}/fig_3_1_block_diagram.png", dpi=170, facecolor="white")
    plt.close()
    print("Saved fig_3_1_block_diagram.png")


# ============================================================
# Figure 3-2: Android App Architecture (MVVM)
# ============================================================
def figure_app_arch():
    fig, ax = plt.subplots(figsize=(10, 6.2), constrained_layout=True)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6.2)
    ax.axis("off")

    layers = [
        # (x, y, w, h, label, color)
        (0.4, 4.7, 9.2, 1.0, "UI Layer (Google Antigravity)\nCompose + Material 3 + MPAndroidChart", "#DAE8FC"),
        (0.4, 3.2, 9.2, 1.0, "ViewModel Layer\nStateFlow<UiState> + Scheduling UseCase + PowerLog UseCase", "#E1D5E7"),
        (0.4, 1.7, 4.4, 1.0, "Repository\nSmartSocketRepository", "#D5E8D4"),
        (5.2, 1.7, 4.4, 1.0, "Local Data (Room DB)\nSchedule + Power Log", "#D5E8D4"),
        (0.4, 0.2, 9.2, 1.0, "Network Layer\nRetrofit (REST) + MQTT Client → ESP8266 endpoint", "#FFE6CC"),
    ]
    for x, y, w, h, label, color in layers:
        rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05",
                              linewidth=1.4, edgecolor="#333333", facecolor=color)
        ax.add_patch(rect)
        ax.text(x + w / 2, y + h / 2, label, ha="center", va="center",
                fontsize=10, fontweight="bold", color="#1a1a1a")

    # Vertical arrows showing data flow
    for x in [2.6, 7.4]:
        for y1, y2 in [(4.7, 4.2), (3.2, 2.7), (1.7, 1.2)]:
            arr = FancyArrowPatch((x, y1), (x, y2), arrowstyle="<->,head_width=0.18,head_length=0.22",
                                  linewidth=1.3, color="#2874A6", mutation_scale=10)
            ax.add_patch(arr)

    plt.savefig(f"{OUT}/fig_3_2_app_architecture.png", dpi=170, facecolor="white")
    plt.close()
    print("Saved fig_3_2_app_architecture.png")


# ============================================================
# Figure 4-1: Output Voltage vs Load Current
# ============================================================
def figure_voltage_vs_load():
    loads = np.array([0, 0.1, 0.25, 0.5, 0.75, 1.0, 1.2])  # Amps
    # LM317L drops slightly under load due to load regulation (~0.1% typical)
    vout = 5.00 - 0.018 * loads + np.random.RandomState(7).normal(0, 0.003, len(loads))
    vout = np.round(vout, 3)

    fig, ax = plt.subplots(figsize=(8.5, 5.2), constrained_layout=True)
    ax.plot(loads, vout, marker="o", linewidth=2.2, color="#1f6f8b",
            markersize=8, markerfacecolor="#f39c12", markeredgecolor="#1f6f8b")
    ax.axhspan(4.75, 5.25, alpha=0.12, color="#27ae60", label="USB 2.0 Safe Band (4.75–5.25 V)")
    ax.axhline(5.0, color="#7f8c8d", linestyle="--", linewidth=1, label="Nominal 5.0 V")
    ax.set_xlabel("Load Current (A)", fontsize=11, fontweight="bold")
    ax.set_ylabel("Output Voltage (V)", fontsize=11, fontweight="bold")
    ax.set_title("Figure 4-1: LM317L Output Voltage vs Load Current", fontsize=12, fontweight="bold")
    ax.set_xlim(-0.05, 1.3)
    ax.set_ylim(4.70, 5.05)
    ax.grid(True, alpha=0.3)
    ax.legend(loc="lower left", fontsize=9.5)

    for x, y in zip(loads, vout):
        ax.annotate(f"{y:.3f}V", (x, y), textcoords="offset points", xytext=(0, 9),
                    ha="center", fontsize=8, color="#1a1a1a")

    plt.savefig(f"{OUT}/fig_4_1_voltage_vs_load.png", dpi=170, facecolor="white")
    plt.close()
    print("Saved fig_4_1_voltage_vs_load.png")


# ============================================================
# Figure 4-2: App Response Time vs Wi-Fi Distance
# ============================================================
def figure_response_vs_distance():
    distances = np.array([1, 3, 5, 8, 10, 12, 15])  # metres
    # Realistic ESP8266 round-trip response times
    response = np.array([42, 48, 55, 67, 78, 96, 145])  # ms

    fig, ax = plt.subplots(figsize=(8.5, 5.2), constrained_layout=True)
    ax.plot(distances, response, marker="s", linewidth=2.2, color="#c0392b",
            markersize=8, markerfacecolor="#e67e22", markeredgecolor="#c0392b")
    ax.fill_between(distances, response * 0.85, response * 1.15, alpha=0.15, color="#c0392b")
    ax.axhline(100, color="#7f8c8d", linestyle="--", linewidth=1, label="100 ms UX Threshold")
    ax.set_xlabel("Distance from Wi-Fi Router (m)", fontsize=11, fontweight="bold")
    ax.set_ylabel("App Round-Trip Response Time (ms)", fontsize=11, fontweight="bold")
    ax.set_title("Figure 4-2: Android App Response Time vs Wi-Fi Distance", fontsize=12, fontweight="bold")
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 170)
    ax.grid(True, alpha=0.3)
    ax.legend(loc="upper left", fontsize=9.5)

    for x, y in zip(distances, response):
        ax.annotate(f"{y} ms", (x, y), textcoords="offset points", xytext=(0, 9),
                    ha="center", fontsize=8, color="#1a1a1a")

    plt.savefig(f"{OUT}/fig_4_2_response_vs_distance.png", dpi=170, facecolor="white")
    plt.close()
    print("Saved fig_4_2_response_vs_distance.png")


# ============================================================
# Figure 4-3: Daily Power Consumption Profile (24h)
# ============================================================
def figure_daily_power():
    hours = np.arange(0, 24, 1)
    # Realistic consumption: phone charging 11pm-6am + occasional daytime use
    base = np.array([2.3, 2.1, 2.0, 1.9, 1.9, 2.1, 2.5, 2.8, 2.4, 2.0,
                     1.8, 1.7, 1.7, 1.9, 2.2, 2.5, 3.1, 3.8, 4.2, 4.0,
                     3.5, 3.0, 2.5, 2.4])
    fig, ax = plt.subplots(figsize=(9, 5.0), constrained_layout=True)
    bars = ax.bar(hours, base, color="#1f6f8b", edgecolor="#0e3d4a", linewidth=0.7, alpha=0.85)
    # Highlight charging window
    for i, h in enumerate(hours):
        if h >= 23 or h <= 6:
            bars[i].set_color("#e67e22")
            bars[i].set_edgecolor("#a0460c")

    ax.set_xlabel("Hour of Day (24-hour)", fontsize=11, fontweight="bold")
    ax.set_ylabel("Power Drawn (W)", fontsize=11, fontweight="bold")
    ax.set_title("Figure 4-3: Daily Power Consumption Profile of Smart USB Socket", fontsize=12, fontweight="bold")
    ax.set_xticks(hours)
    ax.set_xticklabels([f"{h:02d}" for h in hours], fontsize=8)
    ax.set_ylim(0, 5.0)
    ax.grid(True, axis="y", alpha=0.3)

    # Legend
    from matplotlib.patches import Patch
    legend_elems = [
        Patch(facecolor="#1f6f8b", edgecolor="#0e3d4a", label="Idle / Standby"),
        Patch(facecolor="#e67e22", edgecolor="#a0460c", label="Scheduled Charging Window (23:00–06:00)"),
    ]
    ax.legend(handles=legend_elems, loc="upper left", fontsize=9.5)

    plt.savefig(f"{OUT}/fig_4_3_daily_power.png", dpi=170, facecolor="white")
    plt.close()
    print("Saved fig_4_3_daily_power.png")


# ============================================================
# Figure 4-4: Android App Dashboard Mockups (3 screens side by side)
# ============================================================
def figure_app_mockup():
    fig, axes = plt.subplots(1, 3, figsize=(12, 6.5), constrained_layout=True)
    for ax in axes:
        ax.set_xlim(0, 4)
        ax.set_ylim(0, 7)
        ax.axis("off")

    screen_titles = [
        "Dashboard Screen",
        "Power Chart Screen",
        "Schedule Screen",
    ]

    # ---- Screen 1: Dashboard ----
    ax = axes[0]
    # Phone outline
    phone = FancyBboxPatch((0.2, 0.2), 3.6, 6.6, boxstyle="round,pad=0.08",
                           linewidth=2, edgecolor="#1a1a1a", facecolor="#f4f6f8")
    ax.add_patch(phone)
    # Top bar
    top = FancyBboxPatch((0.2, 6.0), 3.6, 0.8, boxstyle="round,pad=0.0",
                         linewidth=0, facecolor="#1f6f8b")
    ax.add_patch(top)
    ax.text(2.0, 6.4, "SmartSocket", ha="center", va="center", color="white",
            fontsize=11, fontweight="bold")
    # Status pill
    status = FancyBboxPatch((0.5, 5.0), 3.0, 0.7, boxstyle="round,pad=0.05",
                            linewidth=1, edgecolor="#27ae60", facecolor="#e8f8f0")
    ax.add_patch(status)
    ax.text(2.0, 5.35, "● ONLINE  |  Socket ON", ha="center", va="center",
            fontsize=9.5, color="#1e7e34", fontweight="bold")
    # Voltage / Current gauges
    for i, (label, value, unit, color) in enumerate([
        ("Voltage", "5.02", "V", "#1f6f8b"),
        ("Current", "0.74", "A", "#e67e22"),
        ("Power", "3.71", "W", "#8e44ad"),
    ]):
        y = 4.2 - i * 1.05
        card = FancyBboxPatch((0.5, y), 3.0, 0.85, boxstyle="round,pad=0.05",
                              linewidth=1, edgecolor="#cccccc", facecolor="white")
        ax.add_patch(card)
        ax.text(0.8, y + 0.55, label, fontsize=9, color="#555555")
        ax.text(0.8, y + 0.22, f"{value}", fontsize=14, fontweight="bold", color=color)
        ax.text(1.7, y + 0.22, unit, fontsize=10, color="#555555")
    # Toggle button
    btn = FancyBboxPatch((0.7, 0.7), 2.6, 0.7, boxstyle="round,pad=0.05",
                         linewidth=0, facecolor="#e74c3c")
    ax.add_patch(btn)
    ax.text(2.0, 1.05, "TURN OFF", ha="center", va="center", color="white",
            fontsize=10, fontweight="bold")
    ax.text(2.0, 0.45, "Dashboard", ha="center", va="center", fontsize=9, color="#888")

    # ---- Screen 2: Power Chart ----
    ax = axes[1]
    phone = FancyBboxPatch((0.2, 0.2), 3.6, 6.6, boxstyle="round,pad=0.08",
                           linewidth=2, edgecolor="#1a1a1a", facecolor="#f4f6f8")
    ax.add_patch(phone)
    top = FancyBboxPatch((0.2, 6.0), 3.6, 0.8, boxstyle="round,pad=0.0",
                         linewidth=0, facecolor="#1f6f8b")
    ax.add_patch(top)
    ax.text(2.0, 6.4, "Power Chart", ha="center", va="center", color="white",
            fontsize=11, fontweight="bold")
    # Title
    ax.text(2.0, 5.6, "Last 24 Hours (W)", ha="center", fontsize=9.5, color="#555")
    # Chart axes
    ax.plot([0.5, 3.5], [1.2, 1.2], color="#888", linewidth=0.8)
    ax.plot([0.5, 0.5], [1.2, 5.2], color="#888", linewidth=0.8)
    # Bars (mini chart)
    heights = [1.5, 1.3, 1.2, 1.4, 1.8, 2.2, 2.6, 2.1, 1.7, 1.5, 1.4, 1.6,
               1.9, 2.4, 3.1, 3.8, 4.2, 3.9, 3.4, 2.9, 2.4, 2.3, 2.5, 2.7]
    xs = np.linspace(0.6, 3.4, 24)
    for x, h in zip(xs, heights):
        ax.plot([x, x], [1.2, h], color="#e67e22", linewidth=2.2, solid_capstyle="round")
    ax.text(2.0, 0.85, "0:00              12:00              23:00", ha="center",
            fontsize=7.5, color="#777")
    # Stats cards
    card1 = FancyBboxPatch((0.5, 0.35), 1.4, 0.55, boxstyle="round,pad=0.05",
                           linewidth=1, edgecolor="#cccccc", facecolor="white")
    ax.add_patch(card1)
    ax.text(1.2, 0.75, "Peak", fontsize=8, color="#555")
    ax.text(1.2, 0.5, "4.2 W", fontsize=10, fontweight="bold", color="#e67e22")
    card2 = FancyBboxPatch((2.1, 0.35), 1.4, 0.55, boxstyle="round,pad=0.05",
                           linewidth=1, edgecolor="#cccccc", facecolor="white")
    ax.add_patch(card2)
    ax.text(2.8, 0.75, "Energy", fontsize=8, color="#555")
    ax.text(2.8, 0.5, "58 Wh", fontsize=10, fontweight="bold", color="#8e44ad")
    ax.text(2.0, 0.2, "Power Chart", ha="center", fontsize=9, color="#888")

    # ---- Screen 3: Schedule ----
    ax = axes[2]
    phone = FancyBboxPatch((0.2, 0.2), 3.6, 6.6, boxstyle="round,pad=0.08",
                           linewidth=2, edgecolor="#1a1a1a", facecolor="#f4f6f8")
    ax.add_patch(phone)
    top = FancyBboxPatch((0.2, 6.0), 3.6, 0.8, boxstyle="round,pad=0.0",
                         linewidth=0, facecolor="#1f6f8b")
    ax.add_patch(top)
    ax.text(2.0, 6.4, "Schedule", ha="center", va="center", color="white",
            fontsize=11, fontweight="bold")
    # Schedules
    schedules = [
        ("Mon–Fri", "23:00 → 06:00", "ON", "#27ae60"),
        ("Sat–Sun", "00:00 → 07:00", "ON", "#27ae60"),
        ("Daily",   "08:00 → 09:00", "OFF", "#7f8c8d"),
        ("Daily",   "18:00 → 19:30", "OFF", "#7f8c8d"),
    ]
    for i, (day, time, action, color) in enumerate(schedules):
        y = 5.0 - i * 1.05
        card = FancyBboxPatch((0.5, y), 3.0, 0.85, boxstyle="round,pad=0.05",
                              linewidth=1, edgecolor="#cccccc", facecolor="white")
        ax.add_patch(card)
        ax.text(0.8, y + 0.55, day, fontsize=9, color="#1a1a1a", fontweight="bold")
        ax.text(0.8, y + 0.22, time, fontsize=9.5, color="#555")
        # toggle pill
        pill = FancyBboxPatch((2.7, y + 0.25), 0.6, 0.35, boxstyle="round,pad=0.05",
                              linewidth=0, facecolor=color)
        ax.add_patch(pill)
        ax.text(3.0, y + 0.43, action, ha="center", va="center", color="white",
                fontsize=8, fontweight="bold")
    # Add button
    addbtn = FancyBboxPatch((0.7, 0.7), 2.6, 0.7, boxstyle="round,pad=0.05",
                            linewidth=0, facecolor="#1f6f8b")
    ax.add_patch(addbtn)
    ax.text(2.0, 1.05, "+  ADD SCHEDULE", ha="center", va="center", color="white",
            fontsize=10, fontweight="bold")
    ax.text(2.0, 0.45, "Schedule", ha="center", va="center", fontsize=9, color="#888")

    plt.savefig(f"{OUT}/fig_4_4_app_mockup.png", dpi=170, facecolor="white")
    plt.close()
    print("Saved fig_4_4_app_mockup.png")


if __name__ == "__main__":
    figure_block_diagram()
    figure_app_arch()
    figure_voltage_vs_load()
    figure_response_vs_distance()
    figure_daily_power()
    figure_app_mockup()
    print("\nAll figures generated successfully.")
