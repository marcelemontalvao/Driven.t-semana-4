import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(userId);
    return res.status(httpStatus.OK).send({
      id: booking.id,
      Room: booking.Room,
    });
  } catch (error) {
    return res.status(404).send(httpStatus[404]);
  }
}

export async function postBookingRoom(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).send(httpStatus[400]);
  }
  try {
    const booking = await bookingService.postBookingRoom(userId, roomId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    next(error);
  }
}
