import express from 'express';
import {login, logout, signup} from '../controllers/authController.js';
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectRoute, (req, res) => {
  res.json({ id: req.user._id, name: req.user.name });
});

export default router;
