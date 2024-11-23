import { Router } from "express";
import { checkAuthStatus, userLogin, userLogOut, userRegistration} from "../controllers/auth-controller.js";
import { protectRoutes } from "../middleware/protected-routes.js";

const authRoutes = Router();


authRoutes.post('/register', userRegistration);
authRoutes.post('/login', userLogin);
authRoutes.post('/logout', protectRoutes, userLogOut);
authRoutes.get('/auth-status', protectRoutes, checkAuthStatus);


export default authRoutes;