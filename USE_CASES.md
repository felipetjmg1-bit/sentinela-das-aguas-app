# Casos de Uso - Sentinela das Águas

## 📋 Índice de Casos de Uso

1. [Detecção Automática de Enchente](#caso-1-detecção-automática-de-enchente)
2. [Alerta em Tempo Real para Autoridades](#caso-2-alerta-em-tempo-real-para-autoridades)
3. [Notificação para Cidadãos](#caso-3-notificação-para-cidadãos)
4. [Análise Histórica e Planejamento](#caso-4-análise-histórica-e-planejamento)
5. [Inspeção de Infraestrutura](#caso-5-inspeção-de-infraestrutura)
6. [Integração com Sensores IoT](#caso-6-integração-com-sensores-iot)

---

## Caso 1: Detecção Automática de Enchente

### 🎯 Objetivo
Detectar automaticamente enchentes em tempo real usando análise de imagens com IA.

### 👥 Atores Envolvidos
- **Sistema de IA** (Google Vertex Vision)
- **Câmeras de Monitoramento** (CCTV públicas)
- **Banco de Dados** (Armazenamento de análises)

### 📝 Fluxo Principal

1. **Captura de Imagem**
   - Câmera CCTV em ponto crítico captura imagem a cada 30 segundos
   - Imagem é enviada para o Sentinela das Águas via API

2. **Análise com IA**
   - Google Vertex Vision AI analisa a imagem
   - Detecta padrões: nível de água, obstruções, velocidade do fluxo
   - Calcula score de risco (0-100%)

3. **Classificação de Alerta**
   - Score < 30%: Nenhuma ação
   - Score 30-50%: Alerta Baixo (monitoramento)
   - Score 50-75%: Alerta Médio (atenção)
   - Score 75-90%: Alerta Alto (preparação)
   - Score > 90%: Alerta Crítico (ação imediata)

4. **Armazenamento**
   - Resultado salvo em `ai_analysis_results`
   - Alerta criado em `alerts` se score > 30%
   - Histórico mantido para análise preditiva

### 📊 Exemplo de Resultado

```json
{
  "imageUrl": "https://s3.amazonaws.com/images/camera-001-2024-03-10.jpg",
  "analysisTimestamp": "2024-03-10T14:35:22Z",
  "detectedPatterns": {
    "flooding": 0.87,
    "water_level": 0.92,
    "obstruction": 0.45,
    "debris": 0.23
  },
  "confidenceScores": {
    "flooding": 0.89,
    "water_level": 0.94,
    "obstruction": 0.67,
    "debris": 0.45
  },
  "recommendedAlertLevel": "critical",
  "generatedAlertId": 1247
}
```

### ✅ Critérios de Sucesso
- Detecção em < 5 minutos
- Acurácia > 90%
- Falsos positivos < 5%
- Tempo de processamento < 30 segundos

---

## Caso 2: Alerta em Tempo Real para Autoridades

### 🎯 Objetivo
Notificar autoridades de Defesa Civil sobre enchentes críticas para ação imediata.

### 👥 Atores Envolvidos
- **Sistema** (Sentinela das Águas)
- **Autoridades** (Defesa Civil, Bombeiros)
- **Canais de Comunicação** (Email, Push, SMS)

### 📝 Fluxo Principal

1. **Detecção de Alerta Crítico**
   - Sistema detecta alerta com score > 90%
   - Verifica se já existe alerta ativo para a região

2. **Preparação de Notificação**
   - Coleta informações: coordenadas GPS, nível de severidade, descrição
   - Gera template de email com dados estruturados
   - Cria notificação push in-app

3. **Envio Multicanal**
   - **Email**: Enviado para lista de autoridades
   - **Push**: Notificação in-app com som
   - **SMS**: Opcional para casos críticos (futuro)

4. **Rastreamento**
   - Log de notificação salvo em `alert_notifications`
   - Status: pending → sent → viewed
   - Retry automático se falhar

### 📧 Template de Email

```
Assunto: 🚨 ALERTA CRÍTICO - Enchente Detectada

Nível de Severidade: CRÍTICO (92% de confiança)

Localização: Avenida Getúlio Vargas, Centro
Coordenadas GPS: -19.8234, -43.9456

Tipo de Alerta: Inundação detectada por IA
Hora do Alerta: 10/03/2024 às 14:35

Ações Recomendadas:
✓ Ativar protocolo de emergência
✓ Evacuar zona de risco (raio de 500m)
✓ Alertar cidadãos via sirenes
✓ Mobilizar equipes de resposta

Visualizar no Dashboard: [Link]
```

### ✅ Critérios de Sucesso
- Notificação enviada em < 2 minutos
- Taxa de entrega > 99%
- Visualização confirmada em < 10 minutos
- Autoridades conseguem acessar dashboard em < 30 segundos

---

## Caso 3: Notificação para Cidadãos

### 🎯 Objetivo
Informar cidadãos sobre enchentes em suas proximidades para evacuação segura.

### 👥 Atores Envolvidos
- **Cidadãos** (Usuários do app público)
- **Sistema** (Sentinela das Águas)
- **Plataforma de Push** (Firebase Cloud Messaging)

### 📝 Fluxo Principal

1. **Usuário Ativa Localização**
   - Cidadão abre app público e permite acesso à localização
   - Sistema registra coordenadas e raio de interesse (ex: 5km)

2. **Detecção de Alerta Próximo**
   - Alerta crítico é criado
   - Sistema verifica cidadãos dentro do raio
   - Filtra por nível de alerta (apenas crítico e alto)

3. **Envio de Notificação**
   - Push notification: "⚠️ Enchente crítica a 2km de você"
   - App exibe mapa com zona de risco
   - Sugestões de rotas de evacuação

4. **Acompanhamento**
   - Cidadão pode confirmar recebimento
   - Sistema rastreia engajamento
   - Feedback para melhorar alertas

### 📱 Notificação no App

```
┌─────────────────────────────────┐
│ ⚠️  ALERTA DE ENCHENTE          │
│                                 │
│ Enchente crítica detectada      │
│ a 2.3 km de você               │
│                                 │
│ Local: Rua das Flores          │
│ Nível: CRÍTICO                 │
│ Confiança: 92%                 │
│                                 │
│ [Ver no Mapa] [Rota Segura]   │
└─────────────────────────────────┘
```

### ✅ Critérios de Sucesso
- Notificação enviada em < 3 minutos
- Taxa de abertura > 85%
- Cidadãos conseguem se evacuar com segurança
- Feedback positivo > 80%

---

## Caso 4: Análise Histórica e Planejamento

### 🎯 Objetivo
Analisar dados históricos de enchentes para planejamento urbano e previsão.

### 👥 Atores Envolvidos
- **Analistas** (Defesa Civil, Prefeitura)
- **Sistema** (Relatórios e Gráficos)
- **Banco de Dados** (Histórico de 5+ anos)

### 📝 Fluxo Principal

1. **Coleta de Dados**
   - Sistema agrega alertas dos últimos 5 anos
   - Agrupa por região, período, nível de severidade
   - Calcula estatísticas: frequência, duração, impacto

2. **Geração de Relatórios**
   - Relatório Mensal: Tendências do mês
   - Relatório Anual: Análise completa do ano
   - Relatório Preditivo: Previsão para próximos 30 dias

3. **Visualizações**
   - Mapa de Calor: Regiões com maior risco
   - Gráfico de Tendência: Evolução ao longo do tempo
   - Gráfico de Sazonalidade: Padrões por estação

4. **Insights Gerados**
   - Regiões críticas que precisam de drenagem
   - Períodos de maior risco
   - Efetividade de medidas preventivas

### 📊 Exemplo de Relatório

```
RELATÓRIO ANUAL - 2023

Total de Alertas: 247
├─ Críticos: 12 (5%)
├─ Altos: 45 (18%)
├─ Médios: 89 (36%)
└─ Baixos: 101 (41%)

Região Mais Afetada: Centro (89 alertas)
Período Crítico: Dezembro-Janeiro (120 alertas)

Recomendações:
1. Ampliar drenagem no Centro
2. Implementar sistema de alerta em 5 novos pontos
3. Realizar limpeza preventiva em setembro
```

### ✅ Critérios de Sucesso
- Relatórios gerados automaticamente
- Insights acionáveis para planejamento
- Redução de 30% em enchentes no ano seguinte
- ROI de R$ 5M em investimentos preventivos

---

## Caso 5: Inspeção de Infraestrutura

### 🎯 Objetivo
Registrar inspeções de bueiros e drenagens com histórico completo.

### 👥 Atores Envolvidos
- **Inspetores** (Técnicos de Defesa Civil)
- **Sistema** (Formulário de Inspeção)
- **Armazenamento** (S3 para fotos)

### 📝 Fluxo Principal

1. **Inspetor Acessa Formulário**
   - Seleciona ponto de monitoramento (bueiro/drenagem)
   - Preenche data e hora da inspeção

2. **Coleta de Dados**
   - Status: Operacional / Manutenção / Bloqueado / Inundado
   - Achados: Descreve obstruções, danos, nível de água
   - Fotos: Captura 3-5 fotos do local

3. **Upload de Fotos**
   - Fotos validadas (JPG, PNG, max 10MB)
   - Enviadas para S3 com nomes estruturados
   - URLs públicas geradas com expiração de 24h

4. **Armazenamento**
   - Inspeção salva em `inspections`
   - Histórico vinculado ao `monitoring_point`
   - Status do ponto atualizado

### 📸 Exemplo de Inspeção

```
Ponto: Bueiro Avenida Getúlio Vargas
Data: 10/03/2024
Status: Bloqueado
Achados: Acúmulo de detritos, folhas e galhos
Necessita Manutenção: Sim

Fotos:
- s3://bucket/inspections/bueiro-001-photo-1.jpg
- s3://bucket/inspections/bueiro-001-photo-2.jpg
- s3://bucket/inspections/bueiro-001-photo-3.jpg

Próxima Inspeção Recomendada: 15/03/2024
```

### ✅ Critérios de Sucesso
- Inspeção registrada em < 10 minutos
- Fotos carregadas com sucesso
- Histórico completo acessível
- Redução de 50% em tempo de manutenção

---

## Caso 6: Integração com Sensores IoT

### 🎯 Objetivo
Conectar sensores de nível de água, pluviômetros e câmeras para monitoramento contínuo.

### 👥 Atores Envolvidos
- **Sensores IoT** (Nível de água, pluviômetro, temperatura)
- **Gateway IoT** (Raspberry Pi, Arduino)
- **API Sentinela** (Recepção de dados)

### 📝 Fluxo Principal

1. **Configuração de Sensor**
   - Sensor registrado no sistema
   - Credenciais de API geradas
   - Intervalo de envio configurado (ex: a cada 5 minutos)

2. **Envio de Dados**
   - Sensor coleta métrica (nível de água em cm)
   - Envia para API via MQTT ou HTTP
   - Sistema valida e armazena

3. **Análise em Tempo Real**
   - Dados comparados com histórico
   - Alertas gerados se ultrapassar threshold
   - Gráficos atualizados em tempo real

4. **Correlação com IA**
   - Dados de sensor + análise de imagem
   - Confirmação de enchente com 2 fontes
   - Reduz falsos positivos

### 📡 Exemplo de Payload IoT

```json
{
  "sensorId": "sensor-001",
  "sensorType": "water_level",
  "location": {
    "latitude": -19.8234,
    "longitude": -43.9456
  },
  "metrics": {
    "waterLevel": 145,
    "waterLevelUnit": "cm",
    "threshold": 150,
    "timestamp": "2024-03-10T14:35:22Z"
  },
  "status": "warning"
}
```

### ✅ Critérios de Sucesso
- Dados recebidos em < 30 segundos
- Uptime > 99.9%
- Integração com 100+ sensores
- Redução de 80% em falsos positivos

---

## 📊 Resumo de Impacto

| Caso de Uso | Benefício | Métrica |
|------------|----------|---------|
| Detecção Automática | Resposta rápida | < 5 min |
| Alerta para Autoridades | Ação imediata | < 2 min |
| Notificação para Cidadãos | Evacuação segura | < 3 min |
| Análise Histórica | Planejamento | 30% redução |
| Inspeção | Manutenção eficiente | 50% redução |
| Sensores IoT | Confirmação de dados | 80% redução falsos |

---

**Sentinela das Águas** - Casos de uso que salvam vidas. 🌊🛡️
