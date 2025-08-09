import { Router } from 'express';
import {
    createStore,
    updateStore,
    getAllStores,
    getStoreById,
    getStoreOwnerDashboard,
    deleteStore,
    searchStores
} from '../controllers/store.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/search', searchStores); 
router.get('/all', getAllStores); 
router.get('/:id', getStoreById); 

router.get('/dashboard/owner', authMiddleware, getStoreOwnerDashboard);

router.post('/create', authMiddleware, createStore);
router.put('/:id', authMiddleware, updateStore);
router.delete('/:id', authMiddleware, deleteStore);

export default router;