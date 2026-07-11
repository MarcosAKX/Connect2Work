/**
 * @typedef {Object} Unit
 * @property {string} id
 * @property {string} name
 * @property {string} address
 * @property {number} availableRooms
 * @property {string | null} imageUrl
 */

/** @type {Unit[]} */
export const units = [
  {
    id: 'unit-1',
    name: 'Connect2Work 1',
    address: 'Rua das Empresas, 100 - Centro',
    availableRooms: 5,
    imageUrl: null,
  },
  {
    id: 'unit-2',
    name: 'Connect2Work 2',
    address: 'Av. dos Negócios, 500 - Zona Sul',
    availableRooms: 5,
    imageUrl: null,
  },
];

/**
 * @returns {Unit[]}
 */
export function getUnits() {
  return units;
}

/**
 * @param {string} id
 * @returns {Unit | undefined}
 */
export function getUnitById(id) {
  return units.find((unit) => unit.id === id);
}
