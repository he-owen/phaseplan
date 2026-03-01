# ⚡ PhasePlan

Smart energy management for your home. Monitor your devices, optimize electricity costs with time-of-use rates, and reduce your carbon footprint.

---

## ✨ Features

- **AI-Powered Device Enrichment** — Add a device by name; Gemini auto-detects type, wattage, smart capability, and typical run duration
- **Daily Cost Optimization** — Linear programming solver (PuLP/CBC) schedules appliances across 24 hours to minimize electricity cost using real TOU pricing
- **Weekly Smart Scheduling** — Finds the cheapest day of the week to run heavy appliances like washers, dryers, dishwashers, and EV chargers
- **Bill OCR Extraction** — Upload a utility bill image or PDF; Gemini extracts month, year, amount, kWh, and utility provider automatically
- **Utility Rate Integration** — Fetches real rate structures from the OpenEI API by ZIP code with peak/mid-peak/off-peak delivery pricing
- **Carbon Footprint Tracking** — Estimates CO₂ emissions per device with time-varying carbon intensity factors
- **Schedule Feedback Loop** — Confirms whether you followed suggested schedules; tracks compliance rate and cumulative savings over time
- **Multi-Location Support** — Manage devices and rates across multiple addresses
- **Auth0 Authentication** — Secure login with protected routes and automatic user sync

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, React Router 7, MUI 7 (Material UI), MUI X Charts / DataGrid / DatePickers, react-spring |
| **Backend** | Python 3.12, FastAPI, Uvicorn, SQLAlchemy (async), asyncpg, PuLP (LP solver) |
| **AI / ML** | Google Gemini 2.5 Flash (`google-genai`) — device enrichment + bill OCR |
| **Database** | PostgreSQL 16, Prisma (schema management + migrations) |
| **Auth** | Auth0 (`@auth0/auth0-react`) |
| **External APIs** | OpenEI Utility Rates API |
| **Deployment** | Docker Compose (dev), Vercel (frontend), Render (backend + DB) |

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-org/phaseplan.git
cd phaseplan
docker compose up
```

This starts PostgreSQL (port 5432), the FastAPI backend (port 8000), and the Nginx-served frontend (port 5173).
