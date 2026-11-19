# Operações e níveis de serviço — Sentinela das Águas

## Estado atual

Este repositório contém um **protótipo**, não um serviço de produção com operação contratada. Não há evidência neste repositório de equipe de plantão, monitoramento 24/7, infraestrutura redundante, testes de recuperação, métricas históricas ou compromisso comercial de disponibilidade.

Por isso, os números de uptime, latência, throughput, usuários simultâneos, tempos de resposta e créditos de serviço não são apresentados como garantias. Qualquer SLA futuro deverá ser aprovado, medido e formalizado antes de ser oferecido a clientes.

## Operação no estágio de protótipo

- Executar em ambiente de desenvolvimento isolado.
- Usar dados sintéticos ou anonimizados.
- Não depender desta aplicação para alertas públicos de emergência.
- Monitorar logs e falhas durante testes, sem registrar segredos ou dados pessoais desnecessários.
- Registrar versão, ambiente, configuração e resultado de cada teste.

## Requisitos para futura operação

Antes de um piloto controlado, definir:
1. responsáveis e canais de suporte;
2. monitoramento de disponibilidade, erros e latência;
3. backup, restauração e objetivos RTO/RPO demonstrados;
4. gestão de incidentes e comunicação;
5. limites de capacidade medidos em testes reproduzíveis;
6. política de manutenção e janela de atualização;
7. SLA contratual, caso exista oferta comercial.

## Modelo de métricas a medir

| Métrica | Estado |
|---|---|
| Disponibilidade | Não medida em produção |
| Latência P50/P95/P99 | Não medida em produção |
| Throughput | Não medido |
| Usuários simultâneos | Não medido |
| RTO/RPO | Não estabelecidos por teste |
| Cobertura de plantão | Não estabelecida |

**Aviso:** este documento não constitui SLA, garantia de serviço ou promessa de suporte. Atualize-o somente com medições e compromissos aprovados e verificáveis.
