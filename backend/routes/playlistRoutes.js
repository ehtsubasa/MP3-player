// backend/routes/playlist.routes.js
import express from 'express';
import {
  getPlaylists, getPlaylist,
  createPlaylist, renamePlaylist, deletePlaylist,
  addSongToPlaylist, removeSongFromPlaylist
} from '../controllers/playlistController.js';
import protectRoute from "../middleware/protectRoute.js";;

const router = express.Router();

router.use(protectRoute);

router.get('/',                             getPlaylists);
router.get('/:id',                          getPlaylist);
router.post('/',                            createPlaylist);
router.patch('/:id',                        renamePlaylist);
router.delete('/:id',                       deletePlaylist);
router.post('/:id/songs',                   addSongToPlaylist);
router.delete('/:id/songs/:songId',         removeSongFromPlaylist);

export default router;