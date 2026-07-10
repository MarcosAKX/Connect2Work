/**
 * Validadores reutilizáveis de formulário.
 * Regras inspiradas em padrões de Spotify, Facebook e Instagram:
 * limites de tamanho, mensagens contextuais e validação progressiva.
 */

export const LIMITS = {
  identifier: { min: 3, max: 50 },
  email: { max: 254 },
  fullName: { min: 3, max: 100, partMin: 2 },
  profession: { min: 2, max: 80 },
  password: { min: 6, max: 128 },
  loginPassword: { max: 128 },
};

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const NAME_PART_REGEX = /^[\p{L}][\p{L}'-]*$/u;
const PROFESSION_REGEX = /^[\p{L}0-9][\p{L}0-9\s.,/'-]*$/u;

/** DDDs válidos no Brasil (Anatel). */
const VALID_BRAZILIAN_DDD = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99',
]);

function isEmpty(value) {
  return value.trim().length === 0;
}

function hasRepeatedDigits(digits) {
  return /^(\d)\1+$/.test(digits);
}

// ------------------------------------------------------------------
// Login — e-mail ou usuário
// ------------------------------------------------------------------

export function isValidIdentifier(value) {
  return getIdentifierError(value) === null;
}

export function getIdentifierError(value) {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 'Informe seu e-mail ou usuário.';
  }

  if (trimmed.length > LIMITS.identifier.max) {
    return `Use no máximo ${LIMITS.identifier.max} caracteres.`;
  }

  if (trimmed.includes('@')) {
    return getEmailError(trimmed);
  }

  if (trimmed.length < LIMITS.identifier.min) {
    return `Digite pelo menos ${LIMITS.identifier.min} caracteres.`;
  }

  if (/\s/.test(trimmed)) {
    return 'O usuário não pode conter espaços.';
  }

  return null;
}

// ------------------------------------------------------------------
// E-mail (cadastro)
// ------------------------------------------------------------------

export function isValidEmail(value) {
  return getEmailError(value) === null;
}

export function getEmailError(value) {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 'Informe seu e-mail.';
  }

  if (trimmed.length > LIMITS.email.max) {
    return `O e-mail deve ter no máximo ${LIMITS.email.max} caracteres.`;
  }

  if (/\s/.test(trimmed)) {
    return 'O e-mail não pode conter espaços.';
  }

  if (trimmed.includes('..')) {
    return 'Digite um e-mail válido.';
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Digite um e-mail válido.';
  }

  const domain = trimmed.split('@')[1];
  if (!domain || !domain.includes('.')) {
    return 'Digite um e-mail válido.';
  }

  return null;
}

// ------------------------------------------------------------------
// Nome completo
// ------------------------------------------------------------------

export function isValidFullName(value) {
  return getFullNameError(value) === null;
}

export function getFullNameError(value) {
  const trimmed = value.trim().replace(/\s+/g, ' ');

  if (trimmed.length === 0) {
    return 'Informe seu nome completo.';
  }

  if (trimmed.length < LIMITS.fullName.min) {
    return 'Informe seu nome completo.';
  }

  if (trimmed.length > LIMITS.fullName.max) {
    return `Use no máximo ${LIMITS.fullName.max} caracteres.`;
  }

  const parts = trimmed.split(' ');

  if (parts.length < 2) {
    return 'Informe nome e sobrenome.';
  }

  const invalidPart = parts.find(
    (part) => part.length < LIMITS.fullName.partMin || !NAME_PART_REGEX.test(part)
  );

  if (invalidPart) {
    return 'Use apenas letras no nome. Cada parte deve ter pelo menos 2 caracteres.';
  }

  return null;
}

// ------------------------------------------------------------------
// Profissão
// ------------------------------------------------------------------

export function isNotEmpty(value) {
  return value.trim().length > 0;
}

export function isValidProfession(value) {
  return getProfessionError(value) === null;
}

export function getProfessionError(value) {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 'Informe sua profissão.';
  }

  if (trimmed.length < LIMITS.profession.min) {
    return `Digite pelo menos ${LIMITS.profession.min} caracteres.`;
  }

  if (trimmed.length > LIMITS.profession.max) {
    return `Use no máximo ${LIMITS.profession.max} caracteres.`;
  }

  if (!PROFESSION_REGEX.test(trimmed)) {
    return 'Use apenas letras e números na profissão.';
  }

  return null;
}

// ------------------------------------------------------------------
// Telefone (Brasil)
// ------------------------------------------------------------------

export function isValidPhone(value) {
  return getPhoneError(value) === null;
}

export function getPhoneError(value) {
  const digits = value.replace(/\D/g, '');

  if (digits.length === 0) {
    return 'Informe seu telefone.';
  }

  if (digits.length !== 10 && digits.length !== 11) {
    return 'Digite um telefone com DDD. Ex: (11) 98765-4321';
  }

  const ddd = digits.slice(0, 2);
  if (!VALID_BRAZILIAN_DDD.has(ddd)) {
    return 'Digite um DDD válido.';
  }

  if (hasRepeatedDigits(digits)) {
    return 'Digite um telefone válido.';
  }

  if (digits.length === 11 && digits[2] !== '9') {
    return 'Celular deve começar com 9 após o DDD.';
  }

  if (digits.length === 10 && !['2', '3', '4', '5'].includes(digits[2])) {
    return 'Telefone fixo inválido para o DDD informado.';
  }

  return null;
}

// ------------------------------------------------------------------
// Senha
// ------------------------------------------------------------------

export function isValidPassword(value) {
  return getPasswordError(value) === null;
}

export function getPasswordError(value) {
  if (value.length === 0) {
    return 'Crie uma senha.';
  }

  if (/\s/.test(value)) {
    return 'A senha não pode conter espaços.';
  }

  if (value.length < LIMITS.password.min) {
    return `A senha deve ter pelo menos ${LIMITS.password.min} caracteres.`;
  }

  if (value.length > LIMITS.password.max) {
    return `A senha deve ter no máximo ${LIMITS.password.max} caracteres.`;
  }

  return null;
}

export function isValidLoginPassword(value) {
  return getLoginPasswordError(value) === null;
}

export function getLoginPasswordError(value) {
  if (value.length === 0) {
    return 'Informe sua senha.';
  }

  if (/\s/.test(value)) {
    return 'A senha não pode conter espaços.';
  }

  if (value.length > LIMITS.loginPassword.max) {
    return `A senha deve ter no máximo ${LIMITS.loginPassword.max} caracteres.`;
  }

  return null;
}

export function passwordsMatch(password, confirmPassword) {
  return getConfirmPasswordError(password, confirmPassword) === null;
}

export function getConfirmPasswordError(password, confirmPassword) {
  if (confirmPassword.length === 0) {
    return 'Confirme sua senha.';
  }

  if (password !== confirmPassword) {
    return 'As senhas não coincidem.';
  }

  return null;
}

/**
 * Formata telefone brasileiro enquanto o usuário digita.
 * Suporta (00) 0000-0000 e (00) 00000-0000.
 */
export function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
