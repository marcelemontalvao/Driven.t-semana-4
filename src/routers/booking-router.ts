import { Router } from 'express';
import { getBooking, postBookingRoom, putBooking } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('', getBooking).post('', postBookingRoom).put('/:bookingId', putBooking);

export { bookingRouter };
