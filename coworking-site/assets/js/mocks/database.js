const USERS_KEY = 'c2w_mock_users';
const SESSION_KEY = 'c2w_mock_session';
const RESETS_KEY = 'c2w_mock_password_resets';

const SEED_USER = {
  id: 'seed-usuario-teste',
  name: 'Usuário Teste',
  email: 'teste@connect2work.com',
  password: '123456',
  createdAt: '2026-01-01T00:00:00.000Z',
};

function createAuthError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  try {
    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadResets() {
  const raw = localStorage.getItem(RESETS_KEY);
  if (!raw) return [];

  try {
    const resets = JSON.parse(raw);
    return Array.isArray(resets) ? resets : [];
  } catch {
    return [];
  }
}

function saveResets(resets) {
  localStorage.setItem(RESETS_KEY, JSON.stringify(resets));
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function ensureSeedUser() {
  const users = loadUsers();
  const hasSeed = users.some((user) => user.id === SEED_USER.id);

  if (!hasSeed) {
    saveUsers([SEED_USER, ...users]);
  }
}

function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  return loadUsers().find((user) => user.email.toLowerCase() === normalizedEmail) || null;
}

/**
 * @typedef {Object} MockUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} createdAt
 * @property {string} [profession]
 * @property {string} [phone]
 */

/**
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {{ profession?: string, phone?: string }} [profile]
 * @returns {Promise<Omit<MockUser, 'password'>>}
 */
export async function registerUser(name, email, password, profile = {}) {
  await delay();
  ensureSeedUser();

  const users = loadUsers();
  const normalizedEmail = normalizeEmail(email);

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw createAuthError('auth/email-already-in-use', 'Este e-mail já está cadastrado.');
  }

  /** @type {MockUser} */
  const user = {
    id: crypto.randomUUID(),
    name: name.trim().replace(/\s+/g, ' '),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
    ...profile,
  };

  users.push(user);
  saveUsers(users);

  return sanitizeUser(user);
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<MockUser, 'password'>>}
 */
export async function loginUser(email, password) {
  await delay();
  ensureSeedUser();

  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    throw createAuthError('auth/invalid-credential', 'E-mail ou senha incorretos.');
  }

  const sessionUser = sanitizeUser(user);
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

  return sessionUser;
}

/**
 * @returns {Omit<MockUser, 'password'> | null}
 */
export function getCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * @param {string} email
 * @returns {Promise<void>}
 */
export async function resetPassword(email) {
  await delay();
  ensureSeedUser();

  const normalizedEmail = normalizeEmail(email);
  const user = findUserByEmail(normalizedEmail);
  const resets = loadResets();

  resets.push({
    email: normalizedEmail,
    requestedAt: new Date().toISOString(),
    userExists: Boolean(user),
  });

  saveResets(resets);

  console.info(`[C2W Mock] E-mail de redefinição enviado para: ${normalizedEmail}`);

  if (user) {
    console.info(
      `[C2W Mock] Para simular a troca: updatePassword('${normalizedEmail}', 'novaSenha')`
    );
  }
}

/**
 * @param {string} email
 * @param {string} newPassword
 * @returns {Promise<Omit<MockUser, 'password'>>}
 */
export async function updatePassword(email, newPassword) {
  await delay();

  const users = loadUsers();
  const normalizedEmail = normalizeEmail(email);
  const index = users.findIndex((user) => user.email.toLowerCase() === normalizedEmail);

  if (index === -1) {
    throw createAuthError('auth/user-not-found', 'Usuário não encontrado.');
  }

  users[index].password = newPassword;
  saveUsers(users);

  return sanitizeUser(users[index]);
}

ensureSeedUser();
