# Sentinela das Águas - Sistema Anti-Enchentes (S.A.E.)

## 🌊 Sobre o Projeto

O **Sentinela das Águas** é uma plataforma inteligente de monitoramento e prevenção de enchentes desenvolvida para órgãos de Defesa Civil. O sistema integra inteligência artificial, mapas interativos e alertas em tempo real para identificar precocemente riscos de inundação e coordenar respostas eficazes.

### Visão Geral

Este projeto foi concebido como uma solução de soberania digital para o Estado de Minas Gerais, utilizando tecnologias de ponta para transformar a Defesa Civil em uma força de resposta rápida e cega, onde a tecnologia trabalha para ganhar os minutos que salvam vidas.

---

## 🎯 Funcionalidades Principais

### 1. Dashboard Administrativo para Defesa Civil
- Mapa interativo em tempo real com pontos de risco e bueiros monitorados
- Visualização de alertas ativos por nível de severidade
- Estatísticas em tempo real (alertas críticos, altos, médios, baixos)
- Filtros avançados por tipo de alerta e região
- Interface intuitiva para autoridades

### 2. Detecção de Enchentes via IA
- Integração com **Google Vertex Vision AI** para análise de imagens
- Detecção automática de padrões: inundações, obstruções, nível de água
- Análise de confiança (0-100%) para cada padrão detectado
- Geração automática de alertas com base em limiar de confiança
- Suporte para análise em lote de múltiplas imagens

### 3. Painel Público para Cidadãos
- Interface simplificada para visualizar alertas na região
- Mapa de zonas de risco com filtro de proximidade
- Notificações push para alertas críticos
- Informações de segurança e orientações de evacuação
- Acesso sem necessidade de autenticação

### 4. Registro e Monitoramento de Bueiros
- Cadastro de pontos de monitoramento (bueiros, drenagens, seções de rio)
- Upload de fotos de inspeções com armazenamento em S3
- Histórico completo de inspeções com datas e achados
- Status de manutenção (operacional, manutenção, bloqueado, inundado)
- Notas detalhadas de inspeções

### 5. Geração de Relatórios Técnicos
- Relatórios automáticos (diários, semanais, mensais)
- Estatísticas de alertas por nível e região
- Análise de tempo médio de resposta
- Exportação em PDF para compartilhamento
- Visualizações com gráficos e dados agregados

### 6. Sistema de Alertas em Múltiplos Níveis
- **Crítico** (🔴): Requer ação imediata - enchente confirmada
- **Alto** (🟠): Monitoramento próximo - risco elevado
- **Médio** (🟡): Atenção - condições favoráveis a enchentes
- **Baixo** (🟢): Informativo - sem risco imediato

### 7. Notificações Automáticas
- Email para autoridades quando alertas críticos são detectados
- Notificações push in-app com coordenadas GPS
- SMS para casos críticos (futuro)
- Log de todas as notificações enviadas

### 8. Upload e Análise Batch de Imagens
- Interface para upload de múltiplas imagens de câmeras
- Processamento paralelo com Google Vertex Vision AI
- Geração automática de mapas de calor de risco
- Visualização de resultados agregados por região

### 9. Armazenamento Seguro em S3
- Upload seguro de fotos de bueiros e câmeras
- URLs públicas com expiração de 24h
- Organização de arquivos por tipo e data
- Backup automático de evidências

### 10. Visualizações Preditivas
- Mapas de calor de risco por região
- Diagramas de risco automaticamente gerados
- Análise textual de padrões de enchente
- Previsões baseadas em dados históricos

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

| Camada | Tecnologia | Propósito |
|--------|-----------|----------|
| **Frontend** | React 19 + Tailwind CSS 4 | Interface responsiva |
| **Backend** | Express.js + tRPC 11 | APIs tipadas |
| **Banco de Dados** | MySQL/TiDB | Persistência |
| **Autenticação** | Manus OAuth | Acesso seguro |
| **Mapas** | Google Maps API | Visualização |
| **IA** | Google Vertex Vision AI | Análise de imagens |
| **Armazenamento** | Amazon S3 | Fotos e evidências |
| **Notificações** | Email + Push | Alertas em tempo real |
| **Relatórios** | Recharts + PDF | Visualizações |

### Modelo de Dados

#### Tabelas Principais

- **users**: Autenticação e perfis (admin, analyst, responder, public)
- **monitoring_points**: Bueiros, drenagens, seções de rio
- **inspections**: Histórico de inspeções com fotos
- **alerts**: Sistema de alertas com níveis
- **ai_analysis_results**: Resultados de análise de IA
- **alert_notifications**: Log de notificações
- **reports**: Relatórios técnicos
- **heatmap_data**: Dados para mapas de calor

---

## 🚀 Como Usar

### Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/sentinela-das-aguas-app.git
cd sentinela-das-aguas-app

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais

# Executar migrations
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Acessar a Aplicação

- **Dashboard Admin**: `http://localhost:3000/dashboard`
- **Painel Público**: `http://localhost:3000/alerts`
- **Home**: `http://localhost:3000`

### Variáveis de Ambiente Necessárias

```env
# Banco de Dados
DATABASE_URL=mysql://usuario:senha@host:3306/sentinela

# Google Cloud
GOOGLE_VERTEX_PROJECT_ID=seu-projeto-id
GOOGLE_VERTEX_API_KEY=sua-chave-api

# Google Maps
GOOGLE_MAPS_API_KEY=sua-chave-maps

# Amazon S3
AWS_ACCESS_KEY_ID=sua-chave-acesso
AWS_SECRET_ACCESS_KEY=sua-chave-secreta
AWS_S3_BUCKET=seu-bucket
AWS_REGION=us-east-1

# Email
SMTP_HOST=smtp.seuservidor.com
SMTP_PORT=587
SMTP_USER=seu-email@dominio.com
SMTP_PASSWORD=sua-senha

# OAuth (Manus)
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
```

---

## 📊 APIs tRPC Disponíveis

### Monitoramento

```typescript
// Listar pontos de monitoramento
trpc.monitoring.getPoints.useQuery()

// Obter ponto específico
trpc.monitoring.getPoint.useQuery({ id: 1 })

// Criar ponto (admin)
trpc.monitoring.createPoint.useMutation()
```

### Alertas

```typescript
// Listar alertas ativos
trpc.alerts.getActive.useQuery()

// Alertas por nível
trpc.alerts.getByLevel.useQuery({ level: "critical" })

// Alertas por região
trpc.alerts.getByRegion.useQuery({ latitude, longitude, radiusKm })

// Resolver alerta
trpc.alerts.resolve.useMutation()

// Criar alerta manual
trpc.alerts.create.useMutation()
```

### Análise de IA

```typescript
// Analisar imagem única
trpc.aiAnalysis.analyzeImage.useMutation()

// Análise em lote
trpc.aiAnalysis.analyzeBatch.useMutation()

// Obter resultados
trpc.aiAnalysis.getResults.useQuery()

// Gerar mapa de calor
trpc.aiAnalysis.generateHeatmap.useQuery()
```

---

## 🔐 Segurança

- **Autenticação**: Manus OAuth para acesso seguro
- **Autorização**: Roles (admin, analyst, responder, public)
- **Criptografia**: HTTPS para todas as comunicações
- **S3**: URLs presigned com expiração
- **Validação**: Zod schemas para todas as entradas
- **Rate Limiting**: 100 requisições/minuto por usuário

---

## 📈 Performance

- **Caching**: Redis para alertas ativos (TTL 5 minutos)
- **Batch Processing**: Análise paralela de imagens
- **Paginação**: Limite/offset para grandes datasets
- **Índices**: Otimizados em monitoring_point_id, created_at, alert_level
- **CDN**: CloudFront para imagens S3

---

## 🧪 Testes

```bash
# Executar testes unitários
pnpm test

# Testes com cobertura
pnpm test:coverage

# Testes em modo watch
pnpm test:watch
```

---

## 📝 Documentação

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura técnica detalhada
- [API.md](./API.md) - Documentação de APIs (em desenvolvimento)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia de deployment (em desenvolvimento)

---

## 🗺️ Roadmap

- [ ] Integração com sensores IoT
- [ ] Machine Learning para previsão de enchentes
- [ ] App mobile (React Native)
- [ ] Integração com sirenes de alerta público
- [ ] Análise de redes sociais para detecção
- [ ] Integração com sistemas de drenagem inteligente
- [ ] Dashboard em tempo real com WebSockets
- [ ] Relatórios automatizados por email

---

## 👥 Equipe

**DeDesenvolvido por: Impulso Digital  
**Cliente**: Defesa Civil - Estado de Minas Gerais  
**Responsável Técnico**: Felipe Marcos de Abreu Aquino (CEO - Impulso Digital)

---

## 📄 Licença

Este projeto é confidencial e propriedade da Defesa Civil do Estado de Minas Gerais.

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento através do email: support@impulsodigital.com.br

---

## 🙏 Agradecimentos

- Google Cloud por disponibilizar Vertex Vision AI
- Amazon Web Services pelo S3
- Comunidade open-source por ferramentas incríveis
- Defesa Civil de Minas Gerais pela parceria

---

**Sentinela das Águas** - Protegendo vidas através da tecnologia.
