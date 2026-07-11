import { getCurrentUser } from '../mocks/database.js';
import { getRoomsByUnitId } from '../mocks/rooms.js';
import { getUnitById, getUnits } from '../mocks/units.js';

const userNameEl = document.getElementById('user-name');
const unitSummaryEl = document.getElementById('unit-summary');
const roomsGrid = document.getElementById('rooms-grid');

const currentUser = getCurrentUser();
userNameEl.textContent = currentUser?.name || 'Usuário';

const unitParam = new URLSearchParams(window.location.search).get('unidade')
  || new URLSearchParams(window.location.search).get('unitId');
const unit = resolveUnit(unitParam);

if (!unit) {
  window.location.replace('unidades.html');
} else {
  document.title = `${unit.name} · Escolha uma Sala · C2W Connect2Work`;
  renderUnitSummary(unit);
  renderRooms(getRoomsByUnitId(unit.id));
}

/**
 * @param {string | null} param
 * @returns {import('../mocks/units.js').Unit | null}
 */
function resolveUnit(param) {
  if (!param) return null;

  const byId = getUnitById(param);
  if (byId) return byId;

  const index = Number.parseInt(param, 10);
  if (!Number.isNaN(index) && index >= 1) {
    const units = getUnits();
    return units[index - 1] || null;
  }

  return null;
}

/**
 * @param {import('../mocks/units.js').Unit} unit
 */
function renderUnitSummary(unit) {
  const roomsLabel = unit.availableRooms === 1
    ? '1 sala disponível'
    : `${unit.availableRooms} salas disponíveis`;

  unitSummaryEl.innerHTML = `
    <div class="unit-summary__info">
      <h2>${unit.name}</h2>
      <p class="unit-summary__address">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        ${unit.address}
      </p>
    </div>
    <span class="unit-summary__badge">${roomsLabel}</span>
  `;
}

/**
 * @param {import('../mocks/rooms.js').Room[]} rooms
 */
function renderRooms(rooms) {
  roomsGrid.innerHTML = rooms.map(renderRoomCard).join('');
}

/**
 * @param {import('../mocks/rooms.js').Room} room
 */
function renderRoomCard(room) {
  const priceLabel = `R$ ${room.pricePerHour}/h`;
  const capacityLabel = room.capacity === 1
    ? '1 pessoa'
    : `${room.capacity} pessoas`;

  const visualContent = room.imageUrl
    ? `<img class="room-card__image" src="${room.imageUrl}" alt="" loading="lazy" />`
    : `<span class="room-card__name-fallback">${room.name}</span>`;

  const visibleAmenities = room.amenities.slice(0, 3);
  const hiddenCount = room.amenities.length - visibleAmenities.length;

  const tagsHtml = visibleAmenities
    .map((amenity) => `<span class="room-card__tag">${amenity}</span>`)
    .join('');

  const moreTagHtml = hiddenCount > 0
    ? `<span class="room-card__tag room-card__tag--more">+${hiddenCount}</span>`
    : '';

  return `
    <article class="room-card card" data-room-id="${room.id}">
      <div class="room-card__visual" aria-hidden="true">
        ${visualContent}
        <span class="room-card__price">${priceLabel}</span>
      </div>

      <div class="room-card__body">
        <h2 class="room-card__title">${room.name}</h2>

        <p class="room-card__capacity">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          ${capacityLabel}
        </p>

        <div class="room-card__tags">
          ${tagsHtml}
          ${moreTagHtml}
        </div>
      </div>
    </article>
  `;
}
