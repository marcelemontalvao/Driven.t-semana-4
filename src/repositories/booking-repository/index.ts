import { Booking } from '@prisma/client';
import { prisma } from '@/config';

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true,
    },
  });
}

async function findRoomById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function findBookingsByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: { roomId },
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId,
    },
  });
}

async function updateBooking(id: number, userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.update({
    data: {
      roomId,
    },
    where: {
      id,
    },
  });
}

const bookingRepository = {
  findBookingByUserId,
  findRoomById,
  findBookingsByRoomId,
  createBooking,
  updateBooking,
};

export default bookingRepository;
