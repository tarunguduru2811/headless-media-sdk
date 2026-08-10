# AGENTS.md — Master Technical Specification & Operating Rules

## 🤖 Persona & Role

You are an elite Senior Principal React & React Native Software Engineer specializing in monorepo architecture, SDK design, and headless component systems.
Maintain a productive, concise, and professional tone. Always deliver production-ready, zero-placeholder, strictly typed code (`"strict": true`) that builds and passes all tests across the monorepo.

---

## 🏗️ 4-Tier Monorepo Architecture & Dependency Graph

The project follows a strict 4-tier uni-directional data flow. Dependencies MUST only flow downward toward core contracts or horizontally from the application consumer layer.

```text
[ Tier 1: Core SDK ] (@media-sdk/core)
        │  ▲
        │  │ (Imports Core)
        ▼  │
[ Tier 2: Platform Wrappers ] (@media-sdk/react, @media-sdk/native)
        │
        │                       [ Tier 3: Pure UI Components ] (@media-sdk/ui-react, @media-sdk/ui-native)
        │                                     │
        └───────────────────┬─────────────────┘
                            │ (Imports Wrappers + UI Components)
                            ▼
               [ Tier 4: Consumer Web App ] (apps/web-app)
```

## Architectural Boundary Rules (Zero-Tolerance Enforcement)

### Tier 1: Core SDK (packages/media-core)

    Role: Framework-agnostic Pexels API client, in-memory caching layer, request deduplication, and custom EventEmitter.

    Allowed Imports: Pure TypeScript standard library, Web APIs (fetch, AbortController, Map).

    Forbidden Imports: react, react-dom, react-native, DOM manipulation methods, or any UI styling library.

    Portability Guarantee: Must execute seamlessly in Node.js, Web Browsers, CLI environments, or alternative UI frameworks (Vue/Svelte) without modifications.

### Tier 2: Platform Wrappers (packages/media-react & packages/media-native)

    Role: Adapt media-core into platform-idiomatic state hooks and context providers (MediaProvider, useMediaClient, useMediaEvent).

    Allowed Imports: @media-sdk/core, React (react), React Native (react-native).

    Forbidden Imports: @media-sdk/ui-react, @media-sdk/ui-native, CSS files, Tailwind, or rendered layout markup.

    Layout Guarantee: Contains ZERO JSX elements (<div />, <View />). Contains ZERO styling logic.

### Tier 3: Pure UI Components (packages/media-ui-react & packages/media-ui-native)

    Role: Pure headless UI state management and accessibility engine using the Prop-Getter Pattern (useGrid, useLightbox, useReelSwiper).

    Allowed Imports: React / React Native primitives and standard hooks (useState, useEffect, useCallback, useRef).

    Forbidden Imports: @media-sdk/core, @media-sdk/react, @media-sdk/native, or any Pexels API types.

    Decoupling Guarantee: Components MUST accept primitive data structures and generic callbacks. They MUST remain completely ignorant of Pexels or the Core SDK.

### Tier 4: Consumer App (apps/web-app)

    Role: Composition layer that wires SDK hooks (@media-sdk/react) with headless UI prop-getters (@media-sdk/ui-react) and applies Tailwind CSS styling.

    Allowed Imports: @media-sdk/react, @media-sdk/ui-react, React, Vite, Tailwind CSS.

    Exclusivity: This is the ONLY layer in the monorepo where SDK data and UI components meet.

## 📜 Specific Functional Contracts

### 1. Event Emitter Contract (Tier 1 & Tier 2)

    Payload Interface:
    TypeScript

    export type MediaEventType = 'view' | 'download';

    export interface MediaEventPayload {
    type: MediaEventType;
    mediaId: string | number;
    mediaType: 'photo' | 'video';
    timestamp: number;
    metadata?: Record<string, unknown>;
    }

    Console Logging Guarantee: MediaClient must auto-register a default listener upon instantiation that logs all view and download activity via console.log.

    Hook Cleanup: useMediaEvent in media-react must automatically unsubscribe from event listeners when the calling component unmounts.

### 2. Caching & Request Deduplication Contract (Tier 1)

    Request Deduplication: Simultaneous identical fetch calls (same URL/params) MUST return the same pending Promise rather than dispatching parallel HTTP requests.

    In-Memory Cache: Cache successful response objects key-based on endpoint + query + page with standard in-memory storage (Map).

### 3. Headless UI Hooks Scope & Accessibility Contracts (Tier 3)

    useGrid:

        Returns: getContainerProps (ARIA grid attributes), getItemProps(index) (gridcell roles, focus management), isFetchingMore, hasMore.

        Infinite Scroll: Expose an intersection observer target/callback getter (getLoadMoreTriggerProps).

    useLightbox:

        Returns: getBackdropProps (click-outside handlers), getDialogProps (modal ARIA attributes, tab stop), getCloseButtonProps.

        Accessibility: Must listen for Escape key presses to invoke onClose.

    useReelSwiper:

        Returns: getContainerProps (vertical snap scroll container styling/attributes), getItemProps(index) (item ref tracking), activeIndex.

        Active Item Detection: Must use IntersectionObserver or scroll offset tracking to emit active index updates dynamically as the user scrolls.

### 🛠️ Tech Stack & Workspace Config (npm Only)

    Workspace Engine: npm Workspaces ("workspaces": ["packages/*", "apps/*"]) + Turborepo

    Languages & Runtimes: TypeScript (Strict Mode, "strict": true), Node.js (>=18 LTS)

    Library Bundler: tsup (outputs ESM, CJS, and .d.ts)

    App Bundler: Vite

    Testing: Vitest

## 🚀 Critical Terminal Commands

```
Always execute or verify these exact commands from the monorepo root:

    Install Dependencies: npm install

    Development Server: npm run dev

    Build Monorepo: npm run build

    Run Tests: npm test

    Linting & Formatting: npm run lint

    Clean Build Artifacts: npm run clean
```

## 📐 Monorepo Directory Structure

```
├── packages/
│ ├── media-core/ # Tier 1: Framework-agnostic Pexels API SDK (Zero UI/React)
│ ├── media-react/ # Tier 2: React wrapper (Provider + Hooks)
│ ├── media-native/ # Tier 2: React Native wrapper (Provider + Hooks)
│ ├── media-ui-react/ # Tier 3: Web Headless UI Components (Prop Getters)
│ └── media-ui-native/ # Tier 3: Native Headless UI Components (Prop Getters)
├── apps/
│ ├── web-app/ # Tier 4: Consumer Demo App (Wires react + ui-react)
│ └── docs/ # SDK & Component Documentation
├── .github/
│ └── skills/ # AI Skills (SKILL-WIRING-DATA.md, SKILL-USING-COMPONENTS.md)
├── package.json # Root package.json with npm workspaces
├── turbo.json # Turborepo build pipeline configuration
└── tsconfig.json # Base TypeScript configuration
```

## 📋 Sequential Execution Roadmap

### Execute all work strictly in this sequence:

    Step 1 — Monorepo Configuration: Setup root package.json, turbo.json, tsconfig.json, .gitignore, and package scaffolding.

    Step 2 — Deliverable 1 (media-core): Implement API Client, Caching, Deduplication, EventEmitter, Types, and Vitest suite.

    Step 3 — Deliverable 2 (media-react & media-native): Implement MediaProvider, useMediaClient, and useMediaEvent.

    Step 4 — Deliverable 3 (media-ui-react & media-ui-native): Implement headless prop getters (useGrid, useLightbox, useReelSwiper).

    Step 5 — Deliverable 4 (apps/web-app): Build consumer web app wiring @media-sdk/react data state with @media-sdk/ui-react getters.

    Step 6 — Deliverable 5 (AI Skill Documents): Generate two skill files in .github/skills/:

        SKILL-WIRING-DATA.md: Teaches an AI assistant how to setup providers, invoke hooks, and manage tracking events.

        SKILL-USING-COMPONENTS.md: Teaches an AI assistant how to consume headless prop-getters and apply custom CSS styles.

## 🔍 Self-Verification & Error Correction Protocol

### Before marking any deliverable as complete, the agent MUST run and pass this verification checklist:

    Dependency & Boundary Scan:

        Scan all imports in packages/media-ui-react. Confirm ZERO references to @media-sdk/core or @media-sdk/react.

        Scan all imports in packages/media-core. Confirm ZERO references to react or DOM objects.

    Automated Workspace Build & Test:

        Run npm run build from the workspace root. Confirm TypeScript compilation and bundling pass without errors.

        Run npm test from the workspace root. Confirm all unit tests pass with 100% success rate.

    Failure Recovery Loop:

        If npm run build or npm test fails, inspect the error log, diagnose the root cause, fix the source code, and re-run build commands until output compiles cleanly.
