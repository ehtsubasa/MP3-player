import Playlist from '../models/playlistModel.js';

/**
 * GET /api/playlists
 * Required:
 * - Authenticated request through protectRoute
 * - req.user must be available so playlists can be filtered by ownerId
 *
 * Success result:
 * - 200 with an array of playlists owned by the current user
 *
 * Possible errors:
 * - 500 if playlists cannot be fetched
 */
export const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch playlists' });
  }
};

/**
 * GET /api/playlists/:id
 * Required:
 * - Authenticated request through protectRoute
 * - Route param: id (MongoDB playlist id)
 *
 * Success result:
 * - 200 with the playlist document
 * - The songs field is populated with Song documents
 *
 * Possible errors:
 * - 403 if the playlist belongs to another user
 * - 404 if the playlist does not exist
 * - 500 if the fetch fails
 */
export const getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your playlist' });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch playlist' });
  }
};

/**
 * POST /api/playlists
 * Required:
 * - Authenticated request through protectRoute
 * - JSON body: { "name": "<playlist name>" }
 *
 * Success result:
 * - 201 with the created playlist document
 * - The playlist starts with an empty songs array
 *
 * Possible errors:
 * - 400 if name is missing
 * - 500 if playlist creation fails
 */
export const createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const playlist = await Playlist.create({ name, ownerId: req.user._id, songs: [] });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create playlist' });
  }
};

/**
 * PATCH /api/playlists/:id
 * Required:
 * - Authenticated request through protectRoute
 * - Route param: id (MongoDB playlist id)
 * - JSON body: { "name": "<new playlist name>" }
 *
 * Success result:
 * - 200 with the updated playlist document
 *
 * Possible errors:
 * - 403 if the playlist belongs to another user
 * - 404 if the playlist does not exist
 * - 500 if the rename fails
 */
export const renamePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your playlist' });
    playlist.name = req.body.name || playlist.name;
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to rename playlist' });
  }
};

/**
 * DELETE /api/playlists/:id
 * Required:
 * - Authenticated request through protectRoute
 * - Route param: id (MongoDB playlist id)
 *
 * Success result:
 * - 200 with: { message: "Playlist deleted" }
 *
 * Possible errors:
 * - 403 if the playlist belongs to another user
 * - 404 if the playlist does not exist
 * - 500 if deletion fails
 */
export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) 
        return res.status(404).json({ message: 'Playlist not found' });

    if (playlist.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your playlist' });

    await playlist.deleteOne();

    res.json({ message: 'Playlist deleted' });
  } 
  catch (err) 
  {
    res.status(500).json({ message: 'Failed to delete playlist' });
  }
};

/**
 * POST /api/playlists/:id/songs
 * Required:
 * - Authenticated request through protectRoute
 * - Route param: id (MongoDB playlist id)
 * - JSON body: { "songId": "<MongoDB song id>" }
 *
 * Success result:
 * - 200 with the updated playlist document
 * - The provided songId is appended to playlist.songs
 *
 * Possible errors:
 * - 403 if the playlist belongs to another user
 * - 404 if the playlist does not exist
 * - 409 if the song is already in the playlist
 * - 500 if the update fails
 */
export const addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) 
        return res.status(404).json({ message: 'Playlist not found' });

    if (playlist.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'This playlist not exist' });

    if (playlist.songs.includes(songId))
      return res.status(409).json({ message: 'Song already in playlist' });

    playlist.songs.push(songId);
    await playlist.save();

    res.json(playlist);
  } 
  catch (err) {
    res.status(500).json({ message: 'Failed to add song to playlist' });
  }
};

/**
 * DELETE /api/playlists/:id/songs/:songId
 * Required:
 * - Authenticated request through protectRoute
 * - Route param: id (MongoDB playlist id)
 * - Route param: songId (MongoDB song id to remove)
 *
 * Success result:
 * - 200 with the updated playlist document after removal
 *
 * Possible errors:
 * - 403 if the playlist belongs to another user
 * - 404 if the playlist does not exist
 * - 500 if the update fails
 */
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) 
        return res.status(404).json({ message: 'Playlist not found' });

    if (playlist.ownerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your playlist' });

    playlist.songs = playlist.songs.filter(id => id.toString() !== req.params.songId);
    await playlist.save();

    res.json(playlist);

  } 
  catch (err) {
    res.status(500).json({ message: 'Failed to remove song from playlist' });
  }
};
