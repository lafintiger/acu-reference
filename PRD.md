# AcuReference — Product Requirements Document (PRD) and Agent Build Prompt (MVP)

**Owner:** You (personal-use to start)
**Version:** 0.2 (MVP)
**Date:** 2025-09-13
**Scope:** Offline-first local web app (initially on macOS), expandable later to Windows & Android. English only. No user accounts. Local data only.

---

## ⚑ Agent Build Prompt (for an Agentic AI Engineer)

**Copy/paste this into your agent system.** Adapt only where bracketed.

> **System / Role**
> You are an expert full‑stack engineer tasked with building an **offline‑first local web application** called **AcuReference**. The app is a personal reference tool for acupressure and related modalities. **Absolute constraints:** offline‑first, English only, no accounts, local data storage, and runs locally on macOS in a browser (installable PWA). Prioritize stability, clarity, and maintainability.
>
> **Primary Objective**
> Deliver a working MVP that:
>
> 1. ships as a local web app (PWA) that works fully offline (Service Worker caching + local database),
> 2. provides a searchable, editable database of **all acupuncture points** (TCM: 12 meridians + 8 extraordinary vessels + extra points + auricular points),
> 3. supports **cross‑links** among points, indications (symptoms), and modalities (acupressure, cupping, gua sha, applied kinesiology), and
> 4. includes a **custom protocol builder** (named protocols composed of points, techniques, herbs, diet, notes).
>
> **Non‑Goals (MVP)**
> No cloud sync, no patient data, no scheduling, no analytics, no iOS build.
>
> **Architecture & Tech (strongly recommended)**
>
> * **Frontend**: React + TypeScript, Vite, Tailwind CSS.
> * **Offline**: PWA + Service Worker (Workbox) for asset & API‑like request caching.
> * **Local DB**: IndexedDB via Dexie **or** SQLite‑WASM (sql.js) when relational queries are useful. Export/Import JSON backups.
> * **Search**: MiniSearch (or FlexSearch) with custom tokenizer + synonyms.
> * **Body Map**: Inline SVG views (front/back/left/right) with clickable hotspots (per‑view coordinates stored in DB).
> * **Packaging**: PWA for MVP. (Electron packaging considered later.)
>
> **Data & Content**
>
> * Create **seedable scaffolds** for points, meridians, indications, modalities, techniques, herbs, diet items.
> * Include **placeholder** images/diagrams (simple SVG pins / silhouettes). Do **not** include copyrighted atlas imagery. All assets must be original or openly licensed (CC0/CC‑BY with attribution fields).
> * Provide **data import/export** (JSON) and CRUD editors for all entities.
>
> **UX Requirements** (see wireframes & PRD below)
>
> * Global search bar; filters (meridian, body region, indication, modality).
> * Two primary navigations: **Body Map** and **List/Search**.
> * Point Detail view with: names, meridian, location text, image, indications, contraindications, **acupressure depth guidance**, related points and modalities.
> * Protocol Builder: Name, ordered steps (point/technique/herb/diet/note), tags, save, duplicate, export.
>
> **Quality Gates**
>
> * App runs offline (airplane mode) with full functionality.
> * Lighthouse PWA score ≥ 90; significant assets cached; DB persists after reload.
> * All CRUD flows covered by integration tests (Playwright).
> * Type‑checked, linted, formatted; CI passes.
> * Seed data loads without errors; search returns relevant results for sample queries (e.g., “headache → LI4, GB20 …”).
>
> **Deliverables**
>
> 1. Source repo with README (setup, run, build, offline test).
> 2. Implemented code matching the PRD sections: data schema, UI routes, editors, body map, search, protocol builder.
> 3. Workbox config + verification steps for offline.
> 4. Minimal seed JSON (e.g., 20 points spanning meridians, 10 indications, 8 techniques, 10 herbs/diet).
> 5. Test suite (unit + Playwright flows).
> 6. License & attribution templates.
>
> **Process**
>
> * Plan → scaffold repo → implement schema → seed data → search → list/detail → editors → protocol builder → body map → offline polish → tests → docs.
> * Make small, verifiable increments; keep code modular; avoid premature Electron packaging.
>
> **Important Policies**
>
> * No network calls at runtime (except local file APIs).
> * No proprietary medical content; cite and attribute any open data used.
> * Keep medical disclaimers visible (reference tool; not a substitute for medical advice).
>
> **Hand‑off**
> Provide build artifacts and a zipped release of the PWA for local hosting.

---

## 1. Overview

AcuReference is a **personal, offline** reference app for acupressure and complementary modalities. Core value: rapid lookup by point, indication, or modality; creation of custom treatment protocols; and an interactive body map.

**Initial User:** Single practitioner (owner).
**Platforms:** macOS (local web/PWA).
**Languages:** English.
**Connectivity:** Offline‑first; no cloud.

### Goals

* Fast, reliable offline access to acupoint knowledge and related modalities.
* Editable local database with export/import for backups.
* Simple protocol creation and retrieval.

### Non‑Goals (MVP)

* Patient records, scheduling, analytics, collaboration, cloud sync, iOS distribution.

---

## 2. Key Use Cases

* **Lookup by symptom**: e.g., “headache” → suggested points (LI4, GB20…), cupping, gua sha, herbs/diet.
* **Lookup by point**: e.g., “LI4” → location, indications, contraindications, acupressure depth guidance, related modalities.
* **Build protocol**: Create “Headache – Tension” protocol with ordered steps (points, techniques, herbs, diet, notes).
* **Browse via body map**: Tap neck zone → see GB20, related indications & modalities.
* **Edit content**: Add a new extra point; update indications; upload/replace images; manage synonyms.

---

## 3. Functional Requirements

### 3.1 Entities (CRUD)

* Meridians, Points, Indications (with synonyms), Modalities, Techniques, Herbs, DietItems, BodyRegions, Protocols, MediaAssets, CrossLinks.
* Import/Export of all entities (JSON). Versioned schema with migration steps.

### 3.2 Search & Filters

* Full‑text across names, codes, indications, notes.
* Filters: meridian, body region, modality, contraindications present/absent.
* Synonym support (e.g., “cephalalgia” → “headache”).
* Result ranking: exact match > field weight > popularity (local usage count).

### 3.3 Cross‑Linking

* From indication → points + techniques + herbs/diet.
* From point → related points + techniques + indications.
* Manual curation UI + automatic suggestions via shared tags/fields.

### 3.4 Protocol Builder

* Create, duplicate, edit, delete.
* Steps: type (point/technique/herb/diet/note), reference id, free‑text notes, sequence index, optional duration.
* Taggable and searchable.
* Export protocol as JSON/Markdown.

### 3.5 Body Map

* Views: front, back, left, right; zoom and pan.
* Points rendered as SVG pins positioned via stored coordinates per view.
* Click → Point Detail.
* Region overlays to filter points by body region.

### 3.6 Editing & Media

* Inline editors with validation (required fields, code formats like “LI4”).
* Image manager with attribution fields and local file storage.
* Support for vector placeholders when no image is provided.

### 3.7 Offline & Storage

* PWA with Service Worker (Workbox): cache shell + data endpoints.
* Local persistence: IndexedDB (Dexie) or SQLite‑WASM.
* Backup/restore: export/import to JSON; optional auto‑backup to a local file path.

### 3.8 Settings

* Toggle medical disclaimer banner.
* Choose storage engine (IndexedDB vs SQLite‑WASM).
* Manage backups and seed resets.

---

## 4. Non‑Functional Requirements

* **Performance:** search < 300ms on 5k items; initial load < 2.5s after first install.
* **Reliability:** data durability across browser reloads and OS restarts.
* **Security:** local‑only; no telemetry; user‑initiated export/import only.
* **Accessibility:** keyboard navigation, ARIA labels, high‑contrast mode.
* **Maintainability:** typed code (TypeScript), modular domain layers, tests.

---

## 5. UX & Navigation (Wireframes)

### 5.1 Global Layout

```
+--------------------------------------------------------------------------------+
| Top Bar:  [AcuReference]   [Search… ....................................]  ⚙ |
+--------------------------------------------------------------------------------+
| Sidebar                 | Main Content                                        |
|-------------------------+-----------------------------------------------------|
| • Home                  | [Header: Results / Context]                         |
| • Body Map              |                                                     |
| • Points                | List or detail depending on route                   |
| • Indications          |                                                     |
| • Modalities           |                                                     |
| • Protocols            |                                                     |
| • Editor               |                                                     |
+--------------------------------------------------------------------------------+
```

### 5.2 Home / Search Results

```
[Search input (focus on load)]   [Filters: Meridian ▾ | Body Region ▾ | Modality ▾]

Results (cards):
┌──────────────────────────────────────────────────────────────────────────────┐
│ LI4 — Hegu (Large Intestine)   Tags: headache, pain relief                   │
│ • Location: dorsum of hand, between 1st & 2nd metacarpals…                   │
│ • Indications: headache, toothache, facial pain…  • Contra: pregnancy        │
│ [View Point] [Add to Protocol] [Related: GB20, Taiyang | Cupping: neck]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Point Detail

```
[LI4 — Hegu]   [Meridian: Large Intestine]   [Add to Protocol]
[Image/SVG]
Location: …
Indications: … | Contraindications: … | Acupressure Depth: …
Related Points: … | Related Modalities: Cupping (upper back), Gua sha (neck)
Notes (editable)
```

### 5.4 Body Map

```
[View: Front ▾]   [Zoom -][100%][+]
+--------------------------- SVG Human Silhouette ---------------------------+
|  • clickable pins (points)                                                |
|  • region overlays (toggle)                                               |
+---------------------------------------------------------------------------+
[Filter: Region ▾]  [Show Labels ☐]
```

### 5.5 Protocol Builder

```
[Protocol Name: ____________________]   [Tags: ________]
Steps (drag to reorder):
1. Point  LI4  [Notes: press 60s each side]
2. Technique  Cupping (upper back) [Notes: medium suction 5 min]
3. Herb      Chrysanthemum tea [Notes: 1 cup]
4. Diet      Avoid greasy foods
[+ Add Step]  [Save]  [Duplicate]  [Export JSON]  [Export Markdown]
```

### 5.6 Editor (Admin)

```
Tabs: [Points] [Indications] [Modalities] [Techniques] [Herbs] [Diet] [Media]
- Grid list with search, create, edit, delete.
- Validation: fields required, code patterns, attribution for images.
- Import JSON | Export JSON | Reset to Seed
```

---

## 6. Data Model & Schema

### 6.1 Entity Relationship (conceptual)

* **Meridian (1–N) Point**
* **Point (N–M) Indication** (via PointIndication)
* **Point (N–M) Technique** (via PointTechnique)
* **Indication (N–M) Technique** (via IndicationTechnique)
* **Protocol (1–N) ProtocolStep** each step references one of: Point | Technique | Herb | DietItem
* **BodyRegion (1–N) PointCoordinate** (per view)
* **MediaAsset (1–N) EntityMedia** (link images to entities)

### 6.2 SQLite‑style DDL (can be mirrored in Dexie/IndexedDB)

```sql
-- Meridians
CREATE TABLE meridians (
  id TEXT PRIMARY KEY,           -- e.g., "LI", "GB"
  name TEXT NOT NULL,            -- "Large Intestine"
  description TEXT
);

-- Points
CREATE TABLE points (
  id TEXT PRIMARY KEY,           -- code like "LI4"
  meridian_id TEXT,              -- FK meridians.id (nullable for extra/auricular)
  name_en TEXT NOT NULL,         -- Hegu
  name_pinyin TEXT,              -- He Gu
  category TEXT,                 -- standard | extra | auricular | extraordinary
  location TEXT NOT NULL,
  indications TEXT,              -- newline or JSON array
  contraindications TEXT,        -- newline or JSON array
  acupressure_depth TEXT,        -- textual guidance (e.g., "firm pressure 30–60s")
  notes TEXT,
  FOREIGN KEY (meridian_id) REFERENCES meridians(id)
);

-- Indications (with synonyms)
CREATE TABLE indications (
  id TEXT PRIMARY KEY,           -- slug: headache
  label TEXT NOT NULL            -- "Headache"
);
CREATE TABLE indication_synonyms (
  id INTEGER PRIMARY KEY,
  indication_id TEXT NOT NULL,
  synonym TEXT NOT NULL,
  FOREIGN KEY (indication_id) REFERENCES indications(id)
);

-- Modalities & Techniques
CREATE TABLE modalities (
  id TEXT PRIMARY KEY,           -- acupressure | cupping | gua_sha | applied_kinesiology
  label TEXT NOT NULL
);
CREATE TABLE techniques (
  id TEXT PRIMARY KEY,           -- e.g., cupping_upper_back
  modality_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cautions TEXT,
  FOREIGN KEY (modality_id) REFERENCES modalities(id)
);

-- Herbs & Diet
CREATE TABLE herbs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  properties TEXT,
  cautions TEXT
);
CREATE TABLE diet_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  guidance TEXT
);

-- Cross-links
CREATE TABLE point_indications (
  point_id TEXT NOT NULL,
  indication_id TEXT NOT NULL,
  PRIMARY KEY (point_id, indication_id)
);
CREATE TABLE point_techniques (
  point_id TEXT NOT NULL,
  technique_id TEXT NOT NULL,
  PRIMARY KEY (point_id, technique_id)
);
CREATE TABLE indication_techniques (
  indication_id TEXT NOT NULL,
  technique_id TEXT NOT NULL,
  PRIMARY KEY (indication_id, technique_id)
);
CREATE TABLE indication_herbs (
  indication_id TEXT NOT NULL,
  herb_id TEXT NOT NULL,
  PRIMARY KEY (indication_id, herb_id)
);
CREATE TABLE indication_diet (
  indication_id TEXT NOT NULL,
  diet_id TEXT NOT NULL,
  PRIMARY KEY (indication_id, diet_id)
);

-- Body Regions and Map Coordinates
CREATE TABLE body_regions (
  id TEXT PRIMARY KEY,           -- neck, hand_dorsum, etc.
  label TEXT NOT NULL
);
CREATE TABLE point_coordinates (
  id INTEGER PRIMARY KEY,
  point_id TEXT NOT NULL,
  view TEXT NOT NULL,            -- front | back | left | right
  x REAL NOT NULL,               -- 0..1 normalized
  y REAL NOT NULL,               -- 0..1 normalized
  region_id TEXT,                -- optional FK to body_regions
  FOREIGN KEY (point_id) REFERENCES points(id),
  FOREIGN KEY (region_id) REFERENCES body_regions(id)
);

-- Media
CREATE TABLE media_assets (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,            -- image | svg | video
  path TEXT NOT NULL,            -- local path or data URL
  title TEXT,
  attribution TEXT,
  license TEXT                   -- e.g., CC0, CC-BY
);
CREATE TABLE entity_media (
  entity_type TEXT NOT NULL,     -- point | technique | region | indication
  entity_id TEXT NOT NULL,
  media_id TEXT NOT NULL,
  PRIMARY KEY (entity_type, entity_id, media_id)
);

-- Protocols
CREATE TABLE protocols (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tags TEXT,
  notes TEXT,
  created_at TEXT,
  updated_at TEXT
);
CREATE TABLE protocol_steps (
  id INTEGER PRIMARY KEY,
  protocol_id TEXT NOT NULL,
  step_index INTEGER NOT NULL,
  step_type TEXT NOT NULL,       -- point | technique | herb | diet | note
  ref_id TEXT,                   -- id of referenced entity (nullable for note)
  details TEXT,                  -- free-text notes or parameters
  duration_seconds INTEGER,
  FOREIGN KEY (protocol_id) REFERENCES protocols(id)
);

-- Settings
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

### 6.3 TypeScript Interfaces (excerpt)

```ts
export type ViewName = 'front' | 'back' | 'left' | 'right';

export interface Meridian { id: string; name: string; description?: string }
export interface Point {
  id: string; // e.g., 'LI4'
  meridianId?: string; nameEn: string; namePinyin?: string;
  category?: 'standard'|'extra'|'auricular'|'extraordinary';
  location: string; indications: string[]; contraindications?: string[];
  acupressureDepth?: string; notes?: string;
}
export interface Indication { id: string; label: string; synonyms?: string[] }
export interface Modality { id: 'acupressure'|'cupping'|'gua_sha'|'applied_kinesiology'; label: string }
export interface Technique { id: string; modalityId: Modality['id']; name: string; description?: string; cautions?: string }
export interface Herb { id: string; name: string; properties?: string; cautions?: string }
export interface DietItem { id: string; name: string; guidance?: string }
export interface BodyRegion { id: string; label: string }
export interface PointCoordinate { id: number; pointId: string; view: ViewName; x: number; y: number; regionId?: string }
export interface MediaAsset { id: string; kind: 'image'|'svg'|'video'; path: string; title?: string; attribution?: string; license?: string }
export interface Protocol { id: string; name: string; tags?: string[]; notes?: string; createdAt: string; updatedAt: string }
export interface ProtocolStep { id: number; protocolId: string; stepIndex: number; stepType: 'point'|'technique'|'herb'|'diet'|'note'; refId?: string; details?: string; durationSeconds?: number }
```

### 6.4 Seed Data Examples (JSON)

```json
{
  "meridians": [ { "id": "LI", "name": "Large Intestine" }, { "id": "GB", "name": "Gall Bladder" } ],
  "points": [
    {
      "id": "LI4",
      "meridianId": "LI",
      "nameEn": "Hegu",
      "namePinyin": "He Gu",
      "category": "standard",
      "location": "On the dorsum of the hand, between the 1st and 2nd metacarpal bones, at the midpoint of the second metacarpal bone on the radial side.",
      "indications": ["headache", "toothache", "facial pain"],
      "contraindications": ["pregnancy"],
      "acupressureDepth": "Firm pressure 30–60 seconds; repeat cycles.",
      "notes": "Commonly paired with GB20 for headache relief."
    },
    {
      "id": "GB20",
      "meridianId": "GB",
      "nameEn": "Fengchi",
      "namePinyin": "Feng Chi",
      "category": "standard",
      "location": "Below the occiput, in the depression between the upper portion of the sternocleidomastoid and trapezius muscles.",
      "indications": ["headache", "neck stiffness"],
      "contraindications": [],
      "acupressureDepth": "Gentle to moderate pressure; avoid excessive force near base of skull.",
      "notes": "Use circular motions."
    }
  ],
  "indications": [ { "id": "headache", "label": "Headache", "synonyms": ["cephalalgia"] } ],
  "modalities": [
    { "id": "acupressure", "label": "Acupressure" },
    { "id": "cupping", "label": "Cupping" },
    { "id": "gua_sha", "label": "Gua sha" },
    { "id": "applied_kinesiology", "label": "Applied Kinesiology" }
  ],
  "techniques": [
    { "id": "cupping_upper_back", "modalityId": "cupping", "name": "Cupping (Upper Back)", "description": "Apply cups to upper back/shoulders for 5–8 minutes.", "cautions": "Avoid broken skin." }
  ],
  "herbs": [ { "id": "chrysanthemum_tea", "name": "Chrysanthemum tea", "properties": "Cooling", "cautions": "Allergies to Asteraceae" } ],
  "dietItems": [ { "id": "avoid_greasy_foods", "name": "Avoid greasy foods" } ],
  "pointIndications": [ { "point_id": "LI4", "indication_id": "headache" }, { "point_id": "GB20", "indication_id": "headache" } ],
  "indicationTechniques": [ { "indication_id": "headache", "technique_id": "cupping_upper_back" } ],
  "indicationHerbs": [ { "indication_id": "headache", "herb_id": "chrysanthemum_tea" } ],
  "indicationDiet": [ { "indication_id": "headache", "diet_id": "avoid_greasy_foods" } ]
}
```

---

## 7. Navigation & Routes (MVP)

* `/` Home (search + results)
* `/points` list; `/points/:id` details
* `/indications` list; `/indications/:id` details
* `/modalities` list; `/techniques/:id` details
* `/protocols` list; `/protocols/:id` editor
* `/body-map` interactive map
* `/editor` admin hub
* `/settings` app settings

---

## 8. Search Design

* **Index fields:** point.id, point.nameEn, pinyin, meridian, indications, contraindications, notes; indication.label/synonyms; technique.name/description.
* **Weights:** exact code>name>indication>notes.
* **Synonyms:** editable list (e.g., headache↔cephalalgia).
* **Result snippets:** highlight matched fields.

---

## 9. Acceptance Criteria (MVP)

1. App installs as a PWA and remains fully functional offline (verified by disabling network).
2. User can create/edit/delete points, indications, techniques, herbs, diet items.
3. Search returns relevant results for seeded data within 300ms.
4. Cross‑links visible from indication → points + techniques; and point → related items.
5. Protocols can be created with at least five steps of mixed types, re‑ordered, saved, and exported to JSON/Markdown.
6. Body map shows at least two views with clickable points (from stored coordinates).

---

## 10. Risks & Mitigations

* **Content workload:** entering all points is time‑intensive → start with core meridians; schedule ongoing data entry; use bulk import CSV→JSON.
* **Imagery licensing:** avoid proprietary atlases → produce original SVG silhouettes; include attribution fields; store licenses.
* **Map accuracy:** coordinates tuning → editor overlay to drag pins and save coordinates.
* **Offline cache invalidation:** version app shell; bump cache keys on releases.

---

## 11. Implementation Plan (Suggested)

1. Repo scaffold (Vite + React + TS + Tailwind) + PWA plugin + Workbox.
2. Data layer (Dexie or sql.js) + schema + migrations + import/export.
3. Seed data loader and admin editors.
4. Search integration (MiniSearch) + index builders.
5. List & detail views (Points, Indications, Techniques).
6. Protocol builder (steps CRUD, reorder, export).
7. Body map (SVG views, pin overlay, coordinate editor).
8. Offline hardening, accessibility passes, tests, docs.

---

## 12. Testing Strategy

* **Unit:** data models, utilities, search ranking.
* **Integration (Playwright):** CRUD flows, search, protocol creation, offline mode.
* **Performance:** index build time, search latency.
* **Accessibility:** axe checks; keyboard navigation.

---

## 13. Repo Structure (proposal)

```
acu-reference/
  README.md
  /public              # icons, manifest, static assets
  /src
    /app               # routing, layout
    /components        # UI components
    /features
      /points
      /indications
      /modalities
      /protocols
      /bodymap
      /editor
    /data              # schema, migrations, seeders, import/export
    /search            # indexers, synonyms
    /styles
    /lib               # utils
  /tests               # unit + e2e
  /scripts             # seed, export
```

---

## 14. Legal & Compliance (MVP)

* Local personal use; no PHI/PII storage.
* Display a disclaimer: informational reference; not medical advice.
* Store asset attributions and license fields; keep a LICENSE file.

---

## 15. Future Roadmap (post‑MVP)

* Electron desktop packaging; Windows/Android releases.
* Cloud sync, user accounts, role‑based access.
* Patient/session tracking with privacy controls.
* Rich media (videos), spaced‑repetition study mode, quizzes.
* More advanced inference: suggested protocols based on selections.
