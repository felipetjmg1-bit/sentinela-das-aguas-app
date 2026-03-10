# Guia de Deployment - Sentinela das Águas

## 🚀 Deployment na Manus

O Sentinela das Águas está pronto para deployment na plataforma Manus. Siga os passos abaixo:

### 1. Criar Checkpoint

Antes de fazer deploy, crie um checkpoint do projeto:

```bash
# No Management UI, clique em "Publish" para criar um checkpoint
```

### 2. Configurar Variáveis de Ambiente

Acesse o painel de **Settings > Secrets** e configure:

#### Banco de Dados
- `DATABASE_URL`: MySQL connection string (já configurado)

#### Google Cloud (Vertex Vision AI)
- `GOOGLE_VERTEX_PROJECT_ID`: ID do seu projeto Google Cloud
- `GOOGLE_VERTEX_API_KEY`: Chave da API do Vertex Vision AI

#### Google Maps
- `GOOGLE_MAPS_API_KEY`: Chave da API do Google Maps

#### Amazon S3
- `AWS_ACCESS_KEY_ID`: Chave de acesso AWS
- `AWS_SECRET_ACCESS_KEY`: Chave secreta AWS
- `AWS_S3_BUCKET`: Nome do bucket S3
- `AWS_REGION`: Região AWS (ex: us-east-1)

#### Email (SendGrid)
- `SENDGRID_API_KEY`: Chave da API SendGrid
- `SENDGRID_FROM_EMAIL`: Email de origem

### 3. Publicar Projeto

1. Clique no botão **Publish** no Management UI
2. Escolha o domínio personalizado ou use o domínio padrão
3. Aguarde o deployment completar

### 4. Acessar a Aplicação

Após o deployment, acesse:
- **Dashboard Admin**: `https://seu-dominio.com/dashboard`
- **Painel Público**: `https://seu-dominio.com/alerts`

---

## 🔧 Deployment Local (Desenvolvimento)

Para testar localmente antes de fazer deploy:

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Executar migrations
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev

# Acessar em http://localhost:3000
```

---

## 📦 Build para Produção

```bash
# Build do projeto
pnpm build

# Iniciar servidor de produção
pnpm start
```

---

## 🔐 Segurança em Produção

### HTTPS
- Todos os endpoints devem usar HTTPS
- Certificados SSL/TLS são gerenciados automaticamente pela Manus

### Autenticação
- OAuth 2.0 via Manus
- Tokens JWT com expiração de 24h
- Refresh tokens para sessões prolongadas

### Proteção de Dados
- Senhas nunca são armazenadas (OAuth)
- Dados sensíveis criptografados em repouso
- Comunicação criptografada em trânsito

### Rate Limiting
- 100 requisições/minuto por usuário
- 1000 requisições/minuto por IP

---

## 📊 Monitoramento

### Logs
- Acesse os logs via Management UI > Dashboard
- Logs são retidos por 30 dias

### Métricas
- Visualize estatísticas de uso no Dashboard
- Monitore tempo de resposta das APIs

### Alertas
- Configure alertas para erros críticos
- Notificações enviadas para email do owner

---

## 🔄 Atualizações

Para atualizar o projeto:

1. Faça as alterações no código
2. Crie um novo checkpoint
3. Clique em "Publish" novamente
4. O deployment será atualizado automaticamente

---

## 🆘 Troubleshooting

### Erro: "Cannot find module"
- Execute `pnpm install` para reinstalar dependências
- Verifique se todos os arquivos estão presentes

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está configurado corretamente
- Teste a conexão com `pnpm db:push`

### Erro: "Google Vertex API not available"
- Verifique se `GOOGLE_VERTEX_PROJECT_ID` e `GOOGLE_VERTEX_API_KEY` estão configurados
- Confirme que a API está habilitada no Google Cloud Console

### Erro: "S3 upload failed"
- Verifique credenciais AWS (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
- Confirme que o bucket existe e está acessível
- Verifique permissões IAM

---

## 📞 Suporte

Para problemas com deployment, entre em contato:
- Email: suporte@impulsocorp.com.br
- Documentação: https://docs.manus.im
- Status: https://status.manus.im

---

## 🎯 Próximos Passos

Após o deployment inicial:

1. **Testar em Produção**
   - Criar alertas de teste
   - Verificar notificações por email
   - Testar upload de fotos

2. **Configurar Backups**
   - Ativar backups automáticos do banco de dados
   - Configurar retenção de 30 dias

3. **Monitorar Performance**
   - Verificar tempo de resposta das APIs
   - Monitorar uso de banda do S3
   - Analisar logs de erro

4. **Treinar Usuários**
   - Documentar fluxos de uso
   - Criar vídeos tutoriais
   - Realizar sessões de treinamento

---

**Sentinela das Águas** - Pronto para produção! 🚀
