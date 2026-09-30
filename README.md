# JanaSetu AI
> **“From Citizen Voice to National Infrastructure Action”**  
> An AI-powered Digital Public Good (DPG) Prototype for Indian Infrastructure Prioritisation.

---

## 1. Problem
Governments across India struggle to consolidate citizen development feedback and align it with national infrastructure priorities. Development requests are fragmented across different systems, grievance portals, paper petitions, and multiple Indian languages (Tamil, Hindi, Telugu, Kannada, Bengali, etc.). This fragmentation causes misaligned public capital expenditure (Capex), unaddressed rural infrastructure deficits, and difficulties measuring the social return on large-scale digital public infrastructure investments.

---

## 2. Solution
**JanaSetu AI** bridges citizen voice directly to national infrastructure intelligence:
- **Multilingual Citizen Input**: Accepts voice, text, and simulated messaging (WhatsApp-style) across 8+ Indian languages without requiring English literacy.
- **Gemini Intelligence Pipeline**: Automatically extracts intent, translates/normalizes to English while preserving original vernacular text, classifies under 15 infrastructure categories, identifies location, and assesses severity.
- **Semantic Clustering**: Aggregates disparate complaints into unified demand hotspots and eliminates duplicate paperwork.
- **National Infrastructure Intelligence Map**: Overlays citizen demand against benchmark infrastructure deficits and existing public capital budgets.
- **Transparent Priority Scoring**: Calculates an explainable decision-support index using transparent weighted formulas with configurable analyst weights.
- **Policy Copilot & Impact Simulator**: Enables decision-makers to ask grounded natural-language queries and simulate social ROI before allocating public funds.

---

## 3. Architecture
```
┌────────────────────────────────────────────────────────┐
│                   Citizen Touchpoints                   │
│   Voice Recording  ·  Text Forms  ·  WhatsApp Chatbot   │
└───────────────────────────┬────────────────────────────┘
                            │ (Vernacular Text / Audio)
                            ▼
┌────────────────────────────────────────────────────────┐
│           Express Backend + Gemini 3.8 Flash           │
│   • Language Detection & Normalisation                 │
│   • 15-Category Classifier & Severity Assessment       │
│   • Semantic Hotspot Clustering & Deduplication        │
│   • Grounded Policy Copilot & Briefing Generator       │
└───────────────────────────┬────────────────────────────┘
                            │ (Structured JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│             National Infrastructure Engine              │
│   • 112 Analysed Districts (Census & Infra Benchmarks) │
│   • GIS Demand & Deficit Gap Layers                    │
│   • Capital Allocation Mismatch Detector               │
│   • Impact Scenario Simulator & Export Dossier         │
└────────────────────────────────────────────────────────┘
```

---

## 4. Gemini Integration
All Gemini calls are executed server-side via the `@google/genai` TypeScript SDK:
- **Model**: `gemini-3.8-flash` for high-throughput, structured multilingual extraction, intent classification, and policy conversational reasoning.
- **API Endpoints**:
  - `POST /api/analyze-request`: Uses structured JSON schemas (`responseSchema`) to extract categories, translated text, severity, and explainable classification reasoning.
  - `POST /api/policy-copilot`: System-instructed to answer strictly from the loaded synthetic district and Capex dataset with zero hallucination.
  - `POST /api/generate-briefing`: Synthesizes 1-page executive advisory briefings for district collectors and state ministries.

---

## 5. End-to-End AI Pipeline
1. **Citizen Input**: Raw vernacular text or voice recording.
2. **Language Detection**: Identifies Tamil, Hindi, Kannada, Telugu, etc.
3. **Translation / Normalisation**: Translates to English while preserving the original citizen voice.
4. **Intent Extraction**: Identifies specific infrastructure needs (e.g. 50-bed PHC, rural concrete bridge).
5. **Category Classification**: Maps to 15 standard sectors (Roads, Healthcare, Water, etc.).
6. **Location Extraction**: Deduces state, district, and village coordinates.
7. **Duplicate Detection & Clustering**: Groups semantic equivalents into demand hotspots.
8. **Severity & Deficit Estimation**: Compares demand against local healthcare bed ratios, road scores, and piped water access.
9. **Priority Score**: Calculates transparent decision-support rating.
10. **Explainable Recommendation**: Generates clear policy briefs with full evidence trails.

---

## 6. Priority Scoring Formula
Priority scores are computed using an open, transparent formula:
$$\text{Priority Index} = 30\% \text{ Demand} + 20\% \text{ Gap} + 15\% \text{ Population} + 15\% \text{ Urgency} + 10\% \text{ Accessibility} + 10\% \text{ Growth}$$

Analysts can adjust weights in real-time via the interactive formula customizer in the **AI Recommendations** view.

> **Disclaimer**: *“AI-generated decision-support score — human review required. Based on demo/synthetic data.”*

---

## 7. Privacy & Responsible AI (DPG Principles)
- **Zero PII**: No citizen names, phone numbers, or national identity IDs are required or stored.
- **Explicit Voice Consent**: Audio streams are transcribed strictly for text extraction and converted to text tokens.
- **Anti-Hallucination Guardrails**: The Policy Copilot is grounded strictly on the loaded dataset and declines to answer when data is insufficient.
- **Feedback & Audit**: Citizens and analysts can flag incorrect AI classifications with one click.

---

## 8. How to Run
```bash
# Install dependencies
npm install

# Start full-stack development server (Vite + Express)
npm run dev

# App runs on port 3000
http://localhost:3000
```

---

## 9. How to Replace Synthetic Data with Real Datasets
1. **Districts & Demographics**: Replace `INDIAN_DISTRICTS` in `src/data/districtsData.ts` with live GeoJSON/API feeds from [data.gov.in](https://data.gov.in) or Census of India tables.
2. **Citizen Grievance Ingestion**: Connect `/api/requests` in `server.ts` to state CPGRAMS APIs, municipal WhatsApp Business Webhooks, or IVR telephony gateways.
3. **Public Investment**: Connect Capex metrics to the Ministry of Finance Public Financial Management System (PFMS) or state treasury APIs.
