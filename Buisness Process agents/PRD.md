# Business Process AI Agents Platform

## Product Requirements Document (PRD)

**Version:** 1.0
**Last Updated:** February 2026

---

## 1. Executive Summary

A low-code/no-code platform enabling small to mid-size companies to rapidly build, deploy, and manage AI agents that operate within predefined business process workflows. The platform combines visual process design (BPMN), modular integration blocks, and intelligent AI agents to automate complex business operations while maintaining human oversight.

### Key Value Propositions

- **Rapid Deployment**: Build and deploy AI-powered business processes in hours, not months
- **No-Code Visual Design**: BPMN-based visual editor accessible to business users
- **Flexible AI Integration**: LLM-powered decision making and content generation within workflows
- **Enterprise-Grade Security**: Role-based access, SSO integration, and credential management
- **Extensible Architecture**: MCP server support and custom integrations

---

## 2. User Management

### 2.1 Authentication Methods

| Method | Description | Phase |
|--------|-------------|-------|
| Email/Password | Standard email registration with secure password (AWS Cognito) | Phase 1 |
| Google OAuth | One-click sign-in with Google accounts (AWS Cognito) | Phase 1 |
| SSO/SAML | Enterprise single sign-on integration | Future |
| Keycloak | Open-source identity management (self-hosted option) | Future |

> **Phase 1 Implementation:** AWS Cognito will handle authentication with Email/Password and Google OAuth. Additional methods (SSO/SAML, Keycloak) will be added in later phases based on enterprise customer requirements.

### 2.2 Organization Structure

```
Organization
├── Workspaces (isolated environments)
│   ├── Groups (team-based access)
│   │   └── Users (individual accounts)
│   └── Roles (permission sets)
```

### 2.3 Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **Owner** | Full access, billing, delete organization |
| **Admin** | Manage users, groups, all resources |
| **Process Designer** | Create/edit processes, manage building blocks |
| **Agent Manager** | Configure agents, view analytics |
| **Operator** | Execute processes, handle human-in-the-loop tasks |
| **Viewer** | Read-only access to dashboards and logs |

### 2.4 User Features

- Profile management with avatar and preferences
- API key generation for programmatic access
- Activity audit logs per user
- Multi-workspace membership
- Notification preferences (email, in-app, webhook)

---

## 3. Building Blocks (Integrations)

Building blocks are reusable connection configurations that enable processes to interact with external services.

### 3.1 Credential Scoping

| Scope | Description | Use Case |
|-------|-------------|----------|
| **Global** | Organization-wide shared credentials | Company email servers, shared APIs |
| **Private** | User-specific credentials | Personal calendar, individual accounts |
| **Mixed** | Global base config + private keys | Shared server URL, individual API keys |

### 3.2 Block Configuration

Each building block supports:
- **Multiple Instances**: Create named variations (e.g., "Customer Service Email", "Support Email", "Sales Email")
- **Environment Variables**: Support for dev/staging/production configurations
- **Health Checks**: Automatic connectivity validation
- **Rate Limiting**: Configurable throttling per integration
- **Retry Policies**: Automatic retry with exponential backoff

### 3.3 Integration Catalog

#### Communication Channels

| Integration | Provider | Capabilities |
|-------------|----------|--------------|
| **WhatsApp Business** | Unipile API | Send/receive messages, media, templates, status updates |
| **Facebook Messenger** | Meta Graph API | Messaging, quick replies, persistent menu |
| **Telegram** | Telegram Bot API | Messages, inline keyboards, file sharing |
| **Slack** | Slack API | Channels, DMs, threads, interactive components |
| **SMS** | Twilio/MessageBird | Outbound SMS, delivery receipts |

#### Email Services

| Integration | Protocol | Capabilities |
|-------------|----------|--------------|
| **SMTP** | SMTP/TLS | Send emails with attachments |
| **Gmail** | Google API | Full inbox access, labels, search |
| **Microsoft 365** | Graph API | Outlook integration, calendar sync |

#### Productivity & Storage

| Integration | Provider | Capabilities |
|-------------|----------|--------------|
| **Google Drive** | Google API | File upload/download, sharing, search |
| **Google Calendar** | Google API | Events, availability, scheduling |
| **Google Chat** | Google API | Spaces, messages, cards |
| **OneDrive** | Microsoft Graph | File operations, sharing |
| **Notion** | Notion API | Pages, databases, blocks |

#### Business Applications

| Integration | Provider | Capabilities |
|-------------|----------|--------------|
| **Shopify** | Shopify API | Orders, products, customers, fulfillment |
| **Salesforce** | Salesforce API | CRM operations, leads, opportunities |
| **HubSpot** | HubSpot API | Contacts, deals, marketing automation |
| **Stripe** | Stripe API | Payments, subscriptions, invoices |
| **Zendesk** | Zendesk API | Tickets, users, satisfaction ratings |

#### Data & AI

| Integration | Provider | Capabilities |
|-------------|----------|--------------|
| **OpenAI** | OpenAI API | GPT models, embeddings, assistants |
| **Anthropic** | Anthropic API | Claude models |
| **Database** | PostgreSQL/MySQL | Query, insert, update operations |
| **Webhook** | HTTP | Outbound HTTP calls with auth |

#### Human-in-the-Loop (Built-in)

| Component | Description |
|-----------|-------------|
| **Task Queue** | Pending tasks dashboard for human review |
| **Approval Workflow** | Approve/reject with comments |
| **Data Entry Forms** | Dynamic forms for data collection |
| **Escalation Rules** | Timeout-based escalation to supervisors |
| **Mobile Support** | Responsive UI for mobile task handling |

### 3.4 Block Properties (Process-Level Configuration)

When a building block is added to a process, it exposes **task properties** that define how that specific instance behaves. These properties are separate from the block's connection credentials.

#### Property Types

| Type           | Description                           | Example                            |
| -------------- | ------------------------------------- | ---------------------------------- |
| **Static**     | Fixed value set at design time        | Subject: "Order Confirmation"      |
| **Variable**   | Reference to process variable         | Recipient: `{{customer.email}}`    |
| **Expression** | Computed value using expressions      | Body: `{{formatDate(order.date)}}` |
| **Template**   | Rich template with multiple variables | Email body with placeholders       |
|                |                                       |                                    |

#### Property Value Sources

```
┌─────────────────────────────────────────────────────────┐
│                    Property Value                        │
├─────────────────────────────────────────────────────────┤
│  1. Process Variables    → {{order.customerEmail}}      │
│  2. Trigger Payload      → {{trigger.data.phone}}       │
│  3. Previous Task Output → {{tasks.lookup.result.id}}   │
│  4. Environment Config   → {{env.SUPPORT_EMAIL}}        │
│  5. Static Value         → "support@company.com"        │
│  6. Expression           → {{amount > 100 ? "VIP" : ""}}│
└─────────────────────────────────────────────────────────┘
```

#### Block Property Examples

**Send Email Block**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `recipient` | email/expression | ✓ | To address(es) |
| `cc` | email/expression | | CC recipients |
| `bcc` | email/expression | | BCC recipients |
| `subject` | string/template | ✓ | Email subject line |
| `body` | template | ✓ | Email body (HTML or plain text) |
| `attachments` | file[]/expression | | Files to attach |
| `replyTo` | email | | Reply-to address |

**Send WhatsApp Block**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `phoneNumber` | string/expression | ✓ | Recipient phone with country code |
| `messageType` | enum | ✓ | text, template, media, interactive |
| `templateName` | string | * | Template ID (if messageType=template) |
| `templateParams` | object | | Template variable values |
| `message` | string/template | * | Message text (if messageType=text) |
| `mediaUrl` | url/expression | * | Media URL (if messageType=media) |

**Create Calendar Event Block**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string/template | ✓ | Event title |
| `startTime` | datetime/expression | ✓ | Event start |
| `endTime` | datetime/expression | ✓ | Event end |
| `attendees` | email[]/expression | | Invite recipients |
| `location` | string | | Event location or meeting link |
| `description` | template | | Event description |
| `reminders` | object[] | | Reminder settings |

**Shopify - Create Order Block**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `customerId` | string/expression | ✓ | Shopify customer ID |
| `lineItems` | object[]/expression | ✓ | Products and quantities |
| `shippingAddress` | object/expression | ✓ | Delivery address |
| `discountCodes` | string[] | | Applied discount codes |
| `notes` | string/template | | Order notes |
| `tags` | string[] | | Order tags |

**Human Task Block**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `taskTitle` | string/template | ✓ | Task title shown to assignee |
| `taskDescription` | template | | Detailed instructions |
| `assignee` | user/group/expression | ✓ | Who should handle this task |
| `formFields` | object[] | | Dynamic form definition |
| `dueDate` | datetime/expression | | Task deadline |
| `escalateTo` | user/group | | Escalation target if overdue |
| `escalateAfter` | duration | | Time before escalation |

**Database Query Block**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `operation` | enum | ✓ | SELECT, INSERT, UPDATE, DELETE |
| `query` | sql/template | ✓ | SQL query with parameters |
| `parameters` | object/expression | | Query parameter values |
| `resultVariable` | string | | Variable to store results |
| `pagination` | object | | Limit and offset |

**Webhook (HTTP Call) Block**
| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `url` | url/template | ✓ | Target URL |
| `method` | enum | ✓ | GET, POST, PUT, PATCH, DELETE |
| `headers` | object/expression | | HTTP headers |
| `body` | object/template | | Request body |
| `authentication` | object | | Auth config (Bearer, Basic, API Key) |
| `timeout` | number | | Request timeout in seconds |
| `retryOn` | number[] | | HTTP status codes to retry |

#### Property Validation

Each property can have validation rules:

```yaml
property:
  name: recipient
  type: email
  required: true
  validation:
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    maxLength: 254
    errorMessage: "Please enter a valid email address"
```

#### Output Properties

Blocks also produce outputs that can be used by subsequent tasks:

**Send Email Output**
| Output | Type | Description |
|--------|------|-------------|
| `messageId` | string | Unique email ID |
| `status` | enum | sent, queued, failed |
| `timestamp` | datetime | Send timestamp |

**Shopify Order Output**
| Output | Type | Description |
|--------|------|-------------|
| `orderId` | string | Created order ID |
| `orderNumber` | string | Human-readable order number |
| `totalPrice` | number | Order total |
| `status` | string | Order status |

---

## 4. Process Designer

### 4.1 Visual Editor

A drag-and-drop BPMN-compliant visual editor for designing business processes.

#### Supported BPMN Elements

| Category | Elements |
|----------|----------|
| **Events** | Start (message, timer, signal), End (terminate, error, message), Intermediate (timer, message, signal) |
| **Activities** | Task, Service Task, User Task, Script Task, Call Activity (subprocess) |
| **Gateways** | Exclusive (XOR), Parallel (AND), Inclusive (OR), Event-based |
| **Artifacts** | Data objects, annotations, groups |
| **Connectors** | Sequence flows, message flows, associations |

### 4.2 Process Structure

```
Process Definition
├── Start Point
│   └── Required Parameters (typed inputs)
├── Flow Elements
│   ├── Tasks (building block executions)
│   ├── Gateways (decision points)
│   ├── Agent Blocks (AI evaluation)
│   └── Subprocesses (nested processes)
└── End Points (1 or more)
    └── Output Parameters
```

### 4.3 Process Features

| Feature | Description |
|---------|-------------|
| **Versioning** | Full version history with diff view |
| **Variables** | Typed process variables with scoping |
| **Error Handling** | Try-catch boundaries, compensation flows |
| **Loops** | Sequential and parallel multi-instance |
| **Conditions** | Expression-based branching (FEEL/JavaScript) |
| **Simulation** | Dry-run mode with mock data |
| **Debugging** | Step-by-step execution with breakpoints |

### 4.4 Subprocess Support

Processes can be embedded as reusable components:
- Call Activity for synchronous subprocess execution
- Independent deployment and versioning
- Parameter mapping (input/output)
- Shared variable context option

---

## 5. Agent Block (AI Decision Node)

A specialized process element that leverages LLMs for intelligent decision-making and content generation.

### 5.1 Agent Block Modes

| Mode | Purpose | Output |
|------|---------|--------|
| **Router** | Evaluate data and select workflow branch | Branch selection + confidence score |
| **Classifier** | Categorize input into predefined classes | Category + reasoning |
| **Extractor** | Extract structured data from unstructured input | JSON schema output |
| **Generator** | Create content (messages, emails, reports) | Formatted text/HTML |
| **Validator** | Check data against business rules | Pass/fail + violations |
| **Summarizer** | Condense information | Summary text |

### 5.2 Configuration Options

```yaml
agent_block:
  name: "Customer Intent Classifier"
  mode: classifier
  model: gpt-4o  # or claude-3-opus
  prompt_template: |
    Analyze the customer message and classify intent.
    Categories: [inquiry, complaint, refund_request, feedback, other]

    Message: {{input.message}}
    Customer History: {{input.customer_history}}

  output_schema:
    intent: string
    confidence: number
    sentiment: string
    suggested_response: string

  fallback_branch: "human_review"
  confidence_threshold: 0.85
  max_tokens: 500
  temperature: 0.3
```

### 5.3 Agent Block Features

- **Prompt Templates**: Variable interpolation with process context
- **Output Schemas**: JSON schema validation for structured outputs
- **Confidence Thresholds**: Route to human review if confidence is low
- **Multi-Model Support**: Switch between LLM providers
- **Token Tracking**: Monitor and limit token usage per execution
- **Caching**: Cache identical requests for cost optimization
- **A/B Testing**: Compare prompt variations

---

## 6. Triggers

Events that initiate process execution.

### 6.1 Trigger Types

| Trigger | Configuration | Use Case |
|---------|---------------|----------|
| **Webhook** | Unique URL per process, signature validation, payload mapping | External system events, API integrations |
| **Incoming Message** | Channel selection, filter rules, sender validation | Customer support, chatbots |
| **Timer - Scheduled** | Cron expression or specific datetime | Reports, batch jobs |
| **Timer - Recurring** | Interval-based (every N hours/days) | Periodic checks, reminders |
| **Manual** | UI button, API call | On-demand execution, testing |
| **Event** | Internal event bus subscription | Process-to-process communication |

### 6.2 Message Triggers

Supported channels for incoming message triggers:
- WhatsApp
- Telegram
- Slack
- Facebook Messenger
- Email (IMAP polling or webhook)
- SMS
- Google Chat
- Custom webhooks

### 6.3 Trigger Features

- **Deduplication**: Prevent duplicate process starts
- **Rate Limiting**: Throttle trigger frequency
- **Filtering**: Conditional trigger activation
- **Transformation**: Payload mapping to process variables
- **Batching**: Aggregate multiple events before triggering

---

## 7. MCP (Model Context Protocol) Integration

### 7.1 MCP Server Management

| Feature | Description |
|---------|-------------|
| **Server Registry** | Connect and manage multiple MCP servers |
| **Tool Discovery** | Auto-discover available tools from connected servers |
| **Authentication** | API key, OAuth, or custom auth per server |
| **Health Monitoring** | Connection status and latency tracking |

### 7.2 MCP Usage

- Expose MCP tools as building blocks in processes
- Use MCP tools within Agent blocks
- Create custom MCP servers for proprietary integrations
- Chain MCP tools with native integrations

---

## 8. Intelligent Agents

### 8.1 Agent Types

| Type | Description | Interface |
|------|-------------|-----------|
| **Internal (Co-pilot)** | Assists internal users with tasks | Chat widget, Slack bot, Teams bot |
| **External (Customer-facing)** | Interacts with customers/partners | WhatsApp, web chat, voice |
| **Hybrid** | Handles both internal and external users | Multi-channel |

### 8.2 Agent Architecture

```
Main Agent
├── System Prompt (personality, constraints, knowledge)
├── Sub-Agents (specialized capabilities)
│   ├── Sales Agent
│   ├── Support Agent
│   └── Technical Agent
├── Tools
│   ├── MCP Tools (external capabilities)
│   └── Process Tools (start/monitor workflows)
└── Context
    ├── User Profile (if authenticated)
    ├── Conversation History
    └── Active Processes
```

### 8.3 Agent Configuration

```yaml
agent:
  name: "Customer Support Agent"
  type: external
  model: claude-3-opus

  system_prompt: |
    You are a helpful customer support agent for {{company_name}}.
    Be professional, empathetic, and solution-oriented.

  sub_agents:
    - name: "Refund Specialist"
      trigger_keywords: ["refund", "money back", "return"]
      prompt: "Handle refund requests according to policy..."

    - name: "Technical Support"
      trigger_keywords: ["bug", "error", "not working"]
      prompt: "Diagnose and resolve technical issues..."

  tools:
    - process: "refund_workflow"
      description: "Initiate refund for customer"
    - process: "escalate_to_human"
      description: "Transfer to human agent"
    - mcp: "crm_lookup"
      description: "Look up customer information"

  authentication:
    method: phone_otp
    fields:
      - phone_number
```

### 8.4 External Agent Authentication

| Method | Flow |
|--------|------|
| **Phone + OTP** | User provides phone → OTP sent via SMS → User verifies |
| **Email + Password** | Standard email/password login |
| **Email + Magic Link** | Passwordless email verification |
| **Custom Fields** | Business-specific verification (order ID, account number) |
| **OAuth** | Social login (Google, Facebook, Apple) |

### 8.5 Agent Capabilities

| Capability             | Description                       |
| ---------------------- | --------------------------------- |
| **Process Execution**  | Start workflows as tools          |
| **Process Monitoring** | Check status of running processes |
| **Context Awareness**  | Access user profile and history   |
| **Handoff**            | Transfer to human or other agents |
| **Memory**             | Long-term conversation memory     |
| **Analytics**          | Track resolution rates, CSAT      |

---

## 9. Dashboard & Analytics

### 9.1 Operational Dashboard

- Active process instances
- Task queues (human-in-the-loop)
- Agent conversations
- System health metrics
- Error and exception logs

### 9.2 Analytics & Reporting

| Metric | Description |
|--------|-------------|
| **Process Metrics** | Execution count, duration, success rate |
| **Agent Metrics** | Conversations, resolution rate, handoff rate |
| **Integration Metrics** | API calls, errors, latency |
| **Cost Metrics** | LLM token usage, API costs |

---

## 10. Technical Architecture

### 10.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│  (React/Next.js - Process Designer, Agent Chat, Dashboards)    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                               │
│            (Authentication, Rate Limiting, Routing)              │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Process     │    │    Agent      │    │  Integration  │
│   Engine      │    │   Runtime     │    │   Service     │
│  (BPMN exec)  │    │ (LLM + Tools) │    │  (Adapters)   │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Message Queue (Redis/RabbitMQ)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                    │
│     PostgreSQL (data) │ Redis (cache) │ S3 (files)              │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Technology Stack (Recommended)

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js, React, TailwindCSS, React Flow (BPMN editor) |
| **Backend** | Node.js/NestJS or Python/FastAPI |
| **Process Engine** | Camunda 8 or custom lightweight engine |
| **Database** | PostgreSQL (primary), Redis (cache/queues) |
| **Auth** | AWS Cognito (Phase 1); Keycloak for enterprise/self-hosted (see Appendix C) |
| **Secrets** | OpenBao (see Appendix C) |
| **Messaging** | Redis Streams or RabbitMQ |
| **Storage** | S3-compatible (MinIO for self-hosted) |
| **Deployment** | Kubernetes, Docker Compose (dev) |

---

## 11. Deployment Options

| Option | Description | Target |
|--------|-------------|--------|
| **Cloud (SaaS)** | Fully managed, multi-tenant | SMBs, quick start |
| **Private Cloud** | Single-tenant, managed | Mid-market, compliance |
| **Self-Hosted** | On-premise deployment | Enterprise, air-gapped |

---

## 12. Security & Compliance

### 12.1 Security Features

- End-to-end encryption (TLS 1.3)
- At-rest encryption for credentials (AES-256)
- Secret management integration (OpenBao, Infisical, AWS Secrets Manager)
- Audit logging for all operations
- IP allowlisting
- 2FA for admin accounts

### 12.2 Compliance

- GDPR-ready (data export, deletion)
- SOC 2 Type II (roadmap)
- Data residency options
- PII handling controls

---

## 13. Roadmap

### Phase 1: Foundation (MVP)
- User management with AWS Cognito (email/password + Google OAuth)
- Basic building blocks (Email, Webhook, Slack)
- Visual process designer (BPMN subset)
- Simple Agent block (router mode)
- Manual and webhook triggers

### Phase 2: Core Platform
- Full RBAC implementation
- Extended integration catalog
- All Agent block modes
- Human-in-the-loop UI
- Timer triggers
- Process analytics

### Phase 3: Advanced Agents
- Multi-agent architecture
- External agent authentication
- MCP integration
- Process-as-tool for agents
- Conversation memory

### Phase 4: Enterprise
- SSO/SAML integration
- Advanced analytics
- Self-hosted deployment
- Custom MCP servers
- White-labeling

---

## 14. Success Metrics

| Metric | Target |
|--------|--------|
| **Time to First Process** | < 30 minutes |
| **Process Design Time** | 80% faster than custom dev |
| **Agent Resolution Rate** | > 70% without handoff |
| **System Uptime** | 99.9% |
| **Customer Satisfaction** | NPS > 50 |

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Building Block** | A reusable integration configuration |
| **Agent Block** | An AI-powered decision node in a process |
| **MCP** | Model Context Protocol - standard for AI tool integration |
| **BPMN** | Business Process Model and Notation |
| **HITL** | Human-in-the-Loop |
| **Subprocess** | A process embedded within another process |

---

## Appendix B: Integration Priority Matrix

| Integration | Business Value | Implementation Effort | Priority |
|-------------|---------------|----------------------|----------|
| Email (SMTP) | High | Low | P0 |
| Webhook | High | Low | P0 |
| WhatsApp | High | Medium | P0 |
| Slack | High | Low | P1 |
| Google Calendar | Medium | Medium | P1 |
| Shopify | High | Medium | P1 |
| Telegram | Medium | Low | P2 |
| Facebook Messenger | Medium | High | P2 |
| Salesforce | High | High | P2 |

---

*Document maintained by Product Team*

---

## Appendix C: Recommended External Tools (Open Source)

This appendix outlines recommended open-source tools for secrets management and authentication that are fully redistributable.

### C.1 Secrets Management

#### Primary Recommendation: OpenBao

| Attribute | Details |
|-----------|---------|
| **License** | MPL 2.0 (fully open source, redistributable) |
| **Governance** | Linux Foundation |
| **Origin** | Community fork of HashiCorp Vault (last MPL version) |

**Core Features (All Open Source):**

| Feature | Description |
|---------|-------------|
| **Secret Storage** | Encrypted key/value storage with versioning |
| **Dynamic Secrets** | On-demand credential generation for AWS, databases, Kubernetes |
| **PKI Engine** | Full X.509 certificate authority for internal TLS |
| **Transit Engine** | Encryption-as-a-Service (encrypt data without storing) |
| **Audit Logging** | Full request/response logging (Splunk, ELK, Loki compatible) |
| **Auth Methods** | LDAP, OIDC, GitHub, AppRole, Kubernetes |
| **RBAC** | Path-based access policies |
| **High Availability** | Raft consensus for clustering |
| **Leasing** | Automatic secret expiration and renewal |

**Architecture:**

```
┌─────────────────────────────────────────────────────────────────┐
│                         OpenBao                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ Secrets  │  │ Dynamic  │  │   PKI    │  │ Transit (Encrypt)│ │
│  │  Engine  │  │ Secrets  │  │  Engine  │  │    as Service    │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Auth    │  │  Audit   │  │ Policies │  │    Leasing &     │ │
│  │ Methods  │  │ Devices  │  │ (RBAC)   │  │    Revocation    │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
│                    ┌────────────────┐                            │
│                    │  Raft Storage  │                            │
│                    └────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

**Deployment:** Docker, Kubernetes Helm chart, binary

**Links:**
- Website: https://openbao.org/
- GitHub: https://github.com/openbao/openbao
- Docs: https://openbao.org/docs/

#### Alternative: Infisical (MIT Core)

| Attribute | Details |
|-----------|---------|
| **License** | MIT (core) + Proprietary (`/ee` directory) |
| **Best For** | Developer-friendly, CI/CD focused teams |

**MIT Licensed Features:**
- Secret storage, syncing, versioning
- Point-in-Time Recovery
- Secret rotation (PostgreSQL, MySQL, AWS IAM)
- Dynamic secrets
- Kubernetes Operator
- GitHub, Vercel, AWS integrations

**Enterprise (Proprietary) Features:**
- ❌ Audit logs
- ❌ SSO/SAML
- ❌ Advanced RBAC
- ❌ Compliance certifications

**Use Infisical when:** Fast setup is priority and you don't need audit logs or SSO.

---

### C.2 Authentication & User Management

#### Option 1: Keycloak (Recommended for Enterprise)

| Attribute | Details |
|-----------|---------|
| **License** | Apache 2.0 |
| **Governance** | Red Hat / CNCF |
| **Best For** | Enterprise SSO, legacy system integration |

**Features:**
- OpenID Connect, OAuth 2.0, SAML 2.0
- LDAP/Active Directory integration
- User federation
- Social login (Google, Facebook, GitHub)
- Fine-grained authorization
- Admin console
- Account management console
- Multi-tenancy (realms)

**Considerations:**
- Resource intensive (~500MB+ RAM)
- Complex configuration
- Best for teams with DevOps expertise

#### Option 2: SuperTokens (Recommended for Simplicity)

| Attribute | Details |
|-----------|---------|
| **License** | Apache 2.0 |
| **Best For** | Fast integration, developer teams |

**Features:**
- Email/password authentication
- Passwordless (magic link, OTP)
- Social login
- Session management
- Multi-factor authentication
- Pre-built UI components
- React, Vue, Angular SDKs
- Unlimited users (self-hosted)

**Considerations:**
- Lighter than Keycloak
- Less enterprise features
- Great developer experience

#### Option 3: Authentik

| Attribute | Details |
|-----------|---------|
| **License** | MIT |
| **Best For** | Full control, privacy-first |

**Features:**
- OIDC, OAuth2, SAML, LDAP provider
- Proxy authentication
- Multi-factor authentication
- User enrollment flows
- Application management
- Audit logging

#### Option 4: Authelia

| Attribute | Details |
|-----------|---------|
| **License** | Apache 2.0 |
| **Best For** | Lightweight, reverse proxy auth |

**Features:**
- <30MB RAM footprint
- SSO for reverse proxies (Nginx, Traefik)
- 2FA (TOTP, WebAuthn)
- Password reset flows
- Access control rules

---

### C.3 Comparison Matrix

#### Secrets Management

| Feature | OpenBao | Infisical MIT | HashiCorp Vault |
|---------|---------|---------------|-----------------|
| **License** | MPL 2.0 ✅ | MIT ✅ | BSL ❌ |
| **Redistributable** | Yes | Yes (core only) | No |
| **Dynamic Secrets** | ✅ | ✅ | ✅ |
| **PKI/Certificates** | ✅ | ❌ | ✅ |
| **Encryption Service** | ✅ | ❌ | ✅ |
| **Audit Logging** | ✅ | ❌ (enterprise) | ✅ |
| **SSO Integration** | ✅ | ❌ (enterprise) | ✅ |
| **Setup Complexity** | High | Low | High |

#### Authentication

| Feature | Keycloak | SuperTokens | Authentik | Authelia |
|---------|----------|-------------|-----------|----------|
| **License** | Apache 2.0 | Apache 2.0 | MIT | Apache 2.0 |
| **OIDC/OAuth2** | ✅ | ✅ | ✅ | ✅ |
| **SAML** | ✅ | ❌ | ✅ | ❌ |
| **LDAP** | ✅ | ❌ | ✅ | ✅ |
| **Pre-built UI** | ✅ | ✅ | ✅ | ✅ |
| **MFA** | ✅ | ✅ | ✅ | ✅ |
| **Resource Usage** | High | Medium | Medium | Low |
| **Setup Complexity** | High | Low | Medium | Low |

---

### C.4 Recommended Stack for This Platform

| Component | Tool | Rationale |
|-----------|------|-----------|
| **Secrets Management** | OpenBao | Full features, no paywall, compliance-ready |
| **Auth (SaaS/Cloud)** | SuperTokens | Fast integration, great DX, unlimited users |
| **Auth (Enterprise)** | Keycloak | SAML/LDAP for enterprise customers |
| **Auth (Lightweight)** | Authelia | Self-hosted option with minimal resources |

**Integration Pattern:**

```
┌─────────────────────────────────────────────────────────────────┐
│                      Platform Services                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────┐         ┌─────────────────────────────────┐   │
│   │  OpenBao    │◄────────│  Building Block Credentials     │   │
│   │  (Secrets)  │         │  API Keys, DB Passwords         │   │
│   └─────────────┘         │  OAuth Tokens, Certificates     │   │
│         │                 └─────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│   ┌─────────────┐         ┌─────────────────────────────────┐   │
│   │ SuperTokens │◄────────│  User Authentication            │   │
│   │ / Keycloak  │         │  Platform Users, SSO            │   │
│   │   (Auth)    │         │  External Agent Auth            │   │
│   └─────────────┘         └─────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**References:**
- OpenBao: https://openbao.org/
- Infisical: https://infisical.com/
- Keycloak: https://www.keycloak.org/
- SuperTokens: https://supertokens.com/
- Authentik: https://goauthentik.io/
- Authelia: https://www.authelia.com/
