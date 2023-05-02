import { Router } from 'express';
import { getBooking, postBookingRoom } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.all('/*', authenticateToken).get('', getBooking).post('', postBookingRoom);

export { bookingRouter };
