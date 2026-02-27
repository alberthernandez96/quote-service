# 📊 Stack de Observabilidad

Este proyecto incluye un stack completo de observabilidad con **Jaeger**, **Prometheus** y **Grafana** para visualizar traces, métricas y logs.

**Un solo stack para ambos servicios**: el mismo Prometheus, Grafana y Jaeger sirven a **quote-service** y **product-service**. Prometheus scrapea ambos (puertos 3004 y 3005) y en Grafana tienes dashboards para los dos. Los traces de ambos servicios aparecen en la misma Jaeger (filtra por servicio `quote-service` o `product-service`).

## 🚀 Inicio Rápido

### 1. Levantar el stack de observabilidad

```bash
docker compose -f docker-compose.dev.yml up -d
```

Esto levantará:
- **PostgreSQL** (puerto 5434)
- **Jaeger** (puerto 16686)
- **Prometheus** (puerto 9090)
- **Grafana** (puerto 3000)

### 2. Configurar variables de entorno

Asegúrate de que tu `.env` tenga:

```env
# Using gRPC endpoint (more stable with Jaeger all-in-one)
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
OTEL_EXPORTER_OTLP_PROTOCOL=grpc
SERVICE_NAME=quote-service
SERVICE_VERSION=1.0.0
LOG_LEVEL=info
```

### 3. Iniciar las aplicaciones

- **Solo quote-service**: desde `quote-service/` ejecuta `npm run start` (puerto 3004).
- **Solo product-service**: desde `product-service/` ejecuta `npm run start` (puerto 3005).
- **Ambos**: levanta los dos en terminales separadas (o con tu proceso manager). Ambos envían traces al mismo Jaeger y son scrapeados por el mismo Prometheus.

## 📈 Acceder a las herramientas

### **Jaeger UI** - Visualizar Traces
- **URL**: http://localhost:16686
- **Qué verás**: 
  - Traces de **quote-service** y **product-service** (elige el servicio en el desplegable).
  - Spans de cada handler (CreateQuoteCommand, GetProductListQuery, etc.)
  - Tiempos de ejecución
  - Errores y excepciones
  - Atributos personalizados (quote.id, products.count, etc.)

### **Prometheus** - Métricas
- **URL**: http://localhost:9090
- **Qué verás**:
  - Métricas de **quote-service** (job `quote-service`) y **product-service** (job `product-service`).
  - HTTP requests, base de datos (quote), métricas de negocio (quotes.*, products.*).
  - Duración de operaciones
- **Nota**: Prometheus tiene su propia UI básica para consultas y gráficos. No necesita dashboards adicionales, pero puedes crear dashboards avanzados en Grafana usando Prometheus como datasource.

### **Grafana** - Dashboards y Visualización
- **URL**: http://localhost:3000
- **Credenciales**: 
  - Usuario: `admin`
  - Contraseña: `admin`
- **Dashboards disponibles**:
  - **Quote Service - Production Dashboard**: métricas de quote-service (Prometheus)
  - **Quote Service - Traces Dashboard (Jaeger)**: traces de quote-service
  - **Product Service - Production Dashboard**: métricas de product-service (Prometheus)
  - **Product Service - Traces Dashboard (Jaeger)**: traces de product-service
- **Qué puedes hacer**:
  - Visualizar métricas con gráficos avanzados (Prometheus)
  - Ver traces integrados con Jaeger
  - Crear dashboards personalizados
  - Configurar alertas

## 🔍 Ejemplos de Queries en Prometheus

### Ver todas las métricas de quotes creadas
```
quotes_created_total
```

### Ver duración de creación de quotes
```
quotes_create_duration_ms
```

### Ver requests HTTP por método
```
http_requests_total
```

### Ver errores totales
```
errors_total
```

## 📊 Métricas Disponibles

### Métricas de Negocio
- `quotes_created_total` - Total de quotes creadas
- `quotes_updated_total` - Total de quotes actualizadas
- `quotes_retrieved_total` - Total de quotes recuperadas
- `quotes_create_duration_ms` - Duración de creación
- `quotes_update_duration_ms` - Duración de actualización
- `quotes_retrieve_duration_ms` - Duración de recuperación

### Métricas de Sistema
- `http_requests_total` - Requests HTTP totales
- `http_request_duration_ms` - Duración de requests HTTP
- `db_queries_total` - Queries de base de datos
- `db_query_duration_ms` - Duración de queries
- `errors_total` - Errores totales

## 🎯 Cómo usar

1. **Generar tráfico**: Haz requests a tu API (POST /api/quotes, GET /api/quotes, etc.)
2. **Ver traces en Jaeger**: 
   - Ve a http://localhost:16686
   - Selecciona el servicio `quote-service`
   - Busca traces por operación o tiempo
3. **Ver métricas en Prometheus**:
   - Ve a http://localhost:9090
   - Escribe queries como `quotes_created_total`
   - Visualiza gráficos
4. **Ver dashboards en Grafana**:
   - Ve a http://localhost:3000
   - **Dashboard de Métricas**: "Quote Service - Production Dashboard" - muestra métricas de Prometheus
   - **Dashboard de Traces**: "Quote Service - Traces Dashboard (Jaeger)" - muestra traces de Jaeger
   - También puedes crear dashboards personalizados añadiendo paneles con queries de Prometheus o traces de Jaeger

## 🛑 Detener el stack

```bash
docker compose -f docker-compose.dev.yml down
```

Para eliminar también los volúmenes (datos):

```bash
docker compose -f docker-compose.dev.yml down -v
```

## 📝 Notas

- Los traces se envían automáticamente a Jaeger cuando tu aplicación hace requests
- Las métricas se recopilan automáticamente por OpenTelemetry
- Los datos se persisten en volúmenes de Docker, así que no se perderán al reiniciar

## 🎨 Dashboards Disponibles

### Dashboard de Métricas (Prometheus)
- **Ubicación**: Grafana → "Quote Service - Production Dashboard"
- **Fuente de datos**: Prometheus
- **Contenido**: 
  - Métricas de negocio (quotes creadas, actualizadas, recuperadas)
  - Tasas de error y éxito
  - Latencia (P50, P95, P99)
  - Duración promedio de operaciones
  - Requests HTTP por método

### Dashboard de Traces (Jaeger)
- **Ubicación**: Grafana → "Quote Service - Traces Dashboard (Jaeger)"
- **Fuente de datos**: Jaeger
- **Contenido**:
  - Explorer de traces del servicio quote-service
  - Timeline de traces
  - Visualización de spans y su jerarquía
  - Filtros por servicio y operación

### Uso de las UIs Nativas

**Prometheus UI (http://localhost:9090)**:
- Interfaz básica para consultas PromQL
- Gráficos simples y tablas de métricas
- Útil para debugging rápido y queries ad-hoc
- No tiene dashboards avanzados como Grafana

**Jaeger UI (http://localhost:16686)**:
- Interfaz completa para visualizar traces
- Búsqueda avanzada de traces
- Visualización detallada de spans
- Análisis de latencia y errores
- Útil para debugging profundo de requests individuales
