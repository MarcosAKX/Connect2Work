/**
 * @typedef {Object} Room
 * @property {string} id
 * @property {string} unitId
 * @property {string} name
 * @property {number} capacity
 * @property {number} pricePerHour
 * @property {string[]} amenities
 * @property {string | null} imageUrl
 */

/** @type {Room[]} */
export const rooms = [
  {
    id: 'room-1-1',
    unitId: 'unit-1',
    name: 'Sala Executive',
    capacity: 8,
    pricePerHour: 80,
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Projetor', 'Quadro Branco'],
    imageUrl: null,
  },
  {
    id: 'room-1-2',
    unitId: 'unit-1',
    name: 'Sala Focus',
    capacity: 4,
    pricePerHour: 45,
    amenities: ['Wi-Fi', 'Ar Condicionado'],
    imageUrl: null,
  },
  {
    id: 'room-1-3',
    unitId: 'unit-1',
    name: 'Sala Brainstorm',
    capacity: 12,
    pricePerHour: 120,
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Projetor', 'Videoconferência'],
    imageUrl: null,
  },
  {
    id: 'room-1-4',
    unitId: 'unit-1',
    name: 'Sala Solo',
    capacity: 1,
    pricePerHour: 25,
    amenities: ['Wi-Fi', 'Ar Condicionado'],
    imageUrl: null,
  },
  {
    id: 'room-1-5',
    unitId: 'unit-1',
    name: 'Sala Meeting',
    capacity: 6,
    pricePerHour: 60,
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Projetor'],
    imageUrl: null,
  },
  {
    id: 'room-2-1',
    unitId: 'unit-2',
    name: 'Sala Horizon',
    capacity: 10,
    pricePerHour: 90,
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Projetor', 'Café'],
    imageUrl: null,
  },
  {
    id: 'room-2-2',
    unitId: 'unit-2',
    name: 'Sala Compact',
    capacity: 3,
    pricePerHour: 40,
    amenities: ['Wi-Fi', 'Ar Condicionado'],
    imageUrl: null,
  },
  {
    id: 'room-2-3',
    unitId: 'unit-2',
    name: 'Sala Board',
    capacity: 14,
    pricePerHour: 130,
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Projetor', 'Videoconferência', 'Som Ambiente'],
    imageUrl: null,
  },
  {
    id: 'room-2-4',
    unitId: 'unit-2',
    name: 'Sala Quiet',
    capacity: 2,
    pricePerHour: 35,
    amenities: ['Wi-Fi', 'Ar Condicionado', 'Iluminação Ajustável'],
    imageUrl: null,
  },
  {
    id: 'room-2-5',
    unitId: 'unit-2',
    name: 'Sala Connect',
    capacity: 6,
    pricePerHour: 65,
    amenities: ['Wi-Fi', 'Ar Condicionado', 'TV', 'Projetor'],
    imageUrl: null,
  },
];

/**
 * @returns {Room[]}
 */
export function getRooms() {
  return rooms;
}

/**
 * @param {string} unitId
 * @returns {Room[]}
 */
export function getRoomsByUnitId(unitId) {
  return rooms.filter((room) => room.unitId === unitId);
}

/**
 * @param {string} id
 * @returns {Room | undefined}
 */
export function getRoomById(id) {
  return rooms.find((room) => room.id === id);
}
