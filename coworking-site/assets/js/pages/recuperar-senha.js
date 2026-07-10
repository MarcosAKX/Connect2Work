import { getEmailError } from '../utils/validators.js';
import { initNetworkCanvas } from '../components/network-canvas.js';
import { isAuthReady, mapAuthError, resetUserPassword } from '../services/auth-service.js';
import { resetPassword as mockResetPassword } from '../mocks/database.js';

const form = document.getElementById('recover-form');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const submitBtn = document.getElementById('submit-btn');
const successPanel = document.getElementById('recover-success');
const successText = document.getElementById('recover-success-text');
const backLink = document.getElementById('back-link');
const subtitle = document.getElementById('recover-subtitle');

let emailTouched = false;

emailInput.addEventListener('blur', () => {
  emailTouched = true;
  validateEmail();
});

emailInput.addEventListener('input', () => {
  if (emailTouched) validateEmail();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  emailTouched = true;
  const emailOk = validateEmail();

  if (!emailOk) {
    emailInput.focus();
    return;
  }

  setLoading(true);

  const email = emailInput.value.trim();

  try {
    if (isAuthReady()) {
      await resetUserPassword(email);
    } else {
      await mockResetPassword(email);
    }

    showSuccess(email);
  } catch (err) {
    showFormError(err.code ? mapAuthError(err) : err.message);
  } finally {
    setLoading(false);
  }
});

const networkCanvas = document.getElementById('network-bg');
if (networkCanvas) initNetworkCanvas(networkCanvas);

function validateEmail() {
  const message = getEmailError(emailInput.value);
  const valid = message === null;
  const showError = emailTouched && message !== null;

  emailInput.classList.toggle('is-invalid', showError);
  emailInput.classList.toggle('is-valid', valid && emailInput.value.trim().length > 0);

  if (showError) emailError.textContent = message;
  emailError.classList.toggle('is-visible', showError);

  return valid;
}

function setLoading(isLoading) {
  submitBtn.classList.toggle('is-loading', isLoading);
  submitBtn.disabled = isLoading;
}

function showFormError(message) {
  const card = document.querySelector('.recover-card');
  card.classList.add('is-shaking');

  emailError.textContent = message;
  emailError.classList.add('is-visible');
  emailInput.classList.add('is-invalid');
  emailInput.classList.remove('is-valid');
  emailInput.focus();

  setTimeout(() => card.classList.remove('is-shaking'), 500);
}

function showSuccess(email) {
  form.hidden = true;
  backLink.hidden = true;
  subtitle.hidden = true;

  successText.innerHTML = `Enviamos um link de redefinição para <strong>${escapeHtml(email)}</strong>. Verifique sua caixa de entrada e o spam.`;
  successPanel.hidden = false;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
