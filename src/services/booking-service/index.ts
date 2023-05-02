import httpStatus from 'http-status';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const booking = await getBookingGenerals(userId);
  return booking;
}

async function getBookingGenerals(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }
  return booking;
}

async function validations(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote || ticket.status === 'RESERVED') {
    throw httpStatus.FORBIDDEN;
  }
  const room = await bookingRepository.findRoomById(roomId);
  if (!room || !enrollment) {
    throw notFoundError();
  }
  const bookings = await bookingRepository.findBookingsByRoomId(roomId);
  if (room.capacity <= bookings.length) {
    throw httpStatus.FORBIDDEN;
  }
  return { enrollment, ticket, room, bookings };
}

async function postBookingRoom(userId: number, roomId: number) {
  await validations(userId, roomId);
  return bookingRepository.createBooking(userId, roomId);
}

async function updateBooking(userId: number, roomId: number) {
  const booking = await getBookingGenerals(userId);
  await validations(userId, roomId);
  return bookingRepository.updateBooking(booking.id, userId, roomId);
}

export default {
  getBooking,
  postBookingRoom,
  updateBooking,
};
