# Camunda 8 Local Development Environment - Docker Setup

## Prerequisites

- **Docker**: Version 20.10.16 or later
- **Docker Compose**: Version 1.27.0 or later
- **Memory**: Allocate at least 8GB RAM to Docker Desktop

Verify installation:
```bash
docker --version
docker compose version
```

## Quick Start

### 1. Download Docker Compose Files

```bash
# Create project directory
mkdir camunda8-local && cd camunda8-local

# Download the latest Docker Compose configuration
curl -L -o docker-compose.zip https://github.com/camunda/camunda-distributions/releases/download/docker-compose-8.8/docker-compose-8.8.zip
unzip docker-compose.zip && rm docker-compose.zip
```

Or download manually from: https://github.com/camunda/camunda-distributions/releases

### 2. Start the Environment

**Core Setup (lightweight):**
```bash
docker compose up -d
```

**Full Setup with Web Modeler (recommended):**
```bash
docker compose -f docker-compose-full.yaml up -d
```

Wait several minutes for all components to initialize. Monitor logs:
```bash
docker compose logs -f
```

### 3. Verify All Services Are Running

```bash
docker compose ps
```

## Configuration Options

| Config File | Components | Use Case |
|-------------|------------|----------|
| `docker-compose.yaml` | Zeebe, Operate, Tasklist, Connectors, Elasticsearch | Quick testing |
| `docker-compose-full.yaml` | All above + Web Modeler, Optimize, Console, Identity, Keycloak | Full development |
| `docker-compose-web-modeler.yaml` | Web Modeler standalone | Browser-based modeling only |

## Access URLs

### Default Credentials
- **Username**: `demo`
- **Password**: `demo`

### Full Stack Components (docker-compose-full.yaml)

| Component | URL | Description |
|-----------|-----|-------------|
| **Web Modeler** | http://localhost:8070 | Browser-based BPMN/DMN modeling |
| **Operate** | http://localhost:8088/operate | Monitor process instances |
| **Tasklist** | http://localhost:8088/tasklist | Work on user tasks |
| **Optimize** | http://localhost:8083 | Process analytics & reports |
| **Console** | http://localhost:8087 | Cluster management |
| **Identity** | http://localhost:8084 | User management |
| **Keycloak Admin** | http://localhost:18080/auth/ | Authentication config |
| **Mailpit** | http://localhost:8075 | Email testing UI |

### API Endpoints

| API | Endpoint |
|-----|----------|
| REST API | http://localhost:8088/v2 |
| gRPC API | localhost:26500 |
| Elasticsearch | http://localhost:9200 |
| Connectors | localhost:8086 |

## Desktop Modeler Configuration

### For Core Setup (No Auth)

1. Open Camunda Desktop Modeler
2. Go to **Deployment** settings
3. Configure:
   - **Cluster endpoint**: `http://localhost:26500`
   - **Authentication**: `None`

### For Full Setup (OAuth)

1. Open Camunda Desktop Modeler
2. Configure:
   - **Cluster endpoint**: `http://localhost:26500`
   - **Authentication**: `OAuth`
   - **OAuth URL**: `http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token`
   - **Client ID**: `zeebe`
   - **Client Secret**: `zecret`

## Connector Secrets

Add secrets in `connector-secrets.txt`:
```
MY_API_KEY=your-secret-value
DATABASE_PASSWORD=another-secret
```

Access in connectors using: `{{secrets.MY_API_KEY}}`

## Common Commands

```bash
# Start full stack
docker compose -f docker-compose-full.yaml up -d

# Stop all services (preserve data)
docker compose -f docker-compose-full.yaml down

# Stop and remove all data
docker compose -f docker-compose-full.yaml down -v

# View logs
docker compose -f docker-compose-full.yaml logs -f

# View specific service logs
docker compose -f docker-compose-full.yaml logs -f web-modeler-webapp

# Restart a specific service
docker compose -f docker-compose-full.yaml restart orchestration

# Check resource usage
docker stats
```

## Troubleshooting

### Services Not Starting

Check if ports are available:
```bash
lsof -i :8088
lsof -i :8070
lsof -i :26500
```

### Memory Issues

Increase Docker memory allocation to at least 8GB in Docker Desktop settings.
Full stack requires more memory than core setup.

### Elasticsearch Errors

If Elasticsearch fails to start:
```bash
# On macOS/Linux, you may need to increase vm.max_map_count
sudo sysctl -w vm.max_map_count=262144
```

### Keycloak Not Ready

Keycloak takes longer to start. Wait 2-3 minutes and check logs:
```bash
docker compose -f docker-compose-full.yaml logs -f keycloak
```

### Web Modeler Issues

If Web Modeler shows connection errors:
```bash
# Restart the modeler services
docker compose -f docker-compose-full.yaml restart web-modeler-webapp web-modeler-restapi
```

### Clean Restart

```bash
docker compose -f docker-compose-full.yaml down -v
docker system prune -f
docker compose -f docker-compose-full.yaml up -d
```

## Current Installation

**Location**: `/Users/guyelisha/NGWorkshopContext/Camunda/camunda8-local`

**Running Configuration**: `docker-compose-full.yaml` (Full Stack with Web Modeler)

**Installed Services**:
- orchestration (Zeebe + Operate + Tasklist)
- elasticsearch
- connectors
- web-modeler-webapp
- web-modeler-restapi
- web-modeler-websockets
- web-modeler-db
- optimize
- console
- identity
- keycloak
- postgres
- mailpit

## Connectors

The full stack includes the **Connectors Bundle** with 40+ pre-built connectors:

### Available Connectors

| Category | Connectors |
|----------|------------|
| **HTTP/REST** | REST Connector, GraphQL, SOAP |
| **Cloud** | AWS Lambda, SNS, SQS, S3, EventBridge, DynamoDB |
| **Google** | Sheets, Drive, Cloud Storage, Gemini AI |
| **Microsoft** | Teams, Azure OpenAI |
| **Messaging** | Slack, SendGrid, RabbitMQ, Kafka |
| **Database** | SQL, MongoDB |
| **AI/ML** | OpenAI, Anthropic, Amazon Bedrock, Hugging Face |
| **Automation** | Automation Anywhere, Blue Prism, UiPath |

### Using Connectors in Web Modeler

1. Open Web Modeler at http://localhost:8070
2. Create or open a BPMN diagram
3. Add a **Service Task** or **Intermediate Event**
4. In the properties panel, click **Select a template**
5. Choose from available connector templates (e.g., REST, Slack, etc.)
6. Configure the connector properties

### Adding Connector Templates

**Upload existing template:**
1. Go to your project in Web Modeler
2. Click **Upload files**
3. Select your `.json` connector template file

**Create new template:**
1. Click **New** → **Connector Template**
2. Define the template JSON in the editor
3. Click **Publish** to make it available

**Publish organization-wide:**
1. Click **Publish** → **Publish to organization**
2. All team members can now use the template

### Connector Secrets

Add secrets to `connector-secrets.txt`:
```
SLACK_TOKEN=xoxb-your-token
OPENAI_API_KEY=sk-your-key
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

Access in connector configuration: `{{secrets.SLACK_TOKEN}}`

After modifying secrets, restart connectors:
```bash
docker compose -f docker-compose-full.yaml restart connectors
```

### Verify Connectors Health

```bash
curl http://localhost:8086/actuator/health
```

## Resources

- [Official Docker Compose Guide](https://docs.camunda.io/docs/self-managed/setup/deploy/local/docker-compose/)
- [Web Modeler Documentation](https://docs.camunda.io/docs/components/modeler/web-modeler/new-web-modeler/)
- [Manage Connector Templates](https://docs.camunda.io/docs/components/connectors/manage-connector-templates/)
- [Connectors Overview](https://docs.camunda.io/docs/components/connectors/introduction-to-connectors/)
- [Camunda 8 Run (Lightweight Alternative)](https://docs.camunda.io/docs/self-managed/quickstart/developer-quickstart/c8run/)
- [Developer Portal](https://developers.camunda.com/install-camunda-8/)
- [Camunda GitHub Repository](https://github.com/camunda/camunda)
