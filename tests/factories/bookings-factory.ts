import { Booking } from '@prisma/client';
import { prisma } from '@/config';

export function createBooking(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}
