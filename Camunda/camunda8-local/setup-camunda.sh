#!/bin/bash
#
# Camunda 8 Local Setup Script
# Includes: Full stack with Web Modeler, Identity, Keycloak + SFTP Connector
#
# Usage: ./setup-camunda.sh [command]
# Commands:
#   start     - Start all services (default)
#   stop      - Stop all services
#   restart   - Restart all services
#   status    - Show service status
#   logs      - Show logs (use: ./setup-camunda.sh logs [service])
#   build     - Build SFTP connector and copy to connectors folder
#   clean     - Stop and remove all containers and volumes
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONNECTOR_SOURCE="/Users/guyelisha/Projects/Camunda POC/camunda-connectors/connector-sftp"
CONNECTOR_JAR="connector-sftp-0.2.0-SNAPSHOT-with-dependencies.jar"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Ensure connectors directory exists
setup_directories() {
    log_info "Setting up directories..."
    mkdir -p "$SCRIPT_DIR/connectors"
    mkdir -p "$SCRIPT_DIR/.connectors"
}

# Build and copy SFTP connector
build_connector() {
    log_info "Building SFTP connector..."

    if [ ! -d "$CONNECTOR_SOURCE" ]; then
        log_error "SFTP connector source not found at: $CONNECTOR_SOURCE"
        exit 1
    fi

    cd "$CONNECTOR_SOURCE"
    mvn clean package -DskipTests -q

    if [ -f "target/$CONNECTOR_JAR" ]; then
        log_info "Copying connector JAR to connectors folder..."
        cp "target/$CONNECTOR_JAR" "$SCRIPT_DIR/connectors/"
        log_info "SFTP connector built and installed successfully"
    else
        log_error "Build failed - JAR not found"
        exit 1
    fi

    cd "$SCRIPT_DIR"
}

# Copy connector if it exists (without building)
copy_connector() {
    if [ -f "$CONNECTOR_SOURCE/target/$CONNECTOR_JAR" ]; then
        log_info "Copying existing SFTP connector JAR..."
        cp "$CONNECTOR_SOURCE/target/$CONNECTOR_JAR" "$SCRIPT_DIR/connectors/"
    else
        log_warn "SFTP connector JAR not found. Run './setup-camunda.sh build' to build it."
    fi
}

# Wait until the keycloak container reports healthy
wait_for_keycloak() {
    local waited=0
    while [ $waited -lt 180 ]; do
        if docker ps --filter "name=keycloak" --filter "health=healthy" -q | grep -q .; then
            return 0
        fi
        sleep 5
        waited=$((waited + 5))
    done
    log_warn "Keycloak did not become healthy within 180s"
    return 1
}

# Keycloak 26 refuses plain HTTP for requests it considers "external" (they arrive
# via the Docker gateway), which makes Identity fail with "HTTP 403 Forbidden".
# For this local-only setup we turn off the SSL requirement on both realms.
relax_keycloak_ssl() {
    local realm=$1
    docker exec keycloak /opt/keycloak/bin/kcadm.sh config credentials \
        --server http://localhost:18080/auth --realm master \
        --user "${KEYCLOAK_ADMIN_USER:-admin}" --password "${KEYCLOAK_ADMIN_PASSWORD:-admin}" >/dev/null 2>&1 || return 1
    docker exec keycloak /opt/keycloak/bin/kcadm.sh update "realms/$realm" -s sslRequired=NONE >/dev/null 2>&1
}

# Start services
start_services() {
    log_info "Starting Camunda 8 services..."

    setup_directories
    copy_connector

    cd "$SCRIPT_DIR"

    # Bring Keycloak up first and disable its HTTPS requirement, otherwise Identity
    # cannot talk to it and the rest of the stack never becomes healthy.
    docker compose -f docker-compose-full.yaml up -d keycloak
    wait_for_keycloak && relax_keycloak_ssl master && log_info "Keycloak master realm set to sslRequired=NONE"

    docker compose -f docker-compose-full.yaml up -d

    # Identity creates the camunda-platform realm on first boot - relax it too.
    local realm_wait=0
    while [ $realm_wait -lt 180 ]; do
        if docker exec keycloak /opt/keycloak/bin/kcadm.sh get realms --fields realm 2>/dev/null | grep -q "camunda-platform"; then
            relax_keycloak_ssl camunda-platform && log_info "camunda-platform realm set to sslRequired=NONE"
            break
        fi
        sleep 5
        realm_wait=$((realm_wait + 5))
    done

    log_info "Waiting for services to become healthy..."

    # Wait for critical services
    local max_wait=180
    local waited=0

    while [ $waited -lt $max_wait ]; do
        local healthy_count=$(docker ps --filter "health=healthy" --format "{{.Names}}" | wc -l | tr -d ' ')
        local total_count=$(docker compose -f docker-compose-full.yaml ps -q | wc -l | tr -d ' ')

        echo -ne "\r  Healthy services: $healthy_count / $total_count (waited ${waited}s)    "

        # Check if key services are healthy
        if docker ps --filter "name=web-modeler-restapi" --filter "health=healthy" -q | grep -q .; then
            if docker ps --filter "name=identity" --filter "health=healthy" -q | grep -q .; then
                if docker ps --filter "name=keycloak" --filter "health=healthy" -q | grep -q .; then
                    echo ""
                    break
                fi
            fi
        fi

        sleep 5
        waited=$((waited + 5))
    done

    echo ""
    log_info "Services started!"
    echo ""
    show_access_info
}

# Stop services
stop_services() {
    log_info "Stopping Camunda 8 services..."
    cd "$SCRIPT_DIR"
    docker compose -f docker-compose-full.yaml stop
    log_info "Services stopped"
}

# Restart services
restart_services() {
    log_info "Restarting Camunda 8 services..."
    cd "$SCRIPT_DIR"
    docker compose -f docker-compose-full.yaml restart
    log_info "Services restarted"
}

# Show status
show_status() {
    log_info "Service Status:"
    echo ""
    cd "$SCRIPT_DIR"
    docker compose -f docker-compose-full.yaml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
}

# Show logs
show_logs() {
    local service=$1
    cd "$SCRIPT_DIR"
    if [ -n "$service" ]; then
        docker compose -f docker-compose-full.yaml logs -f "$service"
    else
        docker compose -f docker-compose-full.yaml logs -f
    fi
}

# Clean up everything
clean_all() {
    log_warn "This will remove all containers, networks, and volumes!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd "$SCRIPT_DIR"
        docker compose -f docker-compose-full.yaml down -v --remove-orphans
        log_info "Cleanup complete"
    else
        log_info "Cleanup cancelled"
    fi
}

# Show access information
show_access_info() {
    echo "=============================================="
    echo "  Camunda 8 Local Environment"
    echo "=============================================="
    echo ""
    echo "  Web Modeler:     http://localhost:8070"
    echo "  Operate/Tasklist: http://localhost:8088"
    echo "  Optimize:        http://localhost:8085"
    echo "  Console:         http://localhost:8087"
    echo "  Identity:        http://localhost:8084"
    echo "  Keycloak Admin:  http://localhost:18080/auth"
    echo "  Connectors:      http://localhost:8086"
    echo "  Elasticsearch:   http://localhost:9200"
    echo "  Mailpit (SMTP):  http://localhost:8075"
    echo ""
    echo "  Login Credentials:"
    echo "    Username: demo"
    echo "    Password: demo"
    echo ""
    echo "  Keycloak Admin:"
    echo "    Username: admin"
    echo "    Password: admin"
    echo ""
    echo "=============================================="
}

# Main
case "${1:-start}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    build)
        build_connector
        ;;
    clean)
        clean_all
        ;;
    info)
        show_access_info
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|build|clean|info}"
        exit 1
        ;;
esac
