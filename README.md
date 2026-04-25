# Personal Portfolio — Cristhian Moises Campos Neyra

Personal portfolio website with a dark terminal-style design, CSS animations, interactive project cards and a flip profile card. Built with a **FastAPI backend**, **Supabase** database and **vanilla HTML/CSS/JS** frontend — content managed live without redeployment.

🔗 **[src-blond-xi-85.vercel.app](https://src-blond-xi-85.vercel.app)**

---

## Sections

- **Hero** — introduction, profile flip card (front: photo / back: experience & education), specialty tags
- **Featured Projects** — highlighted projects pinned with ⭐ from the editor
- **My Projects** — filterable by technology category, with image, description and tech badges
- **Contact** — direct links to LinkedIn and WhatsApp

---

## Featured Projects

### proyecto_01 · Industry 4.0 Module
Industrial cell with heterogeneous Edge AI architecture. A Jetson Xavier NX, an Industrial IPC and a Siemens S7-1500 PLC work together to guide a cobot with millimeter-level precision. Biometric authentication, real-time HMI and ResNet-50 running on the TM NPU module inside the PLC cycle.

`Python` `YOLOv8` `ResNet-50` `OpenCV` `Jetson Xavier NX` `IPC Industrial` `TM NPU Siemens` `PLC S7-1500` `TIA Portal` `Universal Robots` `TCP/IP`

### proyecto_02 · Predictive Maintenance Synchronization System
Bidirectional synchronization platform between two CMMS systems. Automatic anomaly detection on industrial sensor time series using a Transformer model. Multi-database integration and automatic work-order generation on detection.

`Python` `Transformer` `PyTorch` `Oracle` `PostgreSQL` `SQL Server` `InfluxDB`

### proyecto_03 · Industrial RAG Agent
Conversational AI agent that answers precise technical questions about Siemens S7-1500 industrial manuals, citing source document and page number for full traceability. Local vectorization for privacy, FAISS in-memory retrieval and Claude 3.5 Haiku as reasoning engine.

`Python` `LangGraph` `LangChain` `Claude 3.5 Haiku` `HuggingFace` `FAISS` `RAG` `Anthropic API`

---

## Site Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5 + CSS3 + JavaScript vanilla |
| Typography | Space Grotesk + JetBrains Mono (Google Fonts) |
| Backend | Python · FastAPI · Uvicorn |
| Database | Supabase (PostgreSQL + Storage for images) |
| Frontend hosting | Vercel — continuous deployment from GitHub |
| Backend hosting | Railway — auto-deploy on push |

---

## Repository Structure

```
LandingPage/
├── frontend/
│   ├── index.html
│   ├── css/styles.css
│   ├── js/app.js          # fetches all data from the API
│   └── images/
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI app + CORS
│   │   ├── config.py      # env vars (Supabase, CORS origins)
│   │   ├── database.py    # Supabase client
│   │   ├── routes/        # projects · skills · uploads
│   │   └── models/        # Pydantic schemas
│   ├── requirements.txt
│   └── Procfile
└── vercel.json            # outputDirectory: frontend
```

---

## Deployment

```
GitHub (main)
   │
   ├── Vercel  → frontend  → https://src-blond-xi-85.vercel.app
   └── Railway → backend   → https://portfolio-backend-production-8442.up.railway.app
```

Both services redeploy automatically on every `git push`.

---

## Local Development

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in Supabase credentials
uvicorn app.main:app --reload
```

**Frontend**
```bash
# Open frontend/index.html with any static server, e.g.:
cd frontend
python -m http.server 5500
```

> For local development, temporarily set `API_URL = 'http://localhost:8000'` in `frontend/js/app.js`.

---

## Environment Variables (Railway)

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/public key |
| `EDITOR_PASSWORD` | Password to unlock the in-site editor |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed frontend domains |

To change the frontend domain, update `ALLOWED_ORIGINS` in the Railway dashboard — no code change needed.

---

## Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Cristhian%20Campos-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/cristhian-moises-campos-neyra-a8bb27257)

---

© 2026 Cristhian Moises Campos Neyra
