# C2W Connect2Work — Banco de Dados Mock

> Estrutura **provisória** para testes locais de autenticação. Os dados persistem no `localStorage` do navegador.  
> Quando a integração com Firebase for feita, a estrutura definitiva será documentada em `DATABASE_STRUCTURE.md` (separado).

Implementação: `coworking-site/assets/js/mocks/database.js`

## MockUser
<!-- Estrutura de dados de um usuário cadastrado no mock (equivalente a um registro de conta). -->

- Descrição: usuário cadastrado localmente para simular conta autenticável
- Campos: `id` (string), `name` (string), `email` (string), `password` (string — apenas no mock), `createdAt` (string ISO), `profession` (string, opcional), `phone` (string, opcional)
- Armazenamento: `c2w_mock_users`
- Status: temporário (mock) — será migrado para Firebase Auth + Firestore

## MockSession
<!-- Estrutura de dados da sessão ativa: o que fica salvo quando um usuário está logado (sem incluir a senha). -->

- Descrição: sessão do usuário logado (sem senha)
- Campos: `id`, `name`, `email`, `createdAt`, `profession?`, `phone?`
- Armazenamento: `c2w_mock_session`
- Status: temporário (mock) — será migrado para Firebase Auth

## PasswordResetRequest
<!-- Estrutura de dados que registra uma tentativa de redefinição de senha, simulando o que o Firebase faria ao enviar um e-mail de reset. -->

- Descrição: registro de solicitação de redefinição de senha simulada
- Campos: `email` (string), `requestedAt` (string ISO), `userExists` (boolean)
- Armazenamento: `c2w_mock_password_resets`
- Status: temporário (mock) — será substituído por Firebase `sendPasswordResetEmail`

## Funções expostas
<!-- Funções que o arquivo mock disponibiliza para as páginas usarem, e em qual script de página cada uma é consumida. -->

- `registerUser` — usado em `assets/js/pages/cadastro.js` quando Firebase não está configurado
- `loginUser` — usado em `assets/js/pages/login.js` quando Firebase não está configurado
- `getCurrentUser` — usado em `assets/js/pages/unidades.js` e disponível para demais telas autenticadas
- `logoutUser` — disponível para encerrar sessão mock
- `resetPassword` — usado em `assets/js/pages/recuperar-senha.js` quando Firebase não está configurado
- `updatePassword` — uso manual via console para simular conclusão do reset

## Usuário de teste (seed)
<!-- Conta pré-criada automaticamente para facilitar testes manuais, sem precisar cadastrar um usuário novo toda hora. -->

- E-mail: `teste@connect2work.com`
- Senha: `123456`
- Criado automaticamente na primeira carga do mock

## Códigos de erro (compatíveis com Firebase)
<!-- Códigos de erro usados no mock que espelham os códigos reais do Firebase Auth, para que o front-end funcione igual antes e depois da migração. -->

- `auth/email-already-in-use` — cadastro com e-mail duplicado
- `auth/invalid-credential` — login com credenciais inválidas
- `auth/user-not-found` — `updatePassword` para e-mail inexistente

Mensagens exibidas nas telas via `mapAuthError` em `assets/js/services/auth-service.js`.