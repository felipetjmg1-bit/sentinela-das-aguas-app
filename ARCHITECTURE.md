# Arquitetura Técnica - Sentinela das Águas (S.A.E.)

## 1. Visão Geral do Sistema

O **Sentinela das Águas** é uma plataforma de monitoramento e prevenção de enchentes que integra inteligência artificial, mapas interativos e alertas em tempo real. O sistema foi projetado para auxiliar órgãos de Defesa Civil na identificação precoce de riscos de inundação e coordenação de respostas.

### Stack Tecnológico

| Camada | Tecnologia | Propósito |
|--------|-----------|----------|
| **Frontend** | React 19 + Tailwind CSS 4 | Interface responsiva para dashboard e painel público |
| **Backend** | Express.js + tRPC 11 | APIs tipadas e autenticação |
| **Banco de Dados** | MySQL/TiDB | Persistência de alertas, bueiros, usuários e relatórios |
| **Autenticação** | Manus OAuth | Acesso seguro para autoridades da Defesa Civil |
| **Mapas** | Google Maps API | Visualização de zonas de risco e pontos críticos |
| **IA para Imagens** | Google Vertex Vision AI | Detecção de inundações e obstruções em imagens |
| **Armazenamento** | Amazon S3 | Upload e armazenamento de fotos e evidências |
| **Notificações** | Email + Push (in-app) | Alertas em tempo real para autoridades |
| **Relatórios** | Recharts + PDF Export | Visualizações de dados e geração de documentos |

---

## 2. Modelo de Dados

### Tabelas Principais

#### `users` (Autenticação)
```sql
- id: INT (PK)
- openId: VARCHAR (OAuth identifier)
- name: TEXT
- email: VARCHAR
- role: ENUM (admin, analyst, responder, public)
- organization: VARCHAR (Defesa Civil, Prefeitura, etc)
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

#### `monitoring_points` (Pontos de Monitoramento/Bueiros)
```sql
- id: INT (PK)
- name: VARCHAR
- latitude: DECIMAL(10,8)
- longitude: DECIMAL(11,8)
- type: ENUM (sewer, drain, river_section, flood_zone)
- risk_level: ENUM (low, medium, high, critical)
- status: ENUM (operational, maintenance, blocked, flooded)
- last_inspection: TIMESTAMP
- inspection_notes: TEXT
- created_by: INT (FK users)
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP
```

#### `inspections` (Histórico de Inspeções)
```sql
- id: INT (PK)
- monitoring_point_id: INT (FK)
- inspector_id: INT (FK users)
- inspection_date: TIMESTAMP
- photos: JSON (array of S3 URLs)
- findings: TEXT
- maintenance_required: BOOLEAN
- status: VARCHAR
- createdAt: TIMESTAMP
```

#### `alerts` (Sistema de Alertas)
```sql
- id: INT (PK)
- monitoring_point_id: INT (FK)
- alert_level: ENUM (low, medium, high, critical)
- description: TEXT
- detected_by: ENUM (ai_analysis, manual_report, sensor)
- ai_confidence: DECIMAL(3,2) (0-1)
- image_url: VARCHAR (S3 URL)
- latitude: DECIMAL(10,8)
- longitude: DECIMAL(11,8)
- is_active: BOOLEAN
- resolved_at: TIMESTAMP
- resolved_by: INT (FK users)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `ai_analysis_results` (Resultados de Análise de IA)
```sql
- id: INT (PK)
- image_url: VARCHAR (S3 URL)
- analysis_timestamp: TIMESTAMP
- detected_patterns: JSON (flood_risk, obstruction, water_level, etc)
- confidence_scores: JSON
- generated_alert_id: INT (FK alerts, nullable)
- batch_job_id: VARCHAR (para análise em lote)
- created_at: TIMESTAMP
```

#### `alert_notifications` (Log de Notificações)
```sql
- id: INT (PK)
- alert_id: INT (FK)
- recipient_id: INT (FK users)
- notification_type: ENUM (email, push, sms)
- status: ENUM (pending, sent, failed)
- sent_at: TIMESTAMP
- error_message: TEXT
```

#### `reports` (Relatórios Técnicos)
```sql
- id: INT (PK)
- report_type: ENUM (daily, weekly, monthly, incident)
- period_start: DATE
- period_end: DATE
- total_alerts: INT
- critical_alerts: INT
- affected_areas: JSON (array of region names)
- response_time_avg: INT (segundos)
- generated_by: INT (FK users)
- pdf_url: VARCHAR (S3 URL)
- created_at: TIMESTAMP
```

#### `heatmap_data` (Dados para Mapas de Calor)
```sql
- id: INT (PK)
- region: VARCHAR
- latitude: DECIMAL(10,8)
- longitude: DECIMAL(11,8)
- risk_score: DECIMAL(3,2) (0-1)
- incident_count_30d: INT
- last_updated: TIMESTAMP
```

---

## 3. Fluxos de Negócio Principais

### 3.1 Fluxo de Detecção de Enchentes via IA

```
1. Câmera/Usuário faz upload de imagem
   ↓
2. Imagem armazenada em S3
   ↓
3. Trigger: Enviar para Google Vertex Vision AI
   ↓
4. IA analisa: padrões de inundação, obstruções, nível de água
   ↓
5. Se confiança > threshold:
   - Criar alerta automático
   - Determinar nível (low/medium/high/critical)
   ↓
6. Se alerta crítico:
   - Notificar autoridades via email + push
   - Incluir coordenadas GPS e severidade
   ↓
7. Armazenar resultado em ai_analysis_results
```

### 3.2 Fluxo de Monitoramento Manual de Bueiros

```
1. Inspector acessa dashboard → "Registrar Inspeção"
   ↓
2. Seleciona ponto de monitoramento (bueiro)
   ↓
3. Upload de fotos (até 5 por inspeção)
   ↓
4. Descreve achados (obstruções, manutenção necessária)
   ↓
5. Sistema salva em inspections + atualiza monitoring_points
   ↓
6. Se manutenção urgente: gera alerta
```

### 3.3 Fluxo de Análise em Lote (Batch)

```
1. Usuário seleciona múltiplas imagens (câmeras de monitoramento)
   ↓
2. Upload para S3 + criar batch_job_id
   ↓
3. Processar em paralelo com Google Vertex Vision AI
   ↓
4. Gerar heatmap de risco por região
   ↓
5. Criar visualizações preditivas (mapas de calor)
   ↓
6. Notificar quando análise completa
```

### 3.4 Fluxo de Geração de Relatórios

```
1. Usuário solicita relatório (daily/weekly/monthly)
   ↓
2. Backend agrega:
   - Total de alertas por nível
   - Áreas afetadas
   - Tempo médio de resposta
   - Efetividade das respostas
   ↓
3. Gerar gráficos com Recharts
   ↓
4. Exportar para PDF
   ↓
5. Armazenar em S3 + salvar referência em database
```

---

## 4. Arquitetura de Componentes

### Backend (tRPC Routers)

```
server/routers/
├── auth.ts              # Login, logout, me
├── monitoring.ts        # CRUD de bueiros e pontos de monitoramento
├── inspections.ts       # Registrar inspeções, upload de fotos
├── alerts.ts            # Listar alertas, resolver, filtrar por nível
├── ai-analysis.ts       # Análise de imagens, batch processing
├── notifications.ts     # Enviar notificações, log de envios
├── reports.ts           # Gerar relatórios, exportar PDF
└── heatmap.ts          # Dados para mapas de calor e visualizações
```

### Frontend (Pages & Components)

```
client/src/
├── pages/
│   ├── AdminDashboard.tsx        # Dashboard para Defesa Civil
│   ├── PublicAlerts.tsx          # Painel público de alertas
│   ├── MonitoringPoints.tsx       # Gerenciamento de bueiros
│   ├── ImageAnalysis.tsx         # Upload e análise de imagens
│   ├── Reports.tsx               # Visualização de relatórios
│   └── Settings.tsx              # Configurações de usuário
├── components/
│   ├── InteractiveMap.tsx        # Google Maps com overlay de alertas
│   ├── AlertCard.tsx             # Card de alerta com nível de severidade
│   ├── HeatmapVisualization.tsx  # Mapa de calor de risco
│   ├── AlertTimeline.tsx         # Timeline de alertas
│   └── ReportCharts.tsx          # Gráficos de dados
```

---

## 5. Integração com APIs Externas

### Google Vertex Vision AI

**Endpoint:** `projects/{project-id}/locations/us-central1/publishers/google/models/imageobjectdetection:predict`

**Payload:**
```json
{
  "instances": [{
    "content": "base64_encoded_image"
  }],
  "parameters": {
    "confidenceThreshold": 0.5,
    "maxPredictions": 10
  }
}
```

**Resposta esperada:**
```json
{
  "predictions": [{
    "displayNames": ["flooding", "water_obstruction"],
    "confidences": [0.92, 0.87]
  }]
}
```

### Google Maps API

- **Places API:** Buscar endereços de pontos de monitoramento
- **Geocoding API:** Converter coordenadas em endereços
- **Maps JavaScript API:** Renderizar mapa interativo com marcadores

### Amazon S3

- **Upload de fotos:** `PUT /bucket/{userId}/inspections/{timestamp}.jpg`
- **Análise de imagens:** Trigger automático para Google Vertex quando arquivo é salvo
- **Acesso público:** URLs com expiração de 24h para dashboard

---

## 6. Segurança e Autenticação

- **OAuth:** Manus OAuth para login seguro
- **Roles:** `admin` (Defesa Civil), `analyst` (Analista), `responder` (Responder), `public` (Cidadão)
- **Rate Limiting:** 100 requisições/minuto por usuário
- **Validação de Entrada:** Zod schemas para todas as APIs
- **HTTPS:** Todas as comunicações criptografadas
- **S3 Presigned URLs:** Acesso temporário a arquivos

---

## 7. Performance e Escalabilidade

- **Caching:** Redis para alertas ativos (TTL 5 minutos)
- **Batch Processing:** Análise de imagens em paralelo com Workers
- **Paginação:** Alertas e inspeções com limit/offset
- **Índices:** Criados em `monitoring_point_id`, `created_at`, `alert_level`
- **CDN:** Imagens servidas via CloudFront (S3 + CloudFront)

---

## 8. Fluxo de Deployment

1. **Desenvolvimento:** `pnpm dev` (Vite + Express)
2. **Build:** `pnpm build` (React + esbuild)
3. **Produção:** `pnpm start` (Node.js)
4. **Database:** Migrations com Drizzle Kit (`pnpm db:push`)
5. **Hosting:** Manus (built-in) ou Railway/Render (externo)

---

## 9. Métricas e Monitoramento

- **Alertas por hora:** Gráfico de tendência
- **Tempo médio de resposta:** Desde criação até resolução
- **Taxa de falsos positivos:** Alertas resolvidas vs confirmadas
- **Cobertura de monitoramento:** % de bueiros com inspeção recente
- **Uptime:** Disponibilidade do sistema (target: 99.5%)

---

## 10. Roadmap Futuro

- [ ] Integração com sensores IoT (água, pressão)
- [ ] Previsão de enchentes com machine learning
- [ ] App mobile (React Native)
- [ ] Integração com sirenes de alerta público
- [ ] Análise de redes sociais para detecção de enchentes
- [ ] Integração com sistemas de drenagem inteligente
