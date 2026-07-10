# C2W Connect2Work — Banco de Dados Mock

> Estrutura **provisória** para testes locais de autenticação. Os dados persistem no `localStorage` do navegador.  
> Quando a integração com Firebase for feita, a estrutura definitiva será documentada em `DATABASE_STRUCTURE.md` (separado).

Implementação: `coworking-site/assets/js/mocks/database.js`

## MockUser

- Descrição: usuário cadastrado localmente para simular conta autenticável
- Campos: `id` (string), `name` (string), `email` (string), `password` (string — apenas no mock), `createdAt` (string ISO), `profession` (string, opcional), `phone` (string, opcional)
- Armazenamento: `c2w_mock_users`
- Status: temporário (mock) — será migrado para Firebase Auth + Firestore

## MockSession

- Descrição: sessão do usuário logado (sem senha)
- Campos: `id`, `name`, `email`, `createdAt`, `profession?`, `phone?`
- Armazenamento: `c2w_mock_session`
- Status: temporário (mock) — será migrado para Firebase Auth

## PasswordResetRequest

- Descrição: registro de solicitação de redefinição de senha simulada
- Campos: `email` (string), `requestedAt` (string ISO), `userExists` (boolean)
- Armazenamento: `c2w_mock_password_resets`
- Status: temporário (mock) — será substituído por Firebase `sendPasswordResetEmail`

## Funções expostas

- `registerUser` — usado em `assets/js/pages/cadastro.js` quando Firebase não está configurado
- `loginUser` — usado em `assets/js/pages/login.js` quando Firebase não está configurado
- `getCurrentUser` — usado em `assets/js/pages/unidades.js` e disponível para demais telas autenticadas
- `logoutUser` — disponível para encerrar sessão mock
- `resetPassword` — usado em `assets/js/pages/recuperar-senha.js` quando Firebase não está configurado
- `updatePassword` — uso manual via console para simular conclusão do reset

## Usuário de teste (seed)

- E-mail: `teste@connect2work.com`
- Senha: `123456`
- Criado automaticamente na primeira carga do mock

## Códigos de erro (compatíveis com Firebase)

- `auth/email-already-in-use` — cadastro com e-mail duplicado
- `auth/invalid-credential` — login com credenciais inválidas
- `auth/user-not-found` — `updatePassword` para e-mail inexistente

Mensagens exibidas nas telas via `mapAuthError` em `assets/js/services/auth-service.js`.
