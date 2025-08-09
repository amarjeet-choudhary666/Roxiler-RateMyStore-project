import { Router } from "express";
import { 
    loginStoreOwner, 
    registerStoreOwner, 
    getStoreOwnerProfile, 
    updateStoreOwnerProfile,
    createOwnStore,
    updateOwnStore
} from "../controllers/shop_owner.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Auth routes
router.post("/register", registerStoreOwner);
router.post("/login", loginStoreOwner);

// Protected store owner routes
router.get("/profile", authMiddleware, getStoreOwnerProfile);
router.put("/profile", authMiddleware, updateStoreOwnerProfile);

// Store management routes
router.post("/store", authMiddleware, createOwnStore);
router.put("/store", authMiddleware, updateOwnStore);

export default router;