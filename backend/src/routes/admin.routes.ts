import { Router } from "express";
import { 
    loginAdmin, 
    registerAdmin, 
    getAdminDashboard, 
    getAllUsers, 
    createUser, 
    updateUserRole, 
    deleteUser 
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Auth routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected admin routes
router.get("/dashboard", authMiddleware, getAdminDashboard);
router.get("/test", authMiddleware, (req, res) => {
    const user = (req as any).user;
    res.json({ message: "Auth working", user });
});
router.get("/users", authMiddleware, getAllUsers);
router.post("/users", authMiddleware, createUser);
router.put("/users/:userId/role", authMiddleware, updateUserRole);
router.delete("/users/:userId", authMiddleware, deleteUser);

export default router;