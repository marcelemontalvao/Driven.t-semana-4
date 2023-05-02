import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';
import { notFoundError } from '@/errors';

function catchErrors(error: any, res: Response) {
  if (error.name === 'NotFoundError') {
    return res.status(404).sendStatus(httpStatus.NOT_FOUND);
  } else if (error == httpStatus.BAD_REQUEST) {
    return res.status(400).sendStatus(httpStatus.BAD_REQUEST);
  } else {
    return res.status(403).sendStatus(httpStatus.FORBIDDEN);
  }
}

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
    return res.status(400).sendStatus(httpStatus.BAD_REQUEST);
  }
  try {
    const booking = await bookingService.postBookingRoom(userId, roomId);
    if (!booking) {
      throw notFoundError();
    }
    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
    });
  } catch (error) {
    catchErrors(error, res);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { roomId } = req.body;
  if (!roomId) {
    return res.status(400).sendStatus(httpStatus.BAD_REQUEST);
  }
  try {
    const booking = await bookingService.updateBooking(userId, roomId);
    if (!booking) {
      throw notFoundError();
    }
    return res.status(httpStatus.OK).send({
      bookingId: booking.id,
    });
  } catch (error) {
    catchErrors(error, res);
  }
}
