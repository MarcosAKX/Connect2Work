# C2W Connect2Work — Estrutura do Projeto

Aplicação em `coworking-site/`.

## Páginas
<!-- Lista as telas HTML do site: onde cada arquivo fica, qual rota acessa e o que a página faz. -->

- `coworking-site/pages/login.html` — `/pages/login.html` — Autenticação por credenciais ou Google; redireciona após login.
- `coworking-site/pages/cadastro.html` — `/pages/cadastro.html` — Registro de conta com dados de perfil e persistência no Firestore.
- `coworking-site/pages/recuperar-senha.html` — `/pages/recuperar-senha.html` — Envio de link de redefinição de senha por e-mail via Firebase.
- `coworking-site/pages/unidades.html` — `/pages/unidades.html` — Listagem de unidades de coworking para seleção pós-login.
- `coworking-site/pages/meus-agendamentos.html` — `/pages/meus-agendamentos.html` — Listagem de agendamentos do usuário com tabs e estado vazio.
- `coworking-site/pages/salas.html` — `/pages/salas?unidade={id}` — Listagem de salas da unidade selecionada para agendamento. **Rota acessada sem `.html`** (ver nota na convenção de nomenclatura abaixo).

## Componentes reutilizáveis
<!-- Arquivos de CSS e JS que não pertencem a uma única página, e sim são compartilhados entre várias telas (estilos base, scripts de fundo animado, serviços de autenticação, dados mockados, validações etc.). -->

- `coworking-site/assets/css/base.css` — Reset, variáveis globais e tipografia; importado em todas as páginas.
- `coworking-site/assets/css/components.css` — Card, campos, botões, divisor, links e app shell (header autenticado); usado nas telas de autenticação e páginas pós-login.
- `coworking-site/assets/css/pages/login.css` — Layout, fundo e decoração das telas de autenticação; base compartilhada com cadastro e recuperar senha.
- `coworking-site/assets/css/pages/recuperar-senha.css` — Estado de sucesso e ajustes do card de recuperação de senha.
- `coworking-site/assets/css/pages/unidades.css` — Grid de unidades e seção de benefícios; hover nos cards (translateY, accent, sombra), glow pulsante no fallback e container de imagem com `object-fit: cover`.
- `coworking-site/assets/css/pages/meus-agendamentos.css` — Cabeçalho da página, tabs, estado vazio e aviso de política de cancelamento.
- `coworking-site/assets/css/pages/salas.css` — Resumo da unidade, grid de salas, badge de preço, tags de comodidades e fallback de imagem.
- `coworking-site/assets/js/components/network-canvas.js` — Fundo animado em canvas; inicializado em login, cadastro e recuperar senha.
- `coworking-site/assets/js/services/auth-service.js` — Login, registro, reset de senha, OAuth e mapeamento de erros Firebase; consumido pelos scripts de página.
- `coworking-site/assets/js/mocks/database.js` — Banco mock em localStorage para autenticação local; usado quando Firebase não está configurado.
- `coworking-site/assets/js/mocks/units.js` — Dados mockados de unidades de coworking (incl. `imageUrl`, `description`); usado em `unidades.js` e `salas.js`.
- `coworking-site/assets/js/mocks/bookings.js` — Dados mockados de agendamentos (`bookings` em localStorage); usado em `meus-agendamentos.js`.
- `coworking-site/assets/js/mocks/rooms.js` — Dados mockados de salas por unidade (incl. `imageUrl`); usado em `salas.js`.
- `coworking-site/assets/js/utils/validators.js` — Regras e mensagens de validação de formulário; usado em login, cadastro e recuperar senha.

## Padrões do projeto
<!-- Regras e convenções que devem ser seguidas em todo o projeto: cores, nomes de arquivos/classes e a stack tecnológica usada. -->

**Paleta de cores** (`:root` em `base.css`):
<!-- Variáveis CSS centralizadas que definem as cores do site, agrupadas por função (fundo/superfície, texto, cor de marca, estados de erro/sucesso). -->
- Superfícies: `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-border`, `--color-border-hover`
- Texto: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`
- Marca: `--color-accent`, `--color-accent-hover`, `--color-accent-text`
- Estado: `--color-error`, `--color-success`

**Convenção de nomenclatura**
<!-- Como nomear e organizar arquivos e classes CSS para manter consistência em todo o projeto. -->
- Arquivos em kebab-case (`login.html`, `auth-service.js`, `network-canvas.js`)
- Páginas em `pages/`; CSS global em `assets/css/`, estilos por página em `assets/css/pages/`
- JS por página em `assets/js/pages/`; módulos compartilhados em `components/`, `services/`, `utils/` e `config/`
- Classes CSS em kebab-case com BEM leve para variações (`login-glow--top`, `btn-primary`)
- **Exceção intencional**: links internos para `salas.html` usam a rota sem extensão (`salas?unidade=...`), pois o servidor de desenvolvimento (`serve`) faz um redirect 301 de `salas.html` para `/salas` que remove a query string, quebrando o parâmetro `unidade`. Não reverter esse link para `.html`. Revalidar esse comportamento ao configurar o hosting de produção (Firebase Hosting, Netlify etc.), pois o redirecionamento pode se comportar diferente lá.

**Stack**
<!-- Tecnologias e ferramentas usadas na construção do projeto. -->
- HTML estático, sem framework de UI
- CSS vanilla com custom properties e `@import` de Google Fonts
- JavaScript ES modules (vanilla), um script por página
- Firebase Auth e Firestore via CDN (`firebase-auth`, `firebase-firestore`)
- Fontes: Space Grotesk (títulos), Inter (corpo)