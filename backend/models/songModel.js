import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    youtubeId:    { 
        type: String, 
        required: true, 
        unique: true 
    },
    title:        { 
        type: String, 
        required: true 
    },
    thumbnailUrl: { 
        type: String, 
        required: true 
    },
  }, { timestamps: true }
);

const Song = mongoose.model('Song', songSchema);
export default Song;