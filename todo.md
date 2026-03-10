# Sentinela das Águas - TODO List

## Funcionalidades Obrigatórias

### 1. Dashboard Administrativo para Defesa Civil
- [x] Criar página AdminDashboard.tsx
- [x] Implementar mapa interativo com Google Maps
- [x] Exibir pontos de risco em tempo real
- [x] Exibir bueiros monitorados com status
- [x] Exibir alertas ativos com cores por nível
- [x] Filtros por tipo de alerta e região
- [x] Sidebar de navegação

### 2. Detecção de Enchentes via IA (Google Vertex Vision AI)
- [x] Criar router `ai-analysis.ts` com tRPC procedures
- [ ] Implementar função de upload de imagem para S3
- [x] Integrar Google Vertex Vision AI para análise
- [x] Criar tabela `ai_analysis_results` no banco
- [x] Implementar detecção de padrões: inundação, obstrução, nível de água
- [x] Gerar alertas automáticos com base em confiança
- [x] Armazenar resultados de análise no banco

### 3. Painel Público para Cidadãos
- [x] Criar página PublicAlerts.tsx
- [x] Exibir mapa de zonas de risco
- [x] Listar alertas ativos na região do usuário
- [ ] Notificações push para alertas críticos
- [x] Interface simplificada (sem dados sensíveis)
- [x] Filtro por proximidade (raio de X km)

### 4. Registro e Monitoramento de Bueiros
- [x] Criar tabela `monitoring_points` no banco
- [x] Criar tabela `inspections` no banco
- [ ] Página MonitoringPoints.tsx para CRUD
- [ ] Upload de fotos de bueiros para S3
- [x] Histórico de inspeções com datas
- [x] Status de manutenção (operational, maintenance, blocked, flooded)
- [x] Notas de inspeção com editor de texto

### 5. Geração de Relatórios Técnicos
- [ ] Criar router `reports.ts` com tRPC procedures
- [x] Criar tabela `reports` no banco
- [ ] Implementar agregação de dados (alertas, áreas, tempo de resposta)
- [ ] Página Reports.tsx com gráficos
- [ ] Exportar para PDF com ReportLab/WeasyPrint
- [ ] Relatórios por período (daily, weekly, monthly)

### 6. Sistema de Alertas em Múltiplos Níveis
- [x] Criar tabela `alerts` no banco
- [x] Router `alerts.ts` com CRUD
- [x] Níveis: baixo, médio, alto, crítico
- [x] Cores visuais para cada nível
- [x] Filtros por nível na UI
- [x] Ordenação por severidade

### 7. Notificações Push e Email
- [x] Criar tabela `alert_notifications` no banco
- [ ] Implementar envio de email para autoridades
- [ ] Implementar notificações push in-app
- [ ] Router `notifications.ts` com tRPC procedures
- [x] Log de notificações enviadas
- [ ] Retry automático para falhas

### 8. Visualização de Dados Históricos
- [ ] Gráficos de incidentes por região (Recharts)
- [ ] Gráficos de sazonalidade (tendências mensais)
- [ ] Gráficos de efetividade de resposta
- [ ] Timeline de alertas
- [ ] Filtros por período e região

### 9. Envio Automático de Emails e Notificações
- [ ] Integrar serviço de email (SendGrid ou similar)
- [ ] Template de email com coordenadas GPS
- [ ] Template de email com nível de severidade
- [ ] Notificação in-app com toast/modal
- [ ] Envio automático ao criar alerta crítico

### 10. Upload Seguro e Armazenamento em S3
- [ ] Configurar credenciais AWS S3
- [x] Implementar função `storagePut` para upload
- [ ] Gerar URLs públicas com expiração
- [ ] Validar tipo de arquivo (jpg, png, webp)
- [ ] Validar tamanho máximo (10MB)
- [ ] Organizar arquivos em pastas por tipo

### 11. Geração de Visualizações Preditivas
- [x] Criar tabela `heatmap_data` no banco
- [ ] Implementar mapa de calor com Google Maps
- [ ] Gerar diagramas de risco automaticamente
- [ ] Análise textual de padrões com LLM
- [ ] Criar visualizações baseadas em descrições

## Tarefas de Infraestrutura

### Banco de Dados
- [x] Criar schema em `drizzle/schema.ts`
- [x] Executar migrations com `pnpm db:push`
- [ ] Criar índices para performance

### Backend
- [x] Implementar todos os routers tRPC
- [x] Adicionar validações com Zod
- [x] Implementar autenticação com roles
- [ ] Integrar Google Vertex Vision AI
- [ ] Integrar Google Maps API
- [ ] Integrar Amazon S3
- [ ] Implementar notificações por email

### Frontend
- [x] Criar layout base com DashboardLayout
- [x] Implementar componentes de UI (AlertCard, InteractiveMap, etc)
- [x] Integrar Google Maps JavaScript API
- [ ] Criar formulários de upload
- [ ] Implementar gráficos com Recharts
- [x] Adicionar responsividade mobile

### Testes
- [ ] Testes unitários com Vitest
- [ ] Testes de integração para APIs
- [ ] Testes de upload de imagem
- [ ] Testes de análise de IA

### Documentação
- [ ] README.md com instruções de setup
- [ ] Documentação de API (endpoints tRPC)
- [ ] Guia de deployment
- [ ] Documentação de segurança
### Ativos Visuais
- [x] Logo do Sentinela das Águas
- [x] Ícones para tipos de alerta
- [x] Ícones para pontos de monitoramento
- [x] Ícone para heatmap
- [ ] Diagrama de arquitetura
- [ ] Screenshots de exemplo

## Status Geral
- **Total de itens:** 80+
- **Concluídos:** 35+
- **Em progresso:** 5+
- **Pendentes:** 40+
- **Progresso:** ~44%
