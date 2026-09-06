# Product Requirements Document (PRD)
# Apache Camel Integration Platform

**Version:** 1.0
**Date:** 2026-02-17
**Author:** NG Workshop
**Status:** Draft

---

## Executive Summary

Build a comprehensive, open-source integration platform using Apache Camel as the core orchestration engine, providing enterprise-grade connectivity to 300+ systems via pre-built connectors, REST API exposure with OpenAPI support, and cloud-native deployment capabilities.

### Why Apache Camel Over Camunda?

| Aspect | Camunda 8 | Apache Camel |
|--------|-----------|--------------|
| **License** | Proprietary (production license required) | Apache 2.0 (fully free) |
| **Connectors** | ~50 OOTB | **300+ components** |
| **Focus** | BPMN workflow orchestration | **Enterprise Integration Patterns** |
| **OpenAPI** | Via connector templates | **Native REST DSL with contract-first** |
| **Cost** | $$$$ | Free |

---

## 1. Problem Statement

### Current Challenges

1. **Licensing Costs**: Camunda 8 requires commercial license for production use
2. **Limited Connectors**: Camunda provides ~50 connectors vs Camel's 300+
3. **Integration Complexity**: Need unified platform for diverse system integrations
4. **OpenAPI Support**: Require contract-first API development from existing specs
5. **Cloud-Native Requirements**: Need serverless, Kubernetes-native deployment

### Target Users

- **Integration Developers**: Building system-to-system integrations
- **API Developers**: Exposing REST APIs from backend systems
- **DevOps Engineers**: Deploying and managing integration services
- **Business Analysts**: Designing integration flows (via visual tools)

---

## 2. Product Vision

> **"A zero-license-cost integration platform that connects any system to any system, with visual design capabilities and cloud-native deployment."**

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Integration deployment time | < 5 minutes | From code to running |
| Connector coverage | 300+ systems | Available components |
| API generation time | < 1 minute | From OpenAPI spec |
| Resource footprint | < 128MB RAM | Per integration pod |
| Startup time | < 2 seconds | Quarkus native |

---

## 3. Feature Requirements

### 3.1 Core Integration Engine

#### 3.1.1 Apache Camel Runtime

**Priority:** P0 (Must Have)

| Requirement | Description |
|-------------|-------------|
| **Runtime Selection** | Support both Quarkus (recommended) and Spring Boot |
| **Camel Version** | Apache Camel 4.14.x LTS or latest |
| **DSL Support** | YAML, Java, XML route definitions |
| **EIP Support** | Full Enterprise Integration Patterns library |

**Quarkus Benefits:**
- Fast startup (< 2 seconds native)
- Low memory (< 50MB native)
- Native compilation support
- Kubernetes-optimized

#### 3.1.2 Enterprise Integration Patterns

**Priority:** P0 (Must Have)

Support all core EIPs:

| Pattern Category | Patterns |
|------------------|----------|
| **Routing** | Content-Based Router, Message Filter, Recipient List, Splitter, Aggregator |
| **Transformation** | Message Translator, Content Enricher, Content Filter |
| **Messaging** | Message Channel, Pipes and Filters, Message Endpoint |
| **Error Handling** | Dead Letter Channel, Retry, Circuit Breaker |

---

### 3.2 Connector Library

#### 3.2.1 Pre-Built Connectors

**Priority:** P0 (Must Have)

##### Cloud Services

| Provider | Components |
|----------|------------|
| **AWS** | S3, SQS, SNS, Lambda, DynamoDB, Kinesis, EventBridge, Secrets Manager |
| **Azure** | Blob Storage, Service Bus, Event Hubs, Key Vault, CosmosDB |
| **Google Cloud** | Cloud Storage, Pub/Sub, BigQuery, Secrets Manager |

##### Messaging Systems

| System | Component |
|--------|-----------|
| Apache Kafka | `camel-kafka` |
| RabbitMQ | `camel-rabbitmq` |
| ActiveMQ / Artemis | `camel-activemq`, `camel-amqp` |
| IBM MQ | `camel-jms` |
| MQTT | `camel-paho-mqtt5` |

##### Databases

| Database | Component |
|----------|-----------|
| PostgreSQL / MySQL / SQL Server | `camel-jdbc`, `camel-sql` |
| MongoDB | `camel-mongodb` |
| Cassandra | `camel-cassandraql` |
| Redis | `camel-redis` |
| Neo4j | `camel-neo4j` (new in 4.10) |
| Elasticsearch | `camel-elasticsearch` |

##### Enterprise Systems

| System | Component |
|--------|-----------|
| SAP | `camel-sap` (via Red Hat) |
| Salesforce | `camel-salesforce` |
| ServiceNow | `camel-servicenow` |
| LDAP / Active Directory | `camel-ldap` |

##### File & Storage

| Protocol | Component |
|----------|-----------|
| FTP / SFTP / FTPS | `camel-ftp` |
| Local File System | `camel-file` |
| SSH / SCP | `camel-jsch` |
| HDFS | `camel-hdfs` |

##### Protocols

| Protocol | Component |
|----------|-----------|
| HTTP / HTTPS | `camel-http`, `camel-netty-http` |
| REST | `camel-rest`, `camel-platform-http` |
| GraphQL | `camel-graphql` |
| SOAP / Web Services | `camel-cxf`, `camel-soap` |
| gRPC | `camel-grpc` |
| WebSocket | `camel-websocket` |

##### AI/ML (New in 2025)

| Service | Component |
|---------|-----------|
| TensorFlow Serving | `camel-tensorflow-serving` |
| TorchServe | `camel-torchserve` |
| KServe | `camel-kserve` |
| LangChain4j | `camel-langchain4j-*` |

#### 3.2.2 Custom Connector Development

**Priority:** P1 (Should Have)

| Requirement | Description |
|-------------|-------------|
| Connector Template | Starter template for new connectors |
| Documentation | How to build custom components |
| Testing Framework | Unit and integration test support |
| Packaging | Maven archetype for new connectors |

---

### 3.3 REST API & OpenAPI Support

#### 3.3.1 REST DSL

**Priority:** P0 (Must Have)

```yaml
# Example: REST DSL definition
- rest:
    path: /api/v1
    produces: application/json
    consumes: application/json

    get:
      - path: /users/{id}
        to: direct:getUser

    post:
      - path: /users
        to: direct:createUser
```

| Feature | Description |
|---------|-------------|
| HTTP Methods | GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS |
| Path Parameters | `{param}` syntax support |
| Query Parameters | Automatic binding |
| Request Body | JSON/XML binding to POJOs |
| Response Handling | Status codes, headers, body |

#### 3.3.2 OpenAPI Contract-First

**Priority:** P0 (Must Have)

```yaml
# Load routes from OpenAPI spec
- rest:
    openApi:
      specification: openapi/petstore.yaml
```

| Feature | Description |
|---------|-------------|
| OpenAPI 3.x Support | Full OAS 3.0/3.1 specification |
| Route Generation | Auto-generate routes from `operationId` |
| Model Generation | Generate POJOs from schemas |
| Validation | Request validation against spec |
| Documentation | Auto-expose `/openapi.json` endpoint |

#### 3.3.3 API Gateway Features

**Priority:** P1 (Should Have)

| Feature | Description |
|---------|-------------|
| Rate Limiting | Throttle requests per client |
| Authentication | Basic, Bearer, OAuth2, API Key |
| CORS | Cross-origin resource sharing |
| Request/Response Logging | Audit trail |
| Metrics | Prometheus/OpenTelemetry |

---

### 3.4 Visual Design Tools

#### 3.4.1 Apache Camel Karavan

**Priority:** P1 (Should Have)

| Feature | Description |
|---------|-------------|
| VS Code Extension | Local development experience |
| Web UI | Browser-based designer |
| Drag-and-Drop | Visual route composition |
| Code Generation | YAML DSL output |
| Component Palette | All 300+ components |

#### 3.4.2 Kaoto Integration

**Priority:** P2 (Nice to Have)

| Feature | Description |
|---------|-------------|
| Visual Editor | Canvas-based design |
| DataMapper | Visual data transformation |
| Export Options | YAML, XML, Java |
| Template Library | Pre-built integration patterns |

---

### 3.5 Deployment Options

#### 3.5.1 Standalone (Development)

**Priority:** P0 (Must Have)

```bash
# Run locally with Quarkus dev mode
./mvnw quarkus:dev
```

| Feature | Description |
|---------|-------------|
| Hot Reload | Live code changes |
| Dev Services | Auto-start dependencies (Kafka, DB) |
| Dev UI | Camel route visualization |

#### 3.5.2 Docker / Container

**Priority:** P0 (Must Have)

```dockerfile
FROM registry.access.redhat.com/ubi8/openjdk-17:latest
COPY target/quarkus-app /deployments
```

| Feature | Description |
|---------|-------------|
| Multi-stage Build | Optimized images |
| Native Image | GraalVM native compilation |
| Health Checks | Liveness/Readiness probes |
| Resource Limits | CPU/Memory configuration |

#### 3.5.3 Kubernetes / OpenShift

**Priority:** P0 (Must Have)

| Feature | Description |
|---------|-------------|
| Helm Charts | Templated deployments |
| Operators | Camel K operator for auto-deployment |
| ConfigMaps | Externalized configuration |
| Secrets | Secure credential management |
| HPA | Horizontal Pod Autoscaler |

#### 3.5.4 Camel K (Serverless)

**Priority:** P1 (Should Have)

```bash
# Deploy integration directly to Kubernetes
kamel run my-integration.yaml
```

| Feature | Description |
|---------|-------------|
| Zero Infrastructure | No build pipeline needed |
| Scale to Zero | Knative integration |
| Automatic Builds | Operator handles container builds |
| Multi-language | Java, YAML, Groovy, Kotlin |

---

### 3.6 Observability

#### 3.6.1 Health & Metrics

**Priority:** P0 (Must Have)

| Endpoint | Description |
|----------|-------------|
| `/q/health` | Kubernetes health checks |
| `/q/health/live` | Liveness probe |
| `/q/health/ready` | Readiness probe |
| `/q/metrics` | Prometheus metrics |

#### 3.6.2 Tracing & Logging

**Priority:** P1 (Should Have)

| Feature | Description |
|---------|-------------|
| OpenTelemetry | Distributed tracing |
| Jaeger Integration | Trace visualization |
| Structured Logging | JSON log format |
| Correlation IDs | Request tracking |

#### 3.6.3 Route Monitoring

**Priority:** P1 (Should Have)

| Feature | Description |
|---------|-------------|
| Route Statistics | Message counts, processing times |
| Error Tracking | Failed exchanges |
| Inflight Exchanges | Active processing |
| Hawtio Console | Web-based JMX management |

---

## 4. Architecture

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                      │
│   (Web Apps, Mobile Apps, External Services, IoT Devices)           │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │ REST APIs   │  │ GraphQL     │  │ WebSocket   │                 │
│  │ (OpenAPI)   │  │ Endpoints   │  │ Endpoints   │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                      │
│  Features: Authentication, Rate Limiting, CORS, Validation          │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 APACHE CAMEL INTEGRATION LAYER                       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    CAMEL ROUTES                               │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │  │
│  │  │ Route 1 │  │ Route 2 │  │ Route 3 │  │ Route N │         │  │
│  │  │ (EIP)   │  │ (EIP)   │  │ (EIP)   │  │ (EIP)   │         │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    CAMEL COMPONENTS                           │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │  │
│  │  │ HTTP │ │ Kafka│ │ SQL  │ │ S3   │ │ SFTP │ │ SOAP │      │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘      │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │  │
│  │  │ gRPC │ │ AMQP │ │ Mongo│ │ Redis│ │ LDAP │ │ SAP  │      │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘      │  │
│  │                        ... 300+ components                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND SYSTEMS                                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │Databases│  │ Message │  │ Cloud   │  │ Legacy  │  │ Partner │  │
│  │         │  │ Queues  │  │ Services│  │ Systems │  │ APIs    │  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Deployment Architecture (Kubernetes)

```
┌─────────────────────────────────────────────────────────────────────┐
│                      KUBERNETES CLUSTER                              │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                        NAMESPACE: camel-integrations            │ │
│  │                                                                  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │ │
│  │  │ Integration  │  │ Integration  │  │ Integration  │          │ │
│  │  │ Service A    │  │ Service B    │  │ Service C    │          │ │
│  │  │ (Quarkus)    │  │ (Quarkus)    │  │ (Quarkus)    │          │ │
│  │  │              │  │              │  │              │          │ │
│  │  │ - REST API   │  │ - Kafka      │  │ - File       │          │ │
│  │  │ - DB sync    │  │ - Transform  │  │ - SFTP       │          │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘          │ │
│  │         │                 │                 │                   │ │
│  │         └─────────────────┼─────────────────┘                   │ │
│  │                           │                                      │ │
│  │                           ▼                                      │ │
│  │  ┌──────────────────────────────────────────────────────────┐  │ │
│  │  │                 SHARED SERVICES                           │  │ │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │  │ │
│  │  │  │ ConfigMap│  │ Secrets  │  │ Service  │               │  │ │
│  │  │  │ (config) │  │ (creds)  │  │ Mesh     │               │  │ │
│  │  │  └──────────┘  └──────────┘  └──────────┘               │  │ │
│  │  └──────────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                 OBSERVABILITY STACK                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │ │
│  │  │Prometheus│  │ Grafana  │  │ Jaeger   │  │ Loki     │       │ │
│  │  │ (metrics)│  │ (dashbrd)│  │ (traces) │  │ (logs)   │       │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Runtime** | Quarkus | 3.19.x |
| **Integration** | Apache Camel | 4.14.x LTS |
| **Language** | Java | 21 LTS |
| **Build** | Maven / Gradle | Latest |
| **Container** | Docker / Podman | Latest |
| **Orchestration** | Kubernetes | 1.28+ |
| **Serverless** | Camel K / Knative | 2.x |

---

## 5. Project Structure

### 5.1 Repository Structure

```
camel-integration-platform/
├── README.md
├── pom.xml (parent)
│
├── platform-core/                    # Shared libraries
│   ├── common-utils/
│   ├── security-config/
│   └── observability/
│
├── integrations/                     # Integration services
│   ├── api-gateway/                  # REST API exposure
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/
│   │   │   │   ├── resources/
│   │   │   │   │   ├── application.yaml
│   │   │   │   │   ├── routes/
│   │   │   │   │   │   └── *.yaml
│   │   │   │   │   └── openapi/
│   │   │   │   │       └── *.yaml
│   │   │   │   └── docker/
│   │   │   └── test/
│   │   └── pom.xml
│   │
│   ├── data-sync/                    # Database synchronization
│   ├── file-processor/               # File/SFTP processing
│   ├── event-handler/                # Kafka/messaging
│   └── legacy-adapter/               # Legacy system adapters
│
├── connectors/                       # Custom connectors
│   └── custom-connector-template/
│
├── deployment/                       # Deployment configs
│   ├── docker-compose/
│   ├── kubernetes/
│   │   ├── base/
│   │   └── overlays/
│   │       ├── dev/
│   │       ├── staging/
│   │       └── prod/
│   └── helm/
│
└── tools/                            # Development tools
    ├── openapi-generator/
    └── route-templates/
```

### 5.2 Integration Service Structure

```
api-gateway/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ngworkshop/integration/
│   │   │       ├── ApiGatewayApplication.java
│   │   │       ├── routes/
│   │   │       │   ├── UserRoutes.java
│   │   │       │   └── OrderRoutes.java
│   │   │       ├── processors/
│   │   │       │   └── ValidationProcessor.java
│   │   │       └── model/
│   │   │           └── UserDTO.java
│   │   │
│   │   └── resources/
│   │       ├── application.yaml
│   │       ├── routes/
│   │       │   ├── user-routes.yaml
│   │       │   └── order-routes.yaml
│   │       └── openapi/
│   │           └── api-spec.yaml
│   │
│   └── test/
│       └── java/
│           └── com/ngworkshop/integration/
│               └── routes/
│                   └── UserRoutesTest.java
│
└── Dockerfile
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Goal:** Establish core platform with REST API capabilities

| Task | Priority | Effort |
|------|----------|--------|
| Setup Quarkus project structure | P0 | 2 days |
| Configure Camel 4.14.x dependencies | P0 | 1 day |
| Implement REST DSL with OpenAPI | P0 | 3 days |
| Setup basic health/metrics endpoints | P0 | 1 day |
| Create Docker build pipeline | P0 | 2 days |
| Basic Kubernetes deployment | P0 | 1 day |

**Deliverables:**
- [ ] Running Quarkus + Camel application
- [ ] REST API exposed from OpenAPI spec
- [ ] Health and metrics endpoints
- [ ] Docker image building
- [ ] Kubernetes manifests

### Phase 2: Core Connectors (Weeks 3-4)

**Goal:** Enable primary integration patterns

| Task | Priority | Effort |
|------|----------|--------|
| HTTP/REST client component | P0 | 2 days |
| Database (JDBC/SQL) component | P0 | 2 days |
| Kafka producer/consumer | P0 | 2 days |
| File/SFTP component | P0 | 2 days |
| Error handling patterns | P0 | 2 days |

**Deliverables:**
- [ ] HTTP outbound calls working
- [ ] Database read/write operations
- [ ] Kafka message processing
- [ ] File upload/download via SFTP
- [ ] Dead letter queue pattern

### Phase 3: Advanced Features (Weeks 5-6)

**Goal:** Enterprise-ready capabilities

| Task | Priority | Effort |
|------|----------|--------|
| Authentication/Authorization | P1 | 3 days |
| Rate limiting | P1 | 1 day |
| Distributed tracing (OpenTelemetry) | P1 | 2 days |
| Circuit breaker pattern | P1 | 1 day |
| Secrets management | P1 | 1 day |
| Camel K operator setup | P1 | 2 days |

**Deliverables:**
- [ ] JWT/OAuth2 authentication
- [ ] Request throttling
- [ ] Jaeger trace collection
- [ ] Resilient integrations
- [ ] Vault/secrets integration

### Phase 4: Visual Design & Polish (Weeks 7-8)

**Goal:** Developer experience and production hardening

| Task | Priority | Effort |
|------|----------|--------|
| Karavan VS Code extension setup | P1 | 2 days |
| Grafana dashboards | P1 | 2 days |
| Documentation | P1 | 3 days |
| Performance testing | P1 | 2 days |
| Production deployment guide | P1 | 1 day |

**Deliverables:**
- [ ] Visual route designer working
- [ ] Monitoring dashboards
- [ ] Developer documentation
- [ ] Performance benchmarks
- [ ] Operations runbook

---

## 7. Sample Integration Routes

### 7.1 REST to Database

```yaml
# routes/user-api.yaml
- route:
    id: get-user-by-id
    from:
      uri: direct:getUser
    steps:
      - setBody:
          simple: "SELECT * FROM users WHERE id = :?id"
      - to:
          uri: jdbc:dataSource
          parameters:
            useHeadersAsParameters: true
      - marshal:
          json: {}
```

### 7.2 Kafka to REST

```yaml
# routes/event-processor.yaml
- route:
    id: process-order-events
    from:
      uri: kafka:order-events
      parameters:
        brokers: "{{kafka.brokers}}"
        groupId: order-processor
    steps:
      - unmarshal:
          json:
            unmarshalType: com.ngworkshop.model.OrderEvent
      - process:
          ref: orderValidator
      - choice:
          when:
            - simple: "${body.status} == 'NEW'"
              steps:
                - to: direct:createOrder
            - simple: "${body.status} == 'CANCELLED'"
              steps:
                - to: direct:cancelOrder
```

### 7.3 OpenAPI Contract-First

```yaml
# routes/openapi-routes.yaml
- rest:
    id: petstore-api
    openApi:
      specification: openapi/petstore.yaml
      missingOperation: ignore

# Each operationId maps to direct:operationId
- route:
    id: getPetById
    from:
      uri: direct:getPetById
    steps:
      - to: sql:SELECT * FROM pets WHERE id = :#id
      - marshal:
          json: {}
```

### 7.4 File Processing with SFTP

```yaml
# routes/file-processor.yaml
- route:
    id: sftp-file-import
    from:
      uri: sftp://{{sftp.host}}/inbox
      parameters:
        username: "{{sftp.user}}"
        password: "{{sftp.password}}"
        delete: true
        antInclude: "*.csv"
    steps:
      - unmarshal:
          csv:
            useMaps: true
      - split:
          tokenize: "\n"
      - to: direct:processRecord
      - to: kafka:processed-records
```

---

## 8. Configuration

### 8.1 Application Configuration

```yaml
# application.yaml
quarkus:
  application:
    name: camel-integration-platform

  http:
    port: 8080
    cors:
      enabled: true
      origins: "*"

camel:
  context:
    name: integration-context

  rest:
    bindingMode: json
    apiContextPath: /api-doc
    enableCors: true

# Component configurations
database:
  url: jdbc:postgresql://localhost:5432/integration
  username: ${DB_USER}
  password: ${DB_PASSWORD}

kafka:
  brokers: localhost:9092

sftp:
  host: sftp.example.com
  user: ${SFTP_USER}
  password: ${SFTP_PASSWORD}
```

### 8.2 Kubernetes ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: camel-integration-config
data:
  application.yaml: |
    database:
      url: jdbc:postgresql://postgres-service:5432/integration
    kafka:
      brokers: kafka-service:9092
```

---

## 9. Security Requirements

### 9.1 Authentication

| Method | Use Case |
|--------|----------|
| API Key | Service-to-service |
| JWT Bearer | Client applications |
| OAuth2 Client Credentials | Machine-to-machine |
| mTLS | High-security integrations |

### 9.2 Authorization

| Feature | Implementation |
|---------|----------------|
| Route-level RBAC | Camel policy component |
| Rate Limiting | Camel throttle EIP |
| IP Whitelisting | Kubernetes NetworkPolicy |

### 9.3 Secrets Management

| Secret Type | Storage |
|-------------|---------|
| Database credentials | Kubernetes Secrets / Vault |
| API keys | Environment variables |
| Certificates | Cert-Manager / Vault PKI |

---

## 10. Success Criteria

### 10.1 Functional Requirements

- [ ] REST APIs exposed from OpenAPI specifications
- [ ] Database CRUD operations via Camel SQL
- [ ] Kafka message production and consumption
- [ ] File transfer via SFTP
- [ ] Error handling with dead letter queues
- [ ] Health checks passing

### 10.2 Non-Functional Requirements

- [ ] Startup time < 5 seconds (JVM), < 1 second (native)
- [ ] Memory usage < 256MB (JVM), < 64MB (native)
- [ ] 99.9% uptime
- [ ] < 100ms p99 latency for REST endpoints
- [ ] Horizontal scaling to 10+ replicas

### 10.3 Developer Experience

- [ ] New integration deployable in < 5 minutes
- [ ] Visual route design with Karavan
- [ ] Comprehensive documentation
- [ ] Example templates for common patterns

---

## 11. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Learning curve for Camel | Medium | High | Training, documentation, templates |
| Native compilation issues | Medium | Medium | Fallback to JVM mode |
| Component compatibility | Low | Medium | Stick to well-tested components |
| Performance bottlenecks | High | Low | Load testing, profiling |

---

## 12. Dependencies

### 12.1 External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Apache Camel | 4.14.x | Integration framework |
| Quarkus | 3.19.x | Runtime platform |
| Java | 21 LTS | Language runtime |
| PostgreSQL | 15+ | Example database |
| Apache Kafka | 3.x | Messaging |

### 12.2 Infrastructure Dependencies

| Service | Purpose |
|---------|---------|
| Kubernetes | Container orchestration |
| Container Registry | Image storage |
| Prometheus | Metrics collection |
| Grafana | Visualization |

---

## 13. Appendix

### 13.1 References

- [Apache Camel Documentation](https://camel.apache.org/docs/)
- [Camel Components Reference](https://camel.apache.org/components/latest/)
- [REST DSL with OpenAPI](https://camel.apache.org/manual/rest-dsl-openapi.html)
- [Camel Quarkus](https://camel.apache.org/camel-quarkus/latest/)
- [Camel K](https://camel.apache.org/camel-k/latest/)
- [Apache Camel Karavan](https://github.com/apache/camel-karavan)
- [Kaoto Visual Designer](https://kaoto.io/)

### 13.2 Glossary

| Term | Definition |
|------|------------|
| **EIP** | Enterprise Integration Patterns |
| **DSL** | Domain Specific Language |
| **Route** | A Camel integration flow definition |
| **Component** | A connector to an external system |
| **Processor** | Custom logic within a route |
| **Exchange** | The message container in Camel |

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-17 | NG Workshop | Initial draft |

---

*This PRD is a living document and will be updated as requirements evolve.*
