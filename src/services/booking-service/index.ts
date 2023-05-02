import enrollmentRepository from '@/repositories/enrollment-repository';
import { invalidDataError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const booking = await bookingRepository.findBookingByUserId(userId);

  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function postBookingRoom(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const room = await bookingRepository.findRoomById(roomId);
  const bookings = await bookingRepository.findBookingsByRoomId(roomId);
  const booking = await bookingRepository.createBooking(userId, roomId);

  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote || ticket.status === 'RESERVED') {
    throw notFoundError();
  }

  if (bookings.length >= room.capacity) {
    throw invalidDataError;
  }

  return booking;
}

export default {
  getBooking,
  postBookingRoom,
};
