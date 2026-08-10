# FrameKit (Headless Media SDK)

FrameKit is a highly modular, 4-tier monorepo architecture providing a robust Headless UI Media SDK powered by the Pexels API. Built with scale, accessibility, and modern aesthetics in mind, this project strictly separates API logic, state management, UI accessibility hooks, and the consumer presentation layer.

## 🏗️ 4-Tier Monorepo Architecture

The repository enforces a strict uni-directional dependency flow to ensure maximum decoupling and reusability across platforms (Web & Native).

```text
[ Tier 1: Core SDK ] (@media-sdk/core)
        │
        ▼
[ Tier 2: Platform Wrappers ] (@media-sdk/react, @media-sdk/native)
        │
        │                       [ Tier 3: Pure UI Components ] (@media-sdk/ui-react)
        │                                     │
        └───────────────────┬─────────────────┘
                            │
                            ▼
               [ Tier 4: Consumer Web App ] (apps/web-app)
```

### 1. `packages/media-core`
Framework-agnostic Pexels API client. Handles request deduplication, in-memory caching, and global event emission (`MediaEventEmitter`). Contains zero DOM or React dependencies.

### 2. `packages/media-react`
React integration layer. Provides the `MediaProvider` context and custom hooks (`useMediaClient`, `useMediaEvent`) for lifecycle-aware state management.

### 3. `packages/media-ui-react`
Strictly headless UI component library. Implements complex accessibility and DOM logic (like `IntersectionObserver` infinite scrolling) using the **Prop-Getter Pattern**. Returns zero HTML markup or CSS styling.

### 4. `apps/web-app`
The consumer application demonstrating the SDK. Built with Vite and TailwindCSS. Wires the `@media-sdk/react` data state with the `@media-sdk/ui-react` headless hooks to create a stunning, responsive, glassmorphic UI.

## 🚀 Getting Started

### Prerequisites
- Node.js (>=18 LTS)
- NPM (v10+)
- A free [Pexels API Key](https://www.pexels.com/api/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/headless-media-sdk.git
   cd headless-media-sdk
   ```

2. Install workspace dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file inside `apps/web-app/`:
   ```bash
   VITE_PEXELS_API_KEY=your_api_key_here
   ```

### Development
Start the local development server (Turborepo):
```bash
npm run dev
```

### Build & Deploy
Compile the entire monorepo for production:
```bash
npm run build
```
*Note: This repository is fully configured for deployment on Vercel. See the provided `.gitignore` and `package.json` for Turborepo deployment compliance.*

## 🤖 AI Skill Documentation
For AI coding assistants, specific operating parameters and consumption rules have been defined for this codebase:
- `.github/skills/SKILL-WIRING-DATA.md`: AI instructions for setting up providers and hooks.
- `.github/skills/SKILL-USING-COMPONENTS.md`: AI instructions for unpacking headless UI prop-getters.
- `AGENTS.md`: The master technical specification and zero-tolerance rule enforcement guide.

## 🛠️ Tech Stack
- **Frameworks**: React, React Native (WIP), Vite
- **Styling**: TailwindCSS
- **Tooling**: Turborepo, NPM Workspaces, tsup
- **Language**: TypeScript (`strict: true`)
- **Testing**: Vitest
