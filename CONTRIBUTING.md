# Guia de Contribuição - Sentinela das Águas

## 🎯 Bem-vindo!

Obrigado por considerar contribuir para o **Sentinela das Águas**! Este documento fornece diretrizes e instruções para contribuir com o projeto.

---

## 📋 Código de Conduta

### Nossa Promessa

Estamos comprometidos em fornecer um ambiente acolhedor e inclusivo para todos, independentemente de idade, tamanho do corpo, deficiência, etnia, identidade de gênero, nível de experiência, nacionalidade, aparência pessoal, raça, religião ou identidade e orientação sexual.

### Nossos Padrões

Exemplos de comportamento que contribuem para criar um ambiente positivo incluem:

- Usar linguagem acolhedora e inclusiva
- Ser respeitoso com pontos de vista e experiências diferentes
- Aceitar críticas construtivas com graça
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros da comunidade

Exemplos de comportamento inaceitável incluem:

- Uso de linguagem ou imagens sexualizadas
- Ataques pessoais
- Trolling ou comentários insultuosos
- Assédio público ou privado
- Publicação de informações privadas de outros

---

## 🚀 Como Contribuir

### 1. Reportar Bugs

Antes de criar um relatório de bug, verifique a lista de issues, pois você pode descobrir que o bug já foi relatado.

**Como Enviar um Bom Relatório de Bug:**

- Use um título claro e descritivo
- Descreva os passos exatos para reproduzir o problema
- Forneça exemplos específicos para demonstrar os passos
- Descreva o comportamento observado e o que você esperava ver
- Inclua screenshots se possível
- Mencione sua versão do Node.js, SO e navegador

### 2. Sugerir Melhorias

Sugestões de melhorias são sempre bem-vindas! Ao criar uma sugestão de melhoria, inclua:

- Use um título claro e descritivo
- Forneça uma descrição detalhada da melhoria sugerida
- Liste alguns exemplos de como essa melhoria seria usada
- Mencione outros projetos que implementam essa funcionalidade

### 3. Pull Requests

- Siga o guia de estilo TypeScript/React
- Inclua testes apropriados
- Atualize a documentação conforme necessário
- Termine todos os arquivos com uma nova linha

---

## 🔧 Processo de Desenvolvimento

### Setup Local

```bash
# Clonar repositório
git clone https://github.com/felipetjmg1-bit/sentinela-das-aguas-app.git
cd sentinela-das-aguas-app

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Executar migrations
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Branches

- `main` - Produção (protegido)
- `develop` - Desenvolvimento
- `feature/*` - Novas funcionalidades
- `fix/*` - Correções de bugs
- `docs/*` - Documentação

### Commits

Siga o padrão Conventional Commits:

```
<tipo>(<escopo>): <assunto>

<corpo>

<rodapé>
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação, sem mudança de código
- `refactor`: Refatoração de código
- `perf`: Melhorias de performance
- `test`: Adição ou atualização de testes
- `chore`: Atualização de dependências

**Exemplo:**
```
feat(alerts): add critical alert notification

- Implement email notification for critical alerts
- Add push notification support
- Update alert schema with notification tracking

Closes #123
```

### Pull Request

1. Faça fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat(feature): add amazing feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

**Template de PR:**

```markdown
## Descrição
Breve descrição do que foi feito.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Atualização de documentação

## Como Testar
Passos para testar a mudança.

## Checklist
- [ ] Meu código segue o guia de estilo
- [ ] Executei `pnpm test` e todos os testes passam
- [ ] Adicionei testes para novas funcionalidades
- [ ] Atualizei a documentação
- [ ] Sem mudanças de breaking
```

---

## 📝 Guia de Estilo

### TypeScript

```typescript
// ✅ Bom
interface User {
  id: number;
  name: string;
  email: string;
}

const getUser = (id: number): Promise<User> => {
  // ...
};

// ❌ Ruim
interface user {
  id: number;
  name: string;
}

const getuser = (id) => {
  // ...
};
```

### React

```typescript
// ✅ Bom
interface UserCardProps {
  user: User;
  onDelete: (id: number) => void;
}

export default function UserCard({ user, onDelete }: UserCardProps) {
  return (
    <div className="card">
      <h2>{user.name}</h2>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  );
}

// ❌ Ruim
export default function UserCard(props) {
  return (
    <div>
      <h2>{props.user.name}</h2>
      <button onClick={() => props.onDelete(props.user.id)}>Delete</button>
    </div>
  );
}
```

### Testes

```typescript
// ✅ Bom
describe("alerts router", () => {
  it("should get active alerts", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.alerts.getActive();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ❌ Ruim
describe("alerts", () => {
  it("works", async () => {
    const result = await getAlerts();
    expect(result).toBeTruthy();
  });
});
```

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
pnpm test

# Com cobertura
pnpm test:coverage

# Em modo watch
pnpm test:watch

# Testes específicos
pnpm test alerts.test.ts
```

### Cobertura Mínima

- **Linhas**: 80%
- **Branches**: 75%
- **Funções**: 80%
- **Statements**: 80%

### Escrevendo Testes

```typescript
import { describe, expect, it } from "vitest";

describe("feature", () => {
  it("should do something", () => {
    // Arrange
    const input = "test";

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe("expected");
  });

  it("should handle errors", () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

---

## 📚 Documentação

### Atualizar README

Se sua mudança afeta como usuários usam o projeto, atualize o README.md.

### Adicionar Comentários

```typescript
// ✅ Bom - Explica o porquê
// Retry com backoff exponencial para evitar rate limiting
const retryWithBackoff = async (fn, maxRetries = 3) => {
  // ...
};

// ❌ Ruim - Óbvio
// Incrementar contador
counter++;
```

### JSDoc

```typescript
/**
 * Analisa uma imagem para detectar padrões de enchente
 * @param imageUrl - URL da imagem a analisar
 * @param monitoringPointId - ID do ponto de monitoramento
 * @returns Resultado da análise com padrões detectados
 * @throws Erro se a imagem for inválida
 */
export const analyzeImage = async (
  imageUrl: string,
  monitoringPointId: number
): Promise<AnalysisResult> => {
  // ...
};
```

---

## 🔍 Revisão de Código

### O que Procuramos

- ✅ Código limpo e legível
- ✅ Testes com boa cobertura
- ✅ Documentação atualizada
- ✅ Sem breaking changes
- ✅ Performance otimizada
- ✅ Segurança considerada

### Feedback

Feedback é dado de forma construtiva e respeitosa. Se você receber críticas, lembre-se de que é sobre o código, não sobre você!

---

## 🚀 Processo de Release

1. Atualizar versão em `package.json`
2. Atualizar `CHANGELOG.md`
3. Criar tag Git (`git tag v1.0.0`)
4. Fazer merge para `main`
5. Criar release no GitHub

---

## 📞 Perguntas?

- Abra uma issue com a tag `question`
- Discuta em discussions
- Entre em contato: suporte@impulsocorp.com.br

---

## 🙏 Agradecimentos

Obrigado por contribuir para tornar o Sentinela das Águas melhor! 🌊

---

**Sentinela das Águas** - Construído pela comunidade, para a comunidade. ❤️
