# AURA — Menstrual & Hormonal Rhythm Intelligence

> *"Most period apps tell you: 'your period is coming in 4 days.' AURA tells you: 'that might explain why you've been feeling like this.' Less tracking. More understanding yourself."*

AURA is a personalized rhythm tracker that helps women connect sudden changes in mood, appetite, energy, libido, and physical sensations directly to their menstrual cycle and past biological patterns.

---

## 🌸 Product Vision & The Problem

Traditional menstrual tracking apps (Clue, Flo, native calendars) are optimized almost entirely for calendar prediction (*"Period in 3 days"*), leaving symptom interpretation entirely up to the user. When someone experiences a sudden surge in hunger, irritability, fatigue, or heightened libido, standard apps record the data point without connecting the dots.

**AURA changes this by:**
1. **Lightweight 1-Tap Logging**: Capturing daily signals in seconds across 6 core buckets.
2. **Multi-Cycle Pattern Intelligence**: Scanning $\pm 2$ day windows across historical cycles to identify recurring rhythms.
3. **Plain-Language Interpretation**: Explaining the biological *why* behind symptoms (hormonal transitions like progesterone surges, estrogen peaks, prostaglandin shifts).
4. **Body Receipts**: Summarizing verified personal patterns with mathematical recurrence rates.

---

## 🧩 Core Features & Workflow

### 1. Onboarding & Calibration
- Calibrates cycle parameters: last period start date, average cycle length (e.g., 28 days), and period length (e.g., 5 days).
- Comes preloaded with 3 full historical cycles to demonstrate pattern recognition immediately.

### 2. Today Screen & 6 Logging Buckets
Features high-frequency upfront chips with expandable `+ more` trays for lightweight tracking:
- **Mood**: Calm, Irritable, Anxious *(+ Happy, Mellow, Sensitive)*
- **Appetite**: Normal, Extra hungry, Craving *(+ Low appetite)*
- **Libido**: Normal, High / flirty, Low
- **Energy**: Normal, Energetic, Drained *(+ Sleepy)*
- **Body Sensations**: Cramps, Bloated, Headache *(+ Breast tenderness, Body aches)*
- **Period**: Started, Ongoing, Spotting *(+ Ended)*

### 3. Pattern Recognition Engine
- When feelings are logged, AURA checks past cycles within a $\pm 2$ day cycle window.
- Displays plain-language insights:
  - **$\ge 3$ cycles matched**: *"You've felt extra hungry around this time in your last 3 cycles."*
  - **$2$ cycles matched**: *"You also logged these sensations around Cycle Day X in 2 of your past cycles."*
  - **$0$ cycles matched**: *"AURA is still learning your patterns for this cycle window."*

### 4. Body Receipts
- Curated summaries of verified recurring personal patterns (e.g. *The Luteal Appetite Surge*, *Ovulatory Vitality & High Libido*, *Menstrual Rest Window*) with 100% multi-cycle confirmation.

### 5. My Rhythms & 28-Day Heatmap
- Visualizes biological state transitions across the 4 primary phases:
  - **Menstrual (Days 1–5)**: Hormone baseline reset & rest
  - **Follicular (Days 6–12)**: Estrogen rise, stamina, and mental focus
  - **Ovulatory (Days 13–16)**: Estrogen & LH peak, vitality, elevated libido
  - **Luteal (Days 17–28)**: Progesterone peak & decline, metabolic changes, fluid retention

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (with bespoke warm-neutral aesthetic and editorial serif typography)
- **Icons**: Lucide React
- **Animations**: Motion (`motion/react`), canvas-confetti
- **State & Storage**: Browser `localStorage` persistence

### Key Project Files

```
├── src/
│   ├── types.ts                      # Core interfaces (DailyLog, PatternInsight, BodyReceipt, UserProfile)
│   ├── data/
│   │   ├── feelingsData.ts           # 6 buckets and feeling definitions
│   │   └── sampleHistoricalData.ts   # 3-cycle preloaded historical dataset
│   ├── utils/
│   │   └── patternEngine.ts          # Pattern matching, cycle phase math & hormonal insights
│   ├── components/
│   │   ├── Navbar.tsx                # Navigation header and cycle actions
│   │   ├── TodayLogger.tsx           # Daily check-in, chip selectors, cycle bar & live insights
│   │   ├── PatternInsightCard.tsx    # Pattern detection card with biological explanations
│   │   ├── BodyReceiptsView.tsx      # Body receipts cards and recurrence metrics
│   │   ├── MyRhythmsView.tsx         # 28-day interactive heatmap and hormonal dynamics
│   │   ├── CycleHistoryLog.tsx       # Historical timeline and filter search
│   │   └── OnboardingModal.tsx       # Initial calibration and settings modal
│   ├── App.tsx                       # Root application component
│   └── main.tsx                      # Entry point
```

---

## 🚀 Getting Started

### Installation & Development

```bash
# Install dependencies
npm install

# Start Vite dev server on port 3000
npm run dev

# Run TypeScript type check
npm run lint

# Build for production
npm run build
```

---

## 🔒 Privacy & Local-First Philosophy

All cycle dates, sensations, personal notes, and rhythm history remain strictly in client-side storage (`localStorage`) by default, prioritizing user privacy and control.
