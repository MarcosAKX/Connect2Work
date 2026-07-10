import {
  getIdentifierError,
  getLoginPasswordError,
  isValidEmail,
} from '../utils/validators.js';
import { initNetworkCanvas } from '../components/network-canvas.js';
import {
  isAuthReady,
  loginUser,
  loginWithGoogle,
  mapAuthError,
} from '../services/auth-service.js';
import { loginUser as mockLoginUser } from '../mocks/database.js';

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const submitBtn = document.getElementById('submit-btn');
const toggleBtn = document.getElementById('toggle-password');
const googleBtn = document.getElementById('google-btn');

const touched = {
  email: false,
  password: false,
};

toggleBtn.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  toggleBtn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
  toggleBtn.innerHTML = isPassword ? eyeOffIcon() : eyeIcon();
});

emailInput.addEventListener('blur', () => {
  touched.email = true;
  validateEmail();
});

emailInput.addEventListener('input', () => {
  if (touched.email) validateEmail();
});

passwordInput.addEventListener('blur', () => {
  touched.password = true;
  validatePassword();
});

passwordInput.addEventListener('input', () => {
  if (touched.password) validatePassword();
});

function validateEmail() {
  const message = getIdentifierError(emailInput.value);
  const valid = message === null;
  const showError = touched.email && message !== null;

  emailInput.classList.toggle('is-invalid', showError);
  emailInput.classList.toggle('is-valid', valid && emailInput.value.trim().length > 0);

  if (showError) emailError.textContent = message;
  emailError.classList.toggle('is-visible', showError);

  return valid;
}

function validatePassword() {
  const message = getLoginPasswordError(passwordInput.value);
  const valid = message === null;
  const showError = touched.password && message !== null;

  passwordInput.classList.toggle('is-invalid', showError);
  passwordInput.classList.toggle('is-valid', valid && passwordInput.value.length > 0);

  if (showError) passwordError.textContent = message;
  passwordError.classList.toggle('is-visible', showError);

  return valid;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  touched.email = true;
  touched.password = true;

  const emailOk = validateEmail();
  const passwordOk = validatePassword();

  if (!emailOk || !passwordOk) {
    if (!emailOk) emailInput.focus();
    else passwordInput.focus();
    return;
  }

  setLoading(true);

  try {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (isAuthReady()) {
      if (!isValidEmail(email)) {
        throw new Error('Para entrar, use um e-mail válido.');
      }
      await loginUser(email, password);
    } else {
      if (!isValidEmail(email)) {
        throw new Error('Para entrar, use um e-mail válido.');
      }
      await mockLoginUser(email, password);
    }

    window.location.href = 'unidades.html';
  } catch (err) {
    showFormError(err.code ? mapAuthError(err) : err.message);
  } finally {
    setLoading(false);
  }
});

googleBtn.addEventListener('click', async () => {
  if (!isAuthReady()) {
    showFormError('Configure o Firebase para usar login com Google.');
    return;
  }

  setLoading(true);

  try {
    await loginWithGoogle();
    window.location.href = 'unidades.html';
  } catch (err) {
    if (err?.code !== 'auth/popup-closed-by-user') {
      showFormError(mapAuthError(err));
    }
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
  const card = document.querySelector('.login-card');
  card.classList.add('is-shaking');
  passwordInput.classList.add('is-invalid');
  passwordInput.classList.remove('is-valid');
  passwordInput.value = '';
  touched.password = false;
  passwordError.classList.remove('is-visible');
  passwordInput.focus();

  setTimeout(() => card.classList.remove('is-shaking'), 500);

  emailError.textContent = message;
  emailError.classList.add('is-visible');
  emailInput.classList.add('is-invalid');
  emailInput.classList.remove('is-valid');
}

function eyeIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function eyeOffIcon() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}
