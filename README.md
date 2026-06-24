# VibeTree 🌲

VibeTree is an intelligent planning, roadmapping, and knowledge-mapping platform. It organizes goals, projects, research logs, notes, and learning tracks into interactive, visually rich tree configurations.

Powered by an **ADK Multi-Agent System** and a local **Model Context Protocol (MCP) Server**, VibeTree automates the process of researching, drafting learning steps, mapping notes, and tracking deliverables.

![VibeTree Dashboard Mockup](vibetree_dashboard.png)

---

## Key Architectural Highlights
- **VibeTree Dashboard**: Canvas-based interactive workspace displaying trees with collapsible branches, drag-and-drop node organization, markdown notes, real-time collaboration logs, progress widgets, and agent prompts.
- **MCP Server Configuration**: Typescript server executing layout computations, search requests, and roadmap generations.
- **7-Agent Pool (ADK)**: Tree Planning, Knowledge Organization, Learning Roadmap, Goal Tracking, Collaboration, Search & Research, and Workspace Management agents coordinating workflows via message logs.

---

## Folder Organization
```text
vibe/
├── README.md                 # Setup and run commands (This file)
├── package.json              # App settings & React dependency maps
├── tsconfig.json             # TypeScript compiler parameters
├── vite.config.ts            # Vite configuration mapping server to port 3000
├── docs/                     # Comprehensive architectural documentation
│   ├── db_schema.md          # PostgreSQL schemas
│   ├── api_spec.md           # API specification endpoints
│   ├── security.md           # Authentication and audit details
│   ├── architecture.md       # ADK and MCP workflows
│   └── deployment.md         # Docker configurations & GitHub CI/CD workflows
├── src/                      # React Frontend Source Code
│   ├── main.tsx              # React mounting root
│   ├── App.tsx               # Primary dashboard layout
│   ├── index.css             # High-fidelity dark-themed layout styling
│   ├── types/                # Types for nodes, trees, and activities
│   └── components/           # UI Elements (VisualCanvas, NodeEditor, etc.)
├── mcp-server/               # Model Context Protocol code templates
└── agents/                   # Agent logic and orchestrator files
```

---

## Quickstart Setup Guide

### 1. Requirements
Ensure you have the following installed on your machine:
- **Node.js**: v18.x or later
- **npm**: v9.x or later

### 2. Installation
Clone the repository and install the dependencies:
```bash
cd vibe
npm install
```

### 3. Running the Project
To launch the VibeTree frontend dashboard and mock server locally on port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Development Workflow & Testing Strategy

### Code Guidelines
- **Type Safety**: Maintain strict TypeScript interfaces in `src/types/` for all nodes, coordinates, and agent messages.
- **Styling**: Utilize Vanilla CSS variables in `src/index.css` for light/dark theme swapping.

### Testing Strategy
1. **Linting**:
   Ensure code conforms to formatting standards:
   ```bash
   npm run lint --if-present
   ```
2. **Testing Node Layouts**:
   Run unit tests (via Vitest/Jest) on coordinates calculations for rendering balanced branches.
