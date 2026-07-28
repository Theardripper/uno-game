import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: { type: String, required: true, default: 'active' },
    maxPlayers: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

gameSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model('Game', gameSchema);