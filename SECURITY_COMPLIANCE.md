# Segurança, privacidade e conformidade — Sentinela das Águas

## Estado deste documento

Este arquivo é uma orientação de desenvolvimento para um **protótipo**, não uma declaração de conformidade, certificação ou auditoria. A inspeção do repositório não fornece evidência de certificação ISO 27001, relatório SOC 2, designação formal de DPO, AIPD concluída, criptografia AES-256 implementada, AWS KMS, S3, TLS 1.3 ou controles completos de LGPD/GDPR. Qualquer declaração desse tipo exige documentação verificável, escopo, entidade certificadora e validade.

## Princípios para evolução

- Coletar somente dados necessários e preferir dados sintéticos durante desenvolvimento.
- Não inserir credenciais, tokens, dados pessoais ou dados de localização sensíveis em código, issues ou logs.
- Definir finalidade, base legal, retenção, controle de acesso e processo de atendimento aos titulares antes de qualquer piloto com dados reais.
- Proteger segredos por variáveis de ambiente e serviço de gerenciamento de segredos apropriado ao ambiente de implantação.
- Usar HTTPS/TLS na implantação; a configuração local de desenvolvimento não comprova TLS.
- Implementar criptografia em repouso e gestão de chaves somente com biblioteca/serviço apropriado, revisão técnica e testes documentados.
- Restringir acesso administrativo, registrar eventos relevantes sem expor dados sensíveis e testar autorização em cada endpoint.

## Situação verificável

O README classifica o sistema como protótipo web. A documentação e os componentes visíveis não comprovam implantação de produção, infraestrutura redundante, monitoramento 24/7, criptografia de dados em repouso, segregação por tenant ou controles certificados. Trate esses itens como requisitos futuros, não como funcionalidades disponíveis.

## LGPD

A aplicação não deve ser considerada pronta para tratar dados pessoais reais até que sejam definidos e verificados: controlador e operadores, finalidade e base legal, aviso de privacidade, minimização, retenção e descarte, atendimento aos direitos dos titulares, gestão de incidentes e contratos com operadores. Uma avaliação jurídica e técnica deve preceder qualquer operação real.

## Certificações

Nenhuma certificação ISO 27001 ou SOC 2 é declarada neste documento. Não use selos, logotipos ou alegações de conformidade sem certificado ou relatório autêntico, vigente e aplicável ao escopo do serviço.

## Plano mínimo antes de um piloto

1. Revisar autenticação, autorização e gestão de sessão.
2. Verificar validação de entrada, rate limiting, CORS e cabeçalhos de segurança.
3. Definir armazenamento, criptografia, backup e restauração com evidências de teste.
4. Criar modelo de ameaças e política de resposta a incidentes.
5. Executar análise de dependências, testes automatizados e revisão independente.
6. Documentar os resultados, limitações e riscos residuais.

**Aviso:** não utilize este protótipo para monitoramento operacional de emergência, decisões críticas ou proteção de pessoas sem validação, implantação e supervisão adequadas.
