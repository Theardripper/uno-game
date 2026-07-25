import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  playerId: { type: String, required: true },
  gameId: { type: String, required: true },
  score: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

scoreSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model('Score', scoreSchema);