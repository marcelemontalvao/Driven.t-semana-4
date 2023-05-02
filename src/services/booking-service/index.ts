import httpStatus from 'http-status';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!enrollment || !booking) {
    throw notFoundError();
  }
  return booking;
}

async function postBookingRoom(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote || ticket.status === 'RESERVED') {
    throw httpStatus.FORBIDDEN;
  }
  const room = await bookingRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }
  const bookings = await bookingRepository.findBookingsByRoomId(roomId);
  if (room.capacity <= bookings.length) {
    throw httpStatus.FORBIDDEN;
  }
  return bookingRepository.createBooking(userId, roomId);
}

export default {
  getBooking,
  postBookingRoom,
};
