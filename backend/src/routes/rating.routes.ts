import { Router } from 'express';
import {
    submitRating,
    updateRating,
    getUserRatings,
    getStoreRatings,
    getUserStoreRating
} from '../controllers/rating.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/submit', authMiddleware, submitRating);
router.put('/:ratingId', authMiddleware, updateRating);
router.get('/my-ratings', authMiddleware, getUserRatings);
router.get('/store/:storeId/my-rating', authMiddleware, getUserStoreRating);

router.get('/my-store', authMiddleware, getStoreRatings);

export default router;