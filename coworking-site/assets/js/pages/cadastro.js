import {
  formatPhone,
  getConfirmPasswordError,
  getEmailError,
  getFullNameError,
  getPasswordError,
  getPhoneError,
  getProfessionError,
} from '../utils/validators.js';
import { initNetworkCanvas } from '../components/network-canvas.js';
import { isAuthReady, mapAuthError, registerUser } from '../services/auth-service.js';
import { registerUser as mockRegisterUser } from '../mocks/database.js';

const form = document.getElementById('cadastro-form');
const fullNameInput = document.getElementById('full-name');
const emailInput = document.getElementById('email');
const professionInput = document.getElementById('profession');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const submitBtn = document.getElementById('submit-btn');
const togglePasswordBtn = document.getElementById('toggle-password');
const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');

const fields = [
  {
    input: fullNameInput,
    error: document.getElementById('full-name-error'),
    getMessage: (value) => getFullNameError(value),
  },
  {
    input: emailInput,
    error: document.getElementById('email-error'),
    getMessage: (value) => getEmailError(value),
  },
  {
    input: professionInput,
    error: document.getElementById('profession-error'),
    getMessage: (value) => getProfessionError(value),
  },
  {
    input: phoneInput,
    error: document.getElementById('phone-error'),
    getMessage: (value) => getPhoneError(value),
  },
  {
    input: passwordInput,
    error: document.getElementById('password-error'),
    getMessage: (value) => getPasswordError(value),
  },
  {
    input: confirmPasswordInput,
    error: document.getElementById('confirm-password-error'),
    getMessage: (value) => getConfirmPasswordError(passwordInput.value, value),
  },
];

const touched = new Map(fields.map(({ input }) => [input.id, false]));

function setupPasswordToggle(button, input) {
  button.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    button.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
    button.innerHTML = isPassword ? eyeOffIcon() : eyeIcon();
  });
}

setupPasswordToggle(togglePasswordBtn, passwordInput);
setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

phoneInput.addEventListener('input', () => {
  const cursorFromEnd = phoneInput.value.length - phoneInput.selectionStart;
  phoneInput.value = formatPhone(phoneInput.value);
  const nextPosition = Math.max(phoneInput.value.length - cursorFromEnd, 0);
  phoneInput.setSelectionRange(nextPosition, nextPosition);

  if (touched.get(phoneInput.id)) validateField(getFieldConfig(phoneInput));
});

fields.forEach((field) => {
  field.input.addEventListener('blur', () => {
    touched.set(field.input.id, true);
    validateField(field);
  });

  field.input.addEventListener('input', () => {
    if (touched.get(field.input.id)) validateField(field);
    if (field.input === passwordInput && touched.get(confirmPasswordInput.id)) {
      validateField(getFieldConfig(confirmPasswordInput));
    }
  });
});

function getFieldConfig(input) {
  return fields.find((field) => field.input === input);
}

function validateField(field) {
  const value = field.input.value;
  const message = touched.get(field.input.id) ? field.getMessage(value) : null;
  const valid = message === null;
  const showError = message !== null;
  const hasContent = field.input.type === 'password' ? value.length > 0 : value.trim().length > 0;

  field.input.classList.toggle('is-invalid', showError);
  field.input.classList.toggle('is-valid', valid && hasContent);

  if (showError) field.error.textContent = message;
  field.error.classList.toggle('is-visible', showError);

  return valid;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  fields.forEach((field) => touched.set(field.input.id, true));

  const allValid = fields.every((field) => validateField(field));
  if (!allValid) {
    const firstInvalid = fields.find((field) => field.getMessage(field.input.value) !== null);
    firstInvalid?.input.focus();
    return;
  }

  setLoading(true);

  try {
    const payload = {
      fullName: fullNameInput.value.trim().replace(/\s+/g, ' '),
      email: emailInput.value.trim(),
      profession: professionInput.value.trim(),
      phone: phoneInput.value.trim(),
      password: passwordInput.value,
    };

    if (isAuthReady()) {
      await registerUser(payload);
    } else {
      await mockRegisterUser(payload.fullName, payload.email, payload.password, {
        profession: payload.profession,
        phone: payload.phone,
      });
    }

    window.location.href = 'login.html';
  } catch (err) {
    showFormError(err.code ? mapAuthError(err) : err.message);
  } finally {
    setLoading(false);
  }
});

const networkCanvas = document.getElementById('network-bg');
if (networkCanvas) initNetworkCanvas(networkCanvas);

function setLoading(isLoading) {
  submitBtn.classList.toggle('is-loading', isLoading);
  submitBtn.disabled = isLoading;
}

function showFormError(message) {
  const card = document.querySelector('.cadastro-card');
  const emailError = document.getElementById('email-error');
  card.classList.add('is-shaking');
  emailInput.classList.add('is-invalid');
  emailInput.classList.remove('is-valid');
  emailError.textContent = message;
  emailError.classList.add('is-visible');
  emailInput.focus();

  setTimeout(() => card.classList.remove('is-shaking'), 500);
}

function eyeIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function eyeOffIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}
