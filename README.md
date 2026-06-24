# VibeTree 🌳

> Transform goals, ideas, projects, research, and learning journeys into interactive visual knowledge trees.

VibeTree is a modern planning, roadmapping, and knowledge-mapping platform designed to help individuals and teams organize information visually. Instead of managing disconnected notes, tasks, and documents, users build interconnected tree structures that represent goals, projects, learning paths, research topics, and knowledge networks.

Powered by an **ADK Multi-Agent System** and a **Model Context Protocol (MCP) Server**, VibeTree intelligently assists users in planning, organizing, researching, tracking progress, and maintaining structured knowledge.

---

# ✨ Features

## 🌲 Visual Tree-Based Workspace

* Interactive tree creation and editing
* Drag-and-drop node management
* Infinite canvas workspace
* Expandable and collapsible branches
* Custom node types
* Parent-child relationship mapping
* Smart automatic layout generation

## 🎯 Goal & Project Planning

* Goal decomposition into actionable steps
* Project breakdown structures
* Milestone creation and tracking
* Progress visualization
* Task dependency mapping
* Personal and team roadmaps

## 📚 Knowledge Management

* Structured note-taking
* Markdown support
* Research repositories
* Topic linking and cross-references
* Knowledge graph generation
* Documentation management

## 🎓 Learning Roadmaps

* Learning path creation
* Skill-tree generation
* Curriculum planning
* Course and resource organization
* Progress tracking
* Study planning

## 🤝 Collaboration

* Shared workspaces
* Team collaboration
* Activity timeline
* Change history
* Comments and discussions
* Workspace permissions

## 📤 Import & Export

* JSON export/import
* Markdown export
* PDF generation
* Backup and restore
* Workspace migration

---
<img width="1906" height="911" alt="Image" src="https://github.com/user-attachments/assets/f0db54fa-562f-4834-85fd-7347999cdd59" />
# 🏗 Architecture Overview

VibeTree follows a modular architecture built around:

### 1. ADK Multi-Agent System

Specialized AI agents coordinate planning, organization, and automation.

### 2. MCP Server

Provides tool execution, context sharing, search capabilities, and roadmap generation.

### 3. Modern Full-Stack Dashboard

Interactive React application with real-time updates and visual tree rendering.

---

# 🤖 Agent Ecosystem

## Tree Planning Agent

Responsible for:

* Goal decomposition
* Project structure generation
* Branch optimization
* Dependency mapping

## Knowledge Organization Agent

Responsible for:

* Categorization
* Information structuring
* Topic linking
* Knowledge clustering

## Learning Roadmap Agent

Responsible for:

* Curriculum planning
* Skill progression
* Resource recommendations
* Learning milestones

## Goal Tracking Agent

Responsible for:

* Progress monitoring
* Milestone tracking
* Completion analytics
* Performance insights

## Collaboration Agent

Responsible for:

* Shared workspace coordination
* Activity monitoring
* Change management
* Team workflows

## Search & Research Agent

Responsible for:

* Information retrieval
* Research organization
* Resource indexing
* Search optimization

## Workspace Management Agent

Responsible for:

* Workspace creation
* Permission control
* Data management
* System administration

---

# 🔌 MCP Server Responsibilities

The MCP Server acts as the central execution layer and provides:

* Context management
* Tool orchestration
* Search services
* Layout generation
* Tree optimization
* Knowledge indexing
* Activity logging
* Workspace synchronization

---

# 📂 Project Structure

```text
vibetree/
│
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
│
├── docs/
│   ├── architecture.md
│   ├── api_spec.md
│   ├── db_schema.md
│   ├── security.md
│   ├── deployment.md
│   └── workflows.md
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   └── components/
│
├── agents/
│   ├── planner/
│   ├── knowledge/
│   ├── roadmap/
│   ├── tracker/
│   ├── collaboration/
│   ├── research/
│   └── workspace/
│
├── mcp-server/
│   ├── server.ts
│   ├── tools/
│   ├── resources/
│   ├── prompts/
│   └── middleware/
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

---

# 🗄 Database Design

Core entities:

* Users
* Workspaces
* Trees
* Nodes
* Notes
* Roadmaps
* Milestones
* Activities
* Collaborators
* Agent Logs

Database: **PostgreSQL**

Key relationships:

```text
User
 └── Workspace
      └── Tree
           └── Node
                └── Note

Workspace
 └── Collaborators

Tree
 └── Milestones

Workspace
 └── Activity Logs
```

---

# 🔒 Security Features

* JWT Authentication
* Role-Based Access Control (RBAC)
* Input Validation
* Rate Limiting
* Audit Logging
* Secure API Design
* XSS Protection
* CSRF Protection
* Secure Session Management
* Encrypted Environment Variables

---

# 🎨 Dashboard Modules

### Workspace Overview

Quick summary of projects, goals, and activity.

### Tree Explorer

Browse all trees and roadmaps.

### Visual Canvas

Interactive tree rendering and editing.

### Node Editor

Edit content, notes, metadata, and links.

### Notes Panel

Markdown-based note-taking system.

### Progress Dashboard

Track goals, milestones, and completion status.

### Collaboration Center

Manage teams, comments, and workspace sharing.

### Activity Timeline

View all recent changes and events.

---

# 🚀 Getting Started

## Prerequisites

* Node.js 18+
* npm 9+
* PostgreSQL 15+

## Installation

```bash
git clone https://github.com/yourusername/vibetree.git

cd vibetree

npm install
```

## Environment Setup

Create a `.env` file:

```env
DATABASE_URL=
JWT_SECRET=
MCP_SERVER_URL=
```

## Start Development Server

```bash
npm run dev
```

Application runs at:

http://localhost:3000

---

# 🧪 Testing

Run unit tests:

```bash
npm test
```

Run integration tests:

```bash
npm run test:integration
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Lint project:

```bash
npm run lint
```

---

# 🚢 Deployment

## Docker

```bash
docker compose up -d
```

## Production Build

```bash
npm run build
```

Deploy using:

* Vercel
* Netlify
* Railway
* Render
* AWS
* Azure
* DigitalOcean

---

# 🔄 End-to-End Workflow

1. User creates a workspace.
2. User creates a visual tree.
3. Nodes are added to represent goals, ideas, tasks, or knowledge.
4. Agents analyze and organize the structure.
5. Roadmaps and milestones are generated.
6. Team members collaborate and contribute.
7. Progress is tracked automatically.
8. Knowledge grows into a connected visual system.
9. Users export or share completed trees.

---

# 🌟 Vision

VibeTree aims to become the operating system for structured thinking, helping users transform scattered information into organized knowledge, actionable plans, and meaningful progress through visual tree-based workflows.
