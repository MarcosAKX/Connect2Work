# C2W Connect2Work — Funcionalidades

Referência rápida de comportamento e regras de negócio. Aplicação em `coworking-site/`.

## Autenticação
<!-- Tudo relacionado a login, cadastro, recuperação de senha e sessão do usuário. -->

- Login por e-mail/senha: implementado (mock local) — `assets/js/pages/login.js`, `assets/js/mocks/database.js`
- Login via Google OAuth: implementado — `assets/js/pages/login.js`, `assets/js/services/auth-service.js` (requer Firebase configurado)
- Cadastro de conta com e-mail e senha: implementado (mock local) — `assets/js/pages/cadastro.js`, `assets/js/mocks/database.js`
- Recuperação de senha por e-mail: implementado (mock local) — `assets/js/pages/recuperar-senha.js`, `assets/js/mocks/database.js`
- Sessão mock com `getCurrentUser` e `logoutUser`: implementado (mock local) — `assets/js/mocks/database.js`
- Redefinição de senha simulada via `updatePassword`: implementado (mock local) — `assets/js/mocks/database.js`
- Mapeamento de erros Firebase para mensagens em português: implementado — `assets/js/services/auth-service.js`
- Redirecionamento pós-login para listagem de unidades: implementado — `assets/js/pages/login.js`, `pages/unidades.html`

## Perfil de usuário
<!-- Dados do usuário além da autenticação: nome, profissão, telefone e onde essas informações são criadas ou exibidas. -->

- Criação de perfil no cadastro (nome, e-mail, profissão, telefone): implementado (mock local) — `assets/js/mocks/database.js`
- Criação de perfil no cadastro via Firestore: implementado — `assets/js/services/auth-service.js` (requer Firebase configurado)
- Atualização de displayName no Firebase Auth: implementado — `assets/js/services/auth-service.js`
- Exibição do usuário logado no header: implementado (mock local) — `assets/js/pages/unidades.js`, `assets/js/mocks/database.js`
- Consulta ou edição de perfil após cadastro: planejado

## Validação de formulários
<!-- Regras de validação aplicadas nos campos dos formulários (e-mail, senha, telefone etc.) e onde essas regras estão implementadas. -->

- Validação de identificador no login (e-mail ou usuário): implementado — `assets/js/utils/validators.js`
- Validação de e-mail no cadastro e recuperação de senha: implementado — `assets/js/utils/validators.js`
- Validação de nome completo (mínimo nome e sobrenome): implementado — `assets/js/utils/validators.js`
- Validação de profissão: implementado — `assets/js/utils/validators.js`
- Validação de telefone brasileiro (DDD, fixo e celular): implementado — `assets/js/utils/validators.js`
- Validação de senha e confirmação de senha: implementado — `assets/js/utils/validators.js`
- Máscara automática de telefone durante digitação: implementado — `assets/js/utils/validators.js`, `assets/js/pages/cadastro.js`
- Validação progressiva em blur e input: implementado — `assets/js/pages/login.js`, `assets/js/pages/cadastro.js`, `assets/js/pages/recuperar-senha.js`

## Integrações
<!-- Conexões com serviços externos ou fontes de dados: o mock local, dados de unidades e a configuração do Firebase. -->

- Banco mock em localStorage para autenticação: implementado — `assets/js/mocks/database.js`
- Dados mockados de unidades de coworking: implementado — `assets/js/mocks/units.js`
- Configuração de Firebase Auth e Firestore: parcial — `assets/js/config/firebase.js` (template; requer preenchimento manual)
- Detecção automática de Firebase configurado vs modo mock: implementado — `assets/js/config/firebase.js`, `assets/js/services/auth-service.js`

## Agendamento de salas
<!-- Funcionalidade de escolher uma unidade e reservar espaços/horários — parte já pronta (listagem) e parte ainda planejada (reserva em si). -->

- Listagem de unidades de coworking: implementado (mock local) — `assets/js/pages/unidades.js`, `assets/js/mocks/units.js`
- Seleção de unidade para agendamento: parcial — `pages/unidades.html` (layout pronto; navegação do card ainda não implementada)
- Reserva e agendamento de salas: planejado
- Gestão de disponibilidade e horários: planejado
- Página "Meus Agendamentos": planejado

## Pagamentos
<!-- Funcionalidade de cobrança pelas reservas — ainda não iniciada, apenas planejada. -->

- Cobrança de reservas: planejado
- Integração com gateway de pagamento: planejado