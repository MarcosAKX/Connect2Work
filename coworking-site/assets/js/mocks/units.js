/**
 * @typedef {Object} Unit
 * @property {string} id
 * @property {string} name
 * @property {string} address
 * @property {number} availableRooms
 * @property {string | null} imageUrl
 * @property {string} [description]
 */

/** @type {Unit[]} */
export const units = [
  {
    id: 'unit-1',
    name: 'Connect2Work 1',
    address: 'Rua das Empresas, 100 - Centro',
    availableRooms: 5,
    imageUrl: null,
    description: 'Unidade no coração do Centro, com fácil acesso ao metrô e estacionamento conveniado.',
  },
  {
    id: 'unit-2',
    name: 'Connect2Work 2',
    address: 'Av. dos Negócios, 500 - Zona Sul',
    availableRooms: 5,
    imageUrl: null,
    description: 'Espaço moderno na Zona Sul, ideal para reuniões e trabalho em equipe.',
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
