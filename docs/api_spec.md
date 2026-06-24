# API Specification

The VibeTree backend exposes RESTful endpoints for frontend interactions, authentication, tree management, and agent-driven analysis. All APIs return standard JSON responses and enforce security protocols.

---

## 1. Authentication Endpoints

### Register User
* **POST** `/api/auth/register`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "fullName": "Jane Doe"
  }
  ```
* **Success Response** (`201 Created`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "e305e55e-2b47-4977-84bc-2efb2e4b3e83",
      "email": "user@example.com",
      "fullName": "Jane Doe",
      "role": "user"
    }
  }
  ```

### Login User
* **POST** `/api/auth/login`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Success Response** (`200 OK`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": { ... }
  }
  ```

---

## 2. Workspace & Tree Endpoints

### List Workspaces
* **GET** `/api/workspaces`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response** (`200 OK`):
  ```json
  [
    {
      "id": "w1-uuid",
      "name": "Design Thinking Workspace",
      "isPublic": false,
      "ownerId": "e305e55e-..."
    }
  ]
  ```

### Get Tree Structure
* **GET** `/api/trees/:treeId`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response** (`200 OK`):
  ```json
  {
    "id": "tree-uuid",
    "name": "AI Learning Path",
    "nodes": [
      {
        "id": "node-1",
        "parentId": null,
        "title": "Machine Learning Foundation",
        "type": "goal",
        "status": "in_progress",
        "xPos": 100.0,
        "yPos": 50.0
      }
    ]
  }
  ```

### Update Node Coordinates & Data
* **PUT** `/api/nodes/:nodeId`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
  ```json
  {
    "title": "Supervised Learning",
    "status": "completed",
    "xPos": 120.0,
    "yPos": 150.0,
    "parentId": "node-1"
  }
  ```
* **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "node": { ... }
  }
  ```

---

## 3. ADK Multi-Agent & MCP Triggers

### Auto-Generate Learning Roadmap
* **POST** `/api/agents/generate-roadmap`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
  ```json
  {
    "treeId": "tree-uuid",
    "parentNodeId": "node-1",
    "topic": "Reinforcement Learning"
  }
  ```
* **Success Response** (`200 OK`):
  * Triggers the `LearningRoadmapAgent` to query the `SearchResearchAgent` via the MCP server, generating a set of child nodes.
  ```json
  {
    "status": "success",
    "createdNodes": [
      {
        "id": "node-rl-1",
        "parentId": "node-1",
        "title": "Q-Learning Basics",
        "type": "knowledge",
        "status": "todo"
      }
    ]
  }
  ```

### Analyze Notes for Knowledge Structure
* **POST** `/api/agents/analyze-knowledge`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
  ```json
  {
    "nodeId": "node-rl-1"
  }
  ```
* **Success Response** (`200 OK`):
  * Invokes the `KnowledgeOrganizationAgent` to parse Markdown, suggest relevant tags, and link nodes.
  ```json
  {
    "suggestedTags": ["q-learning", "bellman-equation", "rl-fundamentals"],
    "suggestedLinks": ["node-math-basics-uuid"]
  }
  ```
