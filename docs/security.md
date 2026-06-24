# Security Architecture Specification

VibeTree enforces rigorous security policies across all layers of the system to prevent unauthorized access, ensure data integrity, and provide audit logging for team collaborations.

---

## 1. Authentication & Authorization

### JWT Web Authentication
- All client sessions require a JSON Web Token (JWT) transmitted via the HTTP `Authorization: Bearer <JWT>` header.
- Token signatures are verified using `RS256` or secure environment-defined `JWT_SECRET`.
- Short token lifetimes (e.g., 15 minutes) are enforced alongside secure, HTTP-only, SameSite=Strict refresh tokens.

### Role-Based Access Control (RBAC)
User actions are verified against roles on both the global and workspace levels:

| Role | Workspace Access | Node Mutation | Agent Management | Workspace Settings |
| :--- | :--- | :--- | :--- | :--- |
| **Owner** | Full (Read/Write) | Yes | Yes | Yes |
| **Admin** | Full (Read/Write) | Yes | Yes | No |
| **Member**| Read/Write | Yes | Yes (Run-only) | No |
| **Viewer**| Read-Only | No | No | No |

---

## 2. Input Validation & Safe Execution

### JSON Schema Validation
All REST payloads and MCP tool invocations are filtered through Zod validation schemas. Any properties deviating from the strict schemas are rejected prior to database insertion or agent processing.

Example Zod validation schema for Node Mutation:
```typescript
import { z } from 'zod';

export const NodeUpdateSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'completed', 'blocked']),
  xPos: z.number().finite(),
  yPos: z.number().finite(),
  parentId: z.string().uuid().nullable().optional()
});
```

### Prompt Injection Mitigation & Tool Safeguards
- **Agent Inputs**: String parameters parsed from user-generated canvas titles or nodes are strictly sanitized using alphanumeric whitelists.
- **System Boundaries**: Agents do not write raw system queries. DB commands run only through parameterized Sequelize/Prisma queries.
- **Safe Execution sandbox**: If terminal tasks or scripts are executed, they run inside a lightweight isolated sandbox context.

---

## 3. Rate Limiting & Denial of Service Prevention
- **API Gateway**: Implements Express-Rate-Limit:
  - Standard REST endpoints: Max 100 requests per minute per IP.
  - Agent triggers (roadmap generation): Max 10 executions per minute per user.
- **MCP Server Isolation**: In-memory message queues throttle incoming model requests to protect external LLM APIs from quota depletion.

---

## 4. Audit Logging & Version Tracking
Every state-changing API request produces an immutable entry in the `audit_logs` table containing:
- **Timestamp** (UTC)
- **User Identifier** / Agent Identifier
- **Action String** (e.g., `workspace_share`, `node_reposition`, `agent_roadmap`)
- **Previous Value & New Value** (diff log stored in JSONB structure)
- **Client IP & User-Agent**
- **Security Flag** (marked true if rate limits or RBAC checks were bypassed or triggered warnings)
