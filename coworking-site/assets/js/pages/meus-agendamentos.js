import { getCurrentUser } from '../mocks/database.js';
import {
  getBookingCounts,
  getBookingsByUserIdAndStatus,
} from '../mocks/bookings.js';

const userNameEl = document.getElementById('user-name');
const bookingsPanel = document.getElementById('bookings-panel');
const tabButtons = document.querySelectorAll('.bookings-tab');
const countEls = {
  upcoming: document.getElementById('count-upcoming'),
  past: document.getElementById('count-past'),
  cancelled: document.getElementById('count-cancelled'),
};

const currentUser = getCurrentUser();
const userId = currentUser?.id || '';

userNameEl.textContent = currentUser?.name || 'Usuário';

let activeStatus = 'upcoming';

function updateTabCounts() {
  const counts = getBookingCounts(userId);

  countEls.upcoming.textContent = `(${counts.upcoming})`;
  countEls.past.textContent = `(${counts.past})`;
  countEls.cancelled.textContent = `(${counts.cancelled})`;
}

function renderEmptyState() {
  return `
    <div class="bookings-empty">
      <div class="bookings-empty__icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4"/>
          <path d="M8 2v4"/>
          <path d="M3 10h18"/>
        </svg>
      </div>
      <h2>Nenhum agendamento</h2>
      <p>Você ainda não possui reservas nesta categoria. Escolha uma unidade e agende sua sala.</p>
      <a href="unidades.html" class="btn btn-primary btn--inline bookings-empty__action">Fazer Agendamento</a>
    </div>
  `;
}

function renderPanel(status) {
  const bookings = getBookingsByUserIdAndStatus(userId, status);

  if (bookings.length === 0) {
    bookingsPanel.innerHTML = renderEmptyState();
    return;
  }

  bookingsPanel.innerHTML = bookings
    .map((booking) => `<article class="card" data-booking-id="${booking.id}">${booking.id}</article>`)
    .join('');
}

function setActiveTab(status) {
  activeStatus = status;

  tabButtons.forEach((tab) => {
    const isActive = tab.dataset.status === status;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  const activeTab = document.querySelector(`.bookings-tab[data-status="${status}"]`);
  bookingsPanel.setAttribute('aria-labelledby', activeTab?.id || 'tab-upcoming');

  renderPanel(status);
}

tabButtons.forEach((tab) => {
  tab.addEventListener('click', () => {
    setActiveTab(tab.dataset.status);
  });
});

updateTabCounts();
setActiveTab(activeStatus);
