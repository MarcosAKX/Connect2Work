import { getCurrentUser } from '../mocks/database.js';
import { getUnits } from '../mocks/units.js';

const userNameEl = document.getElementById('user-name');
const unitsGrid = document.getElementById('units-grid');

const currentUser = getCurrentUser();
userNameEl.textContent = currentUser?.name || 'Usuário';

unitsGrid.innerHTML = getUnits()
  .map((unit, index) => renderUnitCard(unit, index + 1))
  .join('');

function renderUnitCard(unit, displayNumber) {
  const roomsLabel = unit.availableRooms === 1
    ? '1 sala disponível'
    : `${unit.availableRooms} salas disponíveis`;

  const visualStyle = unit.imageUrl
    ? `style="background-image: url('${unit.imageUrl}')"`
    : '';

  return `
    <article class="unit-card card" data-unit-id="${unit.id}">
      <div class="unit-card__visual" ${visualStyle} aria-hidden="true">
        <span class="unit-card__number">${displayNumber}</span>
      </div>

      <div class="unit-card__body">
        <div class="unit-card__header">
          <h2 class="unit-card__name">${unit.name}</h2>
          <button type="button" class="unit-card__action" aria-label="Ver ${unit.name}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <path d="M5 12h14"/>
              <path d="M13 6l6 6-6 6"/>
            </svg>
          </button>
        </div>

        <p class="unit-card__meta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${unit.address}
        </p>

        <p class="unit-card__rooms">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          ${roomsLabel}
        </p>
      </div>
    </article>
  `;
}
