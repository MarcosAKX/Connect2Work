const BOOKINGS_KEY = 'c2w_mock_bookings';

/**
 * @typedef {'upcoming' | 'past' | 'cancelled'} BookingStatus
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} userId
 * @property {string} unitId
 * @property {string} roomId
 * @property {string} date
 * @property {string} timeSlot
 * @property {BookingStatus} status
 * @property {string} createdAt
 */

function loadBookings() {
  const raw = localStorage.getItem(BOOKINGS_KEY);
  if (!raw) return [];

  try {
    const bookings = JSON.parse(raw);
    return Array.isArray(bookings) ? bookings : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

/** @type {Booking[]} */
export const bookings = loadBookings();

/**
 * @returns {Booking[]}
 */
export function getBookings() {
  return loadBookings();
}

/**
 * @param {string} userId
 * @returns {Booking[]}
 */
export function getBookingsByUserId(userId) {
  return loadBookings().filter((booking) => booking.userId === userId);
}

/**
 * @param {string} userId
 * @param {BookingStatus} status
 * @returns {Booking[]}
 */
export function getBookingsByUserIdAndStatus(userId, status) {
  return getBookingsByUserId(userId).filter((booking) => booking.status === status);
}

/**
 * @param {string} userId
 * @returns {{ upcoming: number, past: number, cancelled: number }}
 */
export function getBookingCounts(userId) {
  const userBookings = getBookingsByUserId(userId);

  return {
    upcoming: userBookings.filter((booking) => booking.status === 'upcoming').length,
    past: userBookings.filter((booking) => booking.status === 'past').length,
    cancelled: userBookings.filter((booking) => booking.status === 'cancelled').length,
  };
}

/**
 * @param {Omit<Booking, 'id' | 'createdAt'>} data
 * @returns {Booking}
 */
export function createBooking(data) {
  const allBookings = loadBookings();
  const booking = {
    ...data,
    id: `booking-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  saveBookings([booking, ...allBookings]);
  return booking;
}

export { BOOKINGS_KEY, saveBookings };
