import express from 'express';
import { getAllSongs, getSong, addSong, deleteSong, getSongStreamUrl } from '../controllers/songController.js';
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute); // all song routes require login

router.get('/',     getAllSongs);
router.get('/:id',  getSong);
router.get('/:id/stream-url', getSongStreamUrl);
router.post('/',    addSong);
router.delete('/:id', deleteSong);

export default router;