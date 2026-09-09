import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  playerId: { type: String, required: true },
  gameId: { type: String, required: true }, // Can be the roomCode
  score: { type: Number, required: true }, // The final match score
  result: { type: String, enum: ["Victory", "Defeat", "WO"], required: true },
  duration: { type: String, default: "00:00" }, // "mm:ss"
  playersCount: { type: Number, default: 2 },
  xpEarned: { type: Number, default: 0 },
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